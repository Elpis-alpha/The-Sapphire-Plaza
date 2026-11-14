import { RefObject, useEffect, useRef } from "react"
import { prefersMotion } from "../lib/motion"

/**
 * The pool in the hero photograph, brought to life.
 *
 * The photo is drawn to a WebGL canvas and, inside a hand-traced mask of the
 * pool, refracted through a slowly drifting height field. Moving the pointer
 * across the water (or tapping it) drops a ripple. If WebGL is unavailable or
 * the visitor prefers reduced motion, the plain <img> underneath stays.
 */

/** Outline of the water, in image-space (0–1, origin top-left). */
const POOL: [number, number][] = [
	[0.325, 0.684], [0.8, 0.684], [1, 0.775], [1, 1], [0.74, 1], [0.72, 0.965], [0.54, 0.96], [0.535, 0.94],
	[0.24, 0.945], [0.175, 0.925], [0.155, 0.89], [0.165, 0.85], [0.2, 0.795], [0.27, 0.73],
]

const MASK_W = 192
const MASK_H = 128
const MAX_RIPPLES = 6

const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
	vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
	gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec2 uWindow;      // fraction of the image that is visible
uniform vec2 uOrigin;      // top-left of that window, in image space
uniform float uAspect;     // image aspect ratio
uniform float uTime;
uniform vec4 uRipples[${MAX_RIPPLES}];

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float surface(vec2 p, float t) {
	float h = noise(p + vec2(t * 0.32, t * 0.2)) * 0.6;
	h += noise(p * 2.1 - vec2(t * 0.46, -t * 0.3)) * 0.3;
	h += noise(p * 4.3 + vec2(-t * 0.6, t * 0.52)) * 0.1;
	return h;
}

void main() {
	vec2 uv = uOrigin + vUv * uWindow;
	float water = smoothstep(0.3, 0.7, texture2D(uMask, uv).r);
	vec2 bend = vec2(0.0);
	float glint = 0.0;

	if (water > 0.001) {
		// The far edge of the pool is foreshortened: finer, flatter waves there.
		float near = clamp((uv.y - 0.68) / 0.32, 0.0, 1.0);
		vec2 p = uv * mix(vec2(64.0, 210.0), vec2(22.0, 62.0), near);
		float e = 0.14;
		float h = surface(p, uTime);
		vec2 slope = vec2(surface(p + vec2(e, 0.0), uTime) - h, surface(p + vec2(0.0, e), uTime) - h) / e;
		bend += slope * mix(0.0014, 0.0058, near);
		glint += max(0.0, slope.y) * 0.35;

		for (int i = 0; i < ${MAX_RIPPLES}; i++) {
			vec4 ripple = uRipples[i];
			float age = uTime - ripple.z;
			if (ripple.w > 0.0 && age > 0.0 && age < 6.0) {
				vec2 offset = (uv - ripple.xy) * vec2(uAspect, 2.7);
				float d = length(offset);
				float x = d - age * 0.085;
				float wave = sin(x * 105.0) * exp(-x * x * 800.0) * exp(-age * 0.85) * ripple.w;
				bend += normalize(offset + 1e-5) * wave * 0.0085;
				glint += wave * 0.7;
			}
		}
	}

	vec3 colour = texture2D(uImage, uv + bend * water).rgb;
	colour += water * glint * vec3(0.55, 0.74, 1.0) * 0.11;
	gl_FragColor = vec4(colour, 1.0);
}`

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
	const shader = gl.createShader(type)!
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader failed")
	return shader
}

const texture = (gl: WebGLRenderingContext, unit: number, source: TexImageSource) => {
	const tex = gl.createTexture()
	gl.activeTexture(gl.TEXTURE0 + unit)
	gl.bindTexture(gl.TEXTURE_2D, tex)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
	return tex
}

type Props = {
	/** The <img> to bring to life. Must be same-origin. */
	image: RefObject<HTMLImageElement>
	/** Element whose pointer events drive the ripples. */
	surface: RefObject<HTMLElement>
	/** Mirrors the image's CSS object-position, as fractions. */
	focus: [number, number]
}

const HeroWater = ({ image, surface, focus }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const img = image.current
		const host = surface.current
		if (!canvas || !img || !host || !prefersMotion()) return

		let gl: WebGLRenderingContext | null = null
		let frame = 0
		let visible = true
		let disposed = false
		const cleanups: (() => void)[] = []

		const start = () => {
			if (disposed || gl) return
			gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
			if (!gl) return
			const context = gl

			// Rasterise the pool outline; linear filtering softens its edge for free.
			const maskCanvas = document.createElement("canvas")
			maskCanvas.width = MASK_W
			maskCanvas.height = MASK_H
			const pen = maskCanvas.getContext("2d")!
			pen.fillStyle = "#000"
			pen.fillRect(0, 0, MASK_W, MASK_H)
			pen.fillStyle = "#fff"
			pen.beginPath()
			POOL.forEach(([x, y], i) => (i ? pen.lineTo(x * MASK_W, y * MASK_H) : pen.moveTo(x * MASK_W, y * MASK_H)))
			pen.closePath()
			pen.fill()
			const maskPixels = pen.getImageData(0, 0, MASK_W, MASK_H).data
			const inWater = (u: number, v: number) => {
				if (u < 0 || u > 1 || v < 0 || v > 1) return false
				const x = Math.min(MASK_W - 1, Math.floor(u * MASK_W))
				const y = Math.min(MASK_H - 1, Math.floor(v * MASK_H))
				return maskPixels[(y * MASK_W + x) * 4] > 127
			}

			let program: WebGLProgram
			try {
				program = context.createProgram()!
				context.attachShader(program, compile(context, context.VERTEX_SHADER, VERTEX))
				context.attachShader(program, compile(context, context.FRAGMENT_SHADER, FRAGMENT))
				context.linkProgram(program)
				if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error("link failed")
				context.useProgram(program)
				texture(context, 0, img)
				texture(context, 1, maskCanvas)
			} catch {
				gl = null
				return
			}

			const buffer = context.createBuffer()
			context.bindBuffer(context.ARRAY_BUFFER, buffer)
			context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), context.STATIC_DRAW)
			const position = context.getAttribLocation(program, "aPosition")
			context.enableVertexAttribArray(position)
			context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

			const uniform = (name: string) => context.getUniformLocation(program, name)
			context.uniform1i(uniform("uImage"), 0)
			context.uniform1i(uniform("uMask"), 1)
			const aspect = img.naturalWidth / img.naturalHeight
			context.uniform1f(uniform("uAspect"), aspect)
			const uWindow = uniform("uWindow")
			const uOrigin = uniform("uOrigin")
			const uTime = uniform("uTime")
			const uRipples = uniform("uRipples")

			// The visible window of the image, matching CSS `object-fit: cover`.
			const view = { w: 1, h: 1, x: 0, y: 0 }
			const resize = () => {
				const { clientWidth: width, clientHeight: height } = canvas
				if (!width || !height) return
				const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
				canvas.width = Math.round(width * dpr)
				canvas.height = Math.round(height * dpr)
				context.viewport(0, 0, canvas.width, canvas.height)
				const ratio = width / height
				view.w = ratio > aspect ? 1 : ratio / aspect
				view.h = ratio > aspect ? aspect / ratio : 1
				view.x = (1 - view.w) * focus[0]
				view.y = (1 - view.h) * focus[1]
				context.uniform2f(uWindow, view.w, view.h)
				context.uniform2f(uOrigin, view.x, view.y)
			}
			const observer = new ResizeObserver(resize)
			observer.observe(canvas)
			resize()
			cleanups.push(() => observer.disconnect())

			// Ripples: a small ring buffer of (x, y, birth, strength).
			const ripples = new Float32Array(MAX_RIPPLES * 4)
			let cursor = 0
			const t0 = performance.now()
			const clock = () => (performance.now() - t0) / 1000
			const drop = (u: number, v: number, strength: number) => {
				ripples.set([u, v, clock(), strength], cursor * 4)
				cursor = (cursor + 1) % MAX_RIPPLES
			}

			let last = { x: -999, y: -999, t: 0 }
			const toImage = (event: PointerEvent) => {
				const box = canvas.getBoundingClientRect()
				return [view.x + ((event.clientX - box.left) / box.width) * view.w, view.y + ((event.clientY - box.top) / box.height) * view.h] as const
			}
			const onMove = (event: PointerEvent) => {
				const now = performance.now()
				if (now - last.t < 110 || Math.hypot(event.clientX - last.x, event.clientY - last.y) < 46) return
				const [u, v] = toImage(event)
				if (!inWater(u, v)) return
				last = { x: event.clientX, y: event.clientY, t: now }
				drop(u, v, 0.55)
			}
			const onDown = (event: PointerEvent) => {
				const [u, v] = toImage(event)
				if (inWater(u, v)) drop(u, v, 1)
			}
			host.addEventListener("pointermove", onMove, { passive: true })
			host.addEventListener("pointerdown", onDown, { passive: true })
			cleanups.push(() => {
				host.removeEventListener("pointermove", onMove)
				host.removeEventListener("pointerdown", onDown)
			})

			// Now and then something touches the surface on its own.
			let nextDrop = 1.2
			const ambient = (time: number) => {
				if (time < nextDrop) return
				nextDrop = time + 1.8 + Math.random() * 2.6
				for (let attempt = 0; attempt < 12; attempt++) {
					const u = view.x + Math.random() * view.w
					const v = 0.7 + Math.random() * 0.28
					if (v < view.y + view.h && inWater(u, v)) return drop(u, v, 0.4 + Math.random() * 0.3)
				}
			}

			const render = () => {
				frame = 0
				if (disposed) return
				const time = clock()
				ambient(time)
				context.uniform1f(uTime, time)
				context.uniform4fv(uRipples, ripples)
				context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
				canvas.style.opacity = "1"
				if (visible && !document.hidden) frame = requestAnimationFrame(render)
			}
			const wake = () => {
				if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(render)
			}
			const watcher = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting
				wake()
			})
			watcher.observe(canvas)
			document.addEventListener("visibilitychange", wake)
			cleanups.push(() => {
				watcher.disconnect()
				document.removeEventListener("visibilitychange", wake)
			})
			wake()
		}

		if (img.complete && img.naturalWidth) start()
		else img.addEventListener("load", start, { once: true })

		return () => {
			disposed = true
			img.removeEventListener("load", start)
			cancelAnimationFrame(frame)
			cleanups.forEach(cleanup => cleanup())
		}
	}, [image, surface, focus])

	return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000" />
}

export default HeroWater

import { FaPlus } from "react-icons/fa"
import { useState, useRef, useEffect } from "react"


const QSet = ({ faq }: { faq: any }) => {
	const [showAnswer, setShowAnswer] = useState(false)
	const answerRef = useRef(null)
	useEffect(() => {
		// @ts-ignore
		const content = (answerRef.current as HTMLDivElement)
		content.style.transition = "max-height 0.2s ease-out"
		if (showAnswer) {
			content.style.maxHeight = content.scrollHeight + "px";
		} else {
			content.style.maxHeight = "0px"
		}
	}, [showAnswer])
	
	return (
		<div className="border-b border-darkOverlay pb-6">
			<div className="flex gap-6 items-center justify-between font-semibold cursor-pointer" onClick={() => setShowAnswer(prev => !prev)}>
				<div>{faq.question}</div>
				<div className={"text-2xl duration-200 " + (showAnswer ? " rotate-[135deg]" : "")}><FaPlus /></div>
			</div>
			<div className="opacity-70 overflow-hidden max-h-0" ref={answerRef}>
				<div className="pt-5"></div>
				{faq.answer}
			</div>
		</div>
	)
}
export default QSet
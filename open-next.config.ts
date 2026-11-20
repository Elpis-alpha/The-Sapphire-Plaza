import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue"

// Time-based ISR (`revalidate: 600`) needs a cache that can be written to and a
// queue. There is no tag cache: it is only for revalidateTag/revalidatePath,
// which the pages router site does not use.
export default defineCloudflareConfig({
	incrementalCache: r2IncrementalCache,
	queue: doQueue,
})

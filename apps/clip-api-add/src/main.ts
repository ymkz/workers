import { fetchClipInfo } from './helper'

const worker: ExportedHandler<Env> = {
  fetch: async (req, env, _ctx) => {
    if (!(req.method === 'POST')) {
      return new Response(null, { status: 405 })
    }

    const body = await req.json<RequestClipApiAdd>()

    const responseUserAgent = await env.getUserAgent.fetch(
      new URL('/user-agent-manager', req.url).toString()
    )
    const userAgent = await responseUserAgent.text()
    const clipInfo = await fetchClipInfo(body.url, userAgent)

    if (clipInfo.image) {
      await env.clipData.put(clipInfo.id, clipInfo.image.src, {
        metadata: {
          contentType: clipInfo.image.contentType,
        },
      })
    }

    const responseClipData = await env.getClip.fetch(
      new URL('/clip-api-get', req.url).toString()
    )
    const prev = await responseClipData.json<ClipItem[]>()

    const data = {
      id: clipInfo.id,
      url: clipInfo.url,
      title: clipInfo.title,
      description: clipInfo.description,
      hasImage: Boolean(clipInfo.image),
    }

    const next = [data, ...prev]
    await env.clipData.put('clips', JSON.stringify(next))

    return new Response()
  },
}

export default worker

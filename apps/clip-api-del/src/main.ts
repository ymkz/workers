const worker: ExportedHandler<Env> = {
  fetch: async (req, env, _ctx) => {
    if (!(req.method === 'DELETE')) {
      return new Response(null, { status: 405 })
    }

    const body = await req.json<RequestClipApiDel>()

    const responseClipData = await env.getClip.fetch(
      new URL('/clip-api-get', req.url).toString()
    )
    const prev = await responseClipData.json<ClipItem[]>()
    const next = prev.filter((item) => item.id !== body.id)

    // clip-itemの削除
    await env.clipData.put('clips', JSON.stringify(next))

    // clip-imageの削除
    await env.clipData.delete(body.id)

    return new Response()
  },
}

export default worker

const worker: ExportedHandler<Env> = {
  fetch: async (req, env, _ctx) => {
    if (!(req.method === 'GET')) {
      return new Response(null, { status: 405 })
    }

    const key = new URL(req.url).searchParams.get('key')

    if (!key) {
      return new Response(null, { status: 400 })
    }

    const image = await env.clipData.getWithMetadata<ClipImageMetaData>(
      key,
      'arrayBuffer'
    )

    return new Response(image.value, {
      headers: {
        'Cache-Control': 'max-age=2419200', // 12hour
        'Content-Type':
          image.metadata?.contentType ?? 'application/octet-stream',
      },
    })
  },
}

export default worker

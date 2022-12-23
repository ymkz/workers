const worker: ExportedHandler<Env> = {
  fetch: async (req, env, _ctx) => {
    if (!(req.method === 'GET')) {
      return new Response(null, { status: 405 })
    }

    const clips = await env.clipData.get<ClipItem[]>('clips', 'json')

    return new Response(JSON.stringify(clips ?? []), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}

export default worker

const worker: ExportedHandler<Env> = {
  fetch: async (req, env, _ctx) => {
    switch (req.method) {
      case 'GET': {
        const userAgent = await env.userAgentData.get('user-agent', 'text')
        return new Response(userAgent ?? 'NOTHING_USER_AGENT')
      }
      case 'PUT': {
        const body = await req.json<RequestUserAgentPut>()
        await env.userAgentData.put('user-agent', body.ua)
        return new Response()
      }
      default: {
        return new Response(null, { status: 404 })
      }
    }
  },
  scheduled: async (_, env, ctx) => {
    ctx.waitUntil(
      (async () => {
        const url =
          'https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&num=1'

        const response = await fetch(url)
        const [latest] = await response.json<ResponseChromiumReleases>()

        const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${latest.version} Safari/537.36`

        env.userAgentData.put('user-agent', userAgent, { metadata: latest })

        console.log(`UPDATED userAgentData user-agent: ${userAgent}`)
      })()
    )
  },
}

export default worker

const updateUserAgent = async () => {
  console.log('scheduled OK')
}

const worker: ExportedHandler<Env> = {
  fetch: async (request, env, ctx) => {
    return new Response('fetch OK')
  },
  scheduled: async (controller, env, ctx) => {
    ctx.waitUntil(updateUserAgent())
  },
}

export default worker

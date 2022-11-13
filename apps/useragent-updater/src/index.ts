import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { update } from './updater'

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (ctx) => {
  const ua = await ctx.env.KV_USERAGENT_DATA.get('ua', 'text')
  return ctx.text(ua)
})

app.put(
  '/',
  validator((v) => ({
    ua: v.json('ua').isRequired(),
  })),
  async (ctx) => {
    const { ua } = ctx.req.valid()
    await ctx.env.KV_USERAGENT_DATA.put('ua', ua)
    return ctx.json({ updated: ua })
  }
)

const worker: ExportedHandler<Env> = {
  fetch: app.fetch,
  scheduled: async (_, env, ctx) => {
    ctx.waitUntil(update(env.KV_USERAGENT_DATA))
  },
}

export default worker

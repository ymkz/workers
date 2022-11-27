import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { fetchClipInfo, getUserAgent } from './helper'
import {
  addClipImage,
  addClipItem,
  deleteClipImage,
  deleteClipItem,
  getClipData,
  getClipImage,
} from './repository'
import { addSchema, delSchema, imageSchema } from './schema'

const app = new Hono<{ Bindings: Env }>()

app.get('/get', async (ctx) => {
  const data = await getClipData(ctx.env.kv_clip)
  return ctx.json(data)
})

app.post('/add', validator(addSchema), async (ctx) => {
  const { url } = ctx.req.valid()

  const userAgent = await getUserAgent(ctx.env.ua_manager)
  const clipInfo = await fetchClipInfo(url, userAgent)

  if (clipInfo.image) {
    await addClipImage(ctx.env.kv_clip, clipInfo.id, clipInfo.image)
  }

  await addClipItem(ctx.env.kv_clip, {
    id: clipInfo.id,
    url: clipInfo.url,
    title: clipInfo.title,
    description: clipInfo.description,
    hasImage: Boolean(clipInfo.image),
  })

  return ctx.body(null, 200)
})

app.delete('/del', validator(delSchema), async (ctx) => {
  const { id } = ctx.req.valid()

  await Promise.all([
    deleteClipItem(ctx.env.kv_clip, id),
    deleteClipImage(ctx.env.kv_clip, id),
  ])

  return ctx.body(null, 200)
})

app.get('/image/:key', validator(imageSchema), async (ctx) => {
  const { key } = ctx.req.valid()

  const image = await getClipImage(ctx.env.kv_clip, key)

  return ctx.body(image.value, 200, {
    'Cache-Control': 'max-age=2419200', // 12hour
    'Content-Type': image.metadata?.contentType ?? 'application/octet-stream',
  })
})

export default app

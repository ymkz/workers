import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { addSchema, delSchema, imageSchema } from './schema'
import {
  clipAddService,
  clipDelService,
  clipGetService,
  clipImageService,
} from './service'

const getUserAgent = async () => {
  // https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&num=1
  // 上記から取得するcronjobを別途たててKVに保持しておき、1weekごとに更新する？
  const version = '107.0.5304.87'
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`
}

export const clip = new Hono<{ Bindings: Env }>()

clip.get('/get', async (ctx) => {
  const result = await clipGetService(ctx)
  return ctx.json(result)
})

clip.post('/add', validator(addSchema), async (ctx) => {
  const result = await clipAddService(ctx)
  return ctx.json(result)
})

clip.delete('/del', validator(delSchema), (ctx) => {
  const result = clipDelService(ctx)
  return ctx.json(result)
})

clip.get('/image/:key', validator(imageSchema), async (ctx) => {
  const result = await clipImageService(ctx)
  return ctx.json(result)
})

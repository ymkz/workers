import { Context } from 'hono'
import { addSchema, delSchema, imageSchema } from './schema'

export const clipGetService = async (
  context: Context<never, { Bindings: Env }>
) => {
  return {}
}

export const clipAddService = async (
  context: Context<never, { Bindings: Env }, ReturnType<typeof addSchema>>
) => {
  const {} = context.req.valid()
  return {}
}

export const clipDelService = async (
  context: Context<never, { Bindings: Env }, ReturnType<typeof delSchema>>
) => {
  return {}
}

export const clipImageService = async (
  context: Context<'key', { Bindings: Env }, ReturnType<typeof imageSchema>>
) => {
  return {}
}

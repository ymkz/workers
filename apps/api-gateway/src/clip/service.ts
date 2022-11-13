import { Context } from "hono";
import {
  addClipImage,
  addClipItem,
  deleteClipImage,
  deleteClipItem,
  getClipData,
  getClipImage,
} from "./repository";
import { addSchema, delSchema, imageSchema } from "./schema";
import { fetchClipInfo } from "./util-clip-info";
import { getUserAgent } from "./util-useragent";

export const clipGetService = async (
  ctx: Context<never, { Bindings: Env }>
) => {
  const clipData = await getClipData(ctx.env.KV_CLIP_DATA);
  return clipData;
};

export const clipAddService = async (
  ctx: Context<never, { Bindings: Env }, ReturnType<typeof addSchema>>
) => {
  const { url } = ctx.req.valid();

  const userAgent = await getUserAgent(ctx);
  const clipInfo = await fetchClipInfo(url, userAgent);

  if (clipInfo.image) {
    await addClipImage(ctx.env.KV_CLIP_DATA, clipInfo.id, clipInfo.image);
  }

  await addClipItem(ctx.env.KV_CLIP_DATA, {
    id: clipInfo.id,
    url: clipInfo.url,
    title: clipInfo.title,
    description: clipInfo.description,
    hasImage: Boolean(clipInfo.image),
  });
};

export const clipDelService = async (
  ctx: Context<never, { Bindings: Env }, ReturnType<typeof delSchema>>
) => {
  const { id } = ctx.req.valid();

  await Promise.all([
    deleteClipItem(ctx.env.KV_CLIP_DATA, id),
    deleteClipImage(ctx.env.KV_CLIP_DATA, id),
  ]);
};

export const clipImageService = async (
  ctx: Context<"key", { Bindings: Env }, ReturnType<typeof imageSchema>>
) => {
  const { key } = ctx.req.valid();

  const image = await getClipImage(ctx.env.KV_CLIP_DATA, key);

  return image;
};

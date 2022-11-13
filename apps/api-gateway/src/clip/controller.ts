import { Hono } from "hono";
import { validator } from "hono/validator";
import { addSchema, delSchema, imageSchema } from "./schema";
import {
  clipAddService,
  clipDelService,
  clipGetService,
  clipImageService,
} from "./service";

export const clip = new Hono<{ Bindings: Env }>();

clip.get("/get", async (ctx) => {
  const result = await clipGetService(ctx);
  return ctx.json(result);
});

clip.post("/add", validator(addSchema), async (ctx) => {
  const result = await clipAddService(ctx);
  return ctx.json(result);
});

clip.delete("/del", validator(delSchema), (ctx) => {
  const result = clipDelService(ctx);
  return ctx.json(result);
});

clip.get("/image/:key", validator(imageSchema), async (ctx) => {
  const result = await clipImageService(ctx);
  return ctx.json(result);
});

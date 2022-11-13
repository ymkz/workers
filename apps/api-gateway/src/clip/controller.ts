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
  const data = await clipGetService(ctx);
  return ctx.json(data);
});

clip.post("/add", validator(addSchema), async (ctx) => {
  await clipAddService(ctx);
  return ctx.body(null, 200);
});

clip.delete("/del", validator(delSchema), async (ctx) => {
  await clipDelService(ctx);
  return ctx.body(null, 200);
});

clip.get("/image/:key", validator(imageSchema), async (ctx) => {
  const image = await clipImageService(ctx);
  return ctx.body(image.value, 200, {
    "Cache-Control": "max-age=2419200", // 12hour
    "Content-Type": image.metadata?.contentType ?? "application/octet-stream",
  });
});

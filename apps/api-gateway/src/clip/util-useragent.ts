import { Context } from "hono";
import { createAppError } from "../error";

export const getUserAgent = async (
  ctx: Context<never, { Bindings: Env }>
): Promise<string> => {
  try {
    const url = new URL("/", ctx.req.url).toString();
    const response = await ctx.env.WK_USERAGENT_UPDATER.fetch(url);
    const userAgent = await response.text();
    return userAgent;
  } catch (e) {
    throw createAppError(500, "GetUserAgentFromKvError");
  }
};

import { Hono } from "hono";
import { validator } from "hono/validator";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (ctx) => {
	const ua = await ctx.env.kv_ua.get("ua", "text");
	return ctx.text(ua ?? "");
});

app.put(
	"/",
	validator((v) => ({
		ua: v
			.json("ua")
			.isRequired()
			.message(`request body 'ua' is required as 'string'`),
	})),
	async (ctx) => {
		const { ua } = ctx.req.valid();
		await ctx.env.kv_ua.put("ua", ua);
		return ctx.body(null, 200);
	},
);

const worker: ExportedHandler<Env> = {
	fetch: app.fetch,
	scheduled: async (_, env, ctx) => {
		ctx.waitUntil(
			(async () => {
				const url =
					"https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&num=1";

				const response = await fetch(url);
				const [latest] = await response.json<ResponseChromiumReleases>();

				const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${latest.version} Safari/537.36`;

				env.kv_ua.put("ua", userAgent, { metadata: latest });

				console.log(`UPDATED kv_ua: ${userAgent}`);
			})(),
		);
	},
};

export default worker;

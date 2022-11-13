import { Hono } from "hono";
import { clip } from "./clip/controller";
import { AppError } from "./error";

const app = new Hono<{ Bindings: Env }>();

app.route("/clip", clip);

app.onError((err, ctx) => {
	if (err instanceof AppError) {
		return ctx.json(err);
	} else {
		return ctx.json({ error: "UNKNOWN ERROR" });
	}
});

export default app;

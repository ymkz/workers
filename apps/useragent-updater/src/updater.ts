type ResponseChromiumReleases = {
	channel: "Stable";
	chromium_main_branch_position: number;
	hashes: {
		angle: string;
		chromium: string;
		dawn: string;
		devtools: string;
		pdfium: string;
		skia: string;
		v8: string;
		webrtc: string;
	};
	milestone: number;
	platform: string;
	previous_version: string;
	time: number;
	version: string;
}[];

export const update = async (kv: KVNamespace) => {
	const url =
		"https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&num=1";

	const response = await fetch(url);
	const [latest] = await response.json<ResponseChromiumReleases>();

	const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${latest.version} Safari/537.36`;

	kv.put("ua", userAgent, { metadata: latest });

	console.log(`KV_USERAGENT_DATA: ${userAgent}`);
};

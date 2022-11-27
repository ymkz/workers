type Env = {
	kv_ua: KVNamespace;
	kv_clip: KVNamespace;
	kv_novel: KVNamespace;
	ua_manager: Fetcher;
};

type MetaData = {
	contentType: string;
};

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

type ClipItem = {
	id: string;
	url: string;
	title: string;
	hasImage: boolean;
	description?: string;
};

type ClipImage = {
	src: ArrayBuffer;
	contentType: string;
};

type ClipImageMetaData = {
	contentType: string;
};

type ClipInfo = {
	id: string;
	url: string;
	title: string;
	description?: string;
	image?: ClipImage;
};

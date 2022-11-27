export const getClipData = async (kv: KVNamespace): Promise<ClipItem[]> => {
	try {
		const data = await kv.get<ClipItem[]>("clip-data", "json");
		return data ?? [];
	} catch {
		throw new Error("GetClipDataFromKvError");
	}
};

export const addClipItem = async (
	kv: KVNamespace,
	data: ClipItem,
): Promise<void> => {
	try {
		const prev = await getClipData(kv);
		const next = [data, ...prev];
		await kv.put("clip-data", JSON.stringify(next));
	} catch {
		throw new Error("AddClipItemToKvError");
	}
};

export const deleteClipItem = async (
	kv: KVNamespace,
	id: ClipItem["id"],
): Promise<void> => {
	try {
		const prev = await getClipData(kv);
		const next = prev.filter((item) => item.id !== id);
		await kv.put("clip-data", JSON.stringify(next));
	} catch {
		throw new Error("DeleteClipItemFromKvError");
	}
};

export const getClipImage = async (
	kv: KVNamespace,
	key: ClipItem["id"],
): Promise<
	KVNamespaceGetWithMetadataResult<ArrayBuffer, ClipImageMetaData>
> => {
	try {
		const image = await kv.getWithMetadata<ClipImageMetaData>(
			key,
			"arrayBuffer",
		);
		return image;
	} catch {
		throw new Error("GetClipImageFromKvError");
	}
};

export const addClipImage = async (
	kv: KVNamespace,
	key: ClipItem["id"],
	image: ClipImage,
): Promise<void> => {
	try {
		await kv.put(key, image.src, {
			metadata: {
				contentType: image.contentType,
			},
		});
	} catch {
		throw new Error("");
	}
};

export const deleteClipImage = async (
	kv: KVNamespace,
	key: ClipItem["id"],
): Promise<void> => {
	try {
		await kv.delete(key);
	} catch {
		throw new Error("");
	}
};

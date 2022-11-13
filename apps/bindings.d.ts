type Env = {
  KV_CLIP_DATA: KVNamespace;
  KV_NOVEL_DATA: KVNamespace;
  KV_USERAGENT_DATA: KVNamespace;
};

type MetaData = {
  contentType: string;
};

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

type ClipInfo = {
  id: string;
  url: string;
  title: string;
  description?: string;
  image?: ClipImage;
};

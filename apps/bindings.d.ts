type Env = {
  getUserAgent: Fetcher
  getClip: Fetcher
  addClip: Fetcher
  delClip: Fetcher
  clipData: KVNamespace
  userAgentData: KVNamespace
}

type ResponseChromiumReleases = {
  channel: 'Stable'
  chromium_main_branch_position: number
  hashes: {
    angle: string
    chromium: string
    dawn: string
    devtools: string
    pdfium: string
    skia: string
    v8: string
    webrtc: string
  }
  milestone: number
  platform: string
  previous_version: string
  time: number
  version: string
}[]

type RequestClipApiAdd = {
  url: string
}

type RequestClipApiDel = {
  id: string
}

type RequestUserAgentPut = {
  ua: string
}

type ClipItem = {
  id: string
  url: string
  title: string
  hasImage: boolean
  description: string | undefined
}

type ClipImage = {
  src: ArrayBuffer
  contentType: string
}

type ClipImageMetaData = {
  contentType: string
}

type ClipInfo = {
  id: string
  url: string
  title: string
  description: string | undefined
  image: ClipImage | undefined
}

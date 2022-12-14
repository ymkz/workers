export async function fetchClipInfo(
  url: string,
  userAgent: string
): Promise<ClipInfo> {
  let info: { [key: string]: string } = {}

  const id = Date.now().toString()

  const response = await fetch(url, {
    headers: { 'user-agent': userAgent },
  }).catch(() => {
    throw new Error('FetchClipInfoFailOnClient')
  })

  if (!response.ok) {
    throw new Error('FetchClipInfoFailOnServer')
  }

  await new HTMLRewriter()
    .on('head > title', {
      text(text) {
        if (text.text) {
          info['title'] = text.text
        }
      },
    })
    .on('meta', {
      element(element) {
        const name = element.getAttribute('name')
        const property = element.getAttribute('property')
        const content = element.getAttribute('content')
        const key = name || property
        if (key && content) {
          info[key] = content
        }
      },
    })
    .transform(response.clone())
    .text()
    .catch(() => {
      throw new Error('FetchClipInfoCannotParse')
    })

  const title =
    info['title'] || info['og:title'] || info['twitter:title'] || url
  const description =
    info['description'] ||
    info['og:description'] ||
    info['twitter:description'] ||
    undefined
  const maybeImageUrl =
    info['og:image'] ||
    info['og:image:url'] ||
    info['og:image:secure_url'] ||
    info['twitter:image'] ||
    info['twitter:image:src'] ||
    undefined

  if (!maybeImageUrl) {
    return {
      id,
      url,
      title,
      description,
      image: undefined,
    }
  }

  /**
   * URLのパースに失敗した場合をケアする
   * 相対パスでogImageを記述されている場合などで例外が発生する
   */
  try {
    const imageUrl = new URL(maybeImageUrl).protocol.startsWith('http')
      ? maybeImageUrl
      : undefined

    if (!imageUrl) {
      return {
        id,
        url,
        title,
        description,
        image: undefined,
      }
    }

    const imageResponse = await fetch(imageUrl).catch(() => {
      throw new Error('FetchClipImageFailOnClient')
    })
    if (!imageResponse.ok) {
      throw new Error('FetchClipImageFailOnServer')
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer().catch(() => {
      throw new Error('FetchClipImageNotArrayBuffer')
    })
    const imageContentType = imageResponse.headers.get('Content-Type')

    return {
      id,
      url,
      title,
      description,
      image: {
        src: imageArrayBuffer,
        contentType: imageContentType ?? 'application/octet-stream',
      },
    }
  } catch (e) {
    return {
      id,
      url,
      title,
      description,
      image: undefined,
    }
  }
}

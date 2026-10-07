// // composables/useImage.ts

export const useImage = () => {
  const fallbackImage = '/images/default-gray.png' // your local fallback image

  function getImageUrl(url: string | null | undefined): string {
    if (!url) return fallbackImage
    return url
  }

  function onImageError(event: Event) {
    const img = event.target as HTMLImageElement
    img.src = fallbackImage
    img.onerror = null // prevent infinite loop if fallback also fails
  }

  async function checkImageUrl(url: string): Promise<string> {
    try {
      const res = await fetch(url, { method: 'HEAD' })
      return res.ok ? url : fallbackImage
    } catch {
      return fallbackImage
    }
  }

  return { getImageUrl, onImageError, checkImageUrl, fallbackImage }
}
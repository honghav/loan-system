// composables/useImageError.ts

// composables/useImageError.ts
export const useImageError = () => {
  const fallbackImage = "/images/default-gray.png";
  function onImageError(payload: string | Event) {
    if (payload instanceof Event) {
      const img = payload.target as HTMLImageElement;

      // const fallback = `/images/default-gray.png`

      img.src = fallbackImage;
      img.srcset = fallbackImage;
      img.onerror = null;
    }
  }

  return { fallbackImage, onImageError };
};

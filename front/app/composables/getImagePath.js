export default function getImagePath(image, path = "") {
  const config = useRuntimeConfig();

  if (!image) {
    return "/images/default.png";
  }

  if (image.includes("base64")) {
    return image;
  }

  // If image is already a full URL
  if (image.startsWith("http")) {
    return image;
  }

  return `${config.public.apiUrl}/../${path}/${image}`.replace(
    /([^:]\/)\/+/g,
    "$1",
  );
}

const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD = "/image/upload/";
/** https://cloudinary.com/documentation/image_optimization */
const AUTO = "q_auto,f_auto";

/**
 * Inserta transformaciones de entrega de Cloudinary. Cualquier otra URL se devuelve igual.
 */
export function deliveryImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (!url.includes(CLOUDINARY_HOST) || !url.includes(UPLOAD)) return url;
  if (url.includes(`${UPLOAD}${AUTO}/`)) return url;
  return url.replace(UPLOAD, `${UPLOAD}${AUTO}/`);
}

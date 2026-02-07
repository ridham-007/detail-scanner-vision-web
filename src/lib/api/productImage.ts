/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchProductImage = async (
  barcode: string
): Promise<string | null> => {
  if (!barcode) return null;

  const url = `https://barcode-scanner-webn.onrender.com/api/product/image/${barcode}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    let parsed: any;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    let finalUrl: string | null = null;

    if (typeof parsed === "string" && parsed.startsWith("http")) {
      finalUrl = parsed;
    }

    if (parsed?.image_url) finalUrl = parsed.image_url;
    if (parsed?.image) finalUrl = parsed.image;
    if (parsed?.url) finalUrl = parsed.url;
    if (parsed?.images?.[0]) finalUrl = parsed.images[0];

    return finalUrl;
  } catch (error) {
    console.error("Image API Error:", error);
    return null;
  }
};
type ImageResponse = {
  image_url?: string;
  image?: string;
  url?: string;
  images?: string[];
};

export const fetchProductImage = async (
  barcode: string,
  deviceId: string,
  token?: string
): Promise<string | null> => {
  if (!barcode) return null;

  const url = `https://api.eateriq.com/api/product/image/${barcode}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-device-id": deviceId
      },
    });

    const text = await res.text();

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    let finalUrl: string | null = null;

    // Case 1: API returns direct string URL
    if (typeof parsed === "string" && parsed.startsWith("http")) {
      finalUrl = parsed;
    }

    // Case 2: API returns object
    if (typeof parsed === "object" && parsed !== null) {
      const obj = parsed as ImageResponse;

      if (obj.image_url) finalUrl = obj.image_url;
      if (obj.image) finalUrl = obj.image;
      if (obj.url) finalUrl = obj.url;
      if (obj.images?.[0]) finalUrl = obj.images[0];
    }

    return finalUrl;
  } catch (error) {
    console.error("Image API Error:", error);
    return null;
  }
};
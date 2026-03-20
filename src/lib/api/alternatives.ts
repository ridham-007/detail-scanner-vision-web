export interface AlternativeProduct {
  barcode: string;
  name: string;
  image: string;
  health_score: number;
}

export async function fetchAlternatives(barcode: string,  deviceId: string, token?: string,) {
  const res = await fetch(
    `https://api.eateriq.com/alternatives/product/${barcode}/full`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        'x-device-id': deviceId
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch alternatives");
  }

  return res.json();
}
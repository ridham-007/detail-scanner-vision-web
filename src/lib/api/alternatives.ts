export interface AlternativeProduct {
  barcode: string;
  name: string;
  image: string;
  health_score: number;
}

export async function fetchAlternatives(barcode: string) {
  const res = await fetch(
    `https://barcode-scanner-webn.onrender.com/alternatives/product/${barcode}/full`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch alternatives");
  }

  return res.json();
}

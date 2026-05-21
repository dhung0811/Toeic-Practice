const TOEIC_QUERIES = [
  "office meeting workplace people",
  "shopping store market people",
  "airport travel transportation",
  "restaurant cafe dining people",
  "construction workers building",
  "park outdoor people activity",
  "hospital medical staff",
  "classroom students learning",
  "conference presentation business",
  "kitchen cooking people",
];

export interface UnsplashPhoto {
  displayUrl: string;
  analysisUrl: string;
}

export async function getRandomPhoto(): Promise<UnsplashPhoto> {
  const query = TOEIC_QUERIES[Math.floor(Math.random() * TOEIC_QUERIES.length)];
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
    {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    }
  );
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
  const data = await res.json();
  return {
    displayUrl: data.urls.regular as string,
    analysisUrl: data.urls.small as string,
  };
}

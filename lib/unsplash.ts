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
  "bank finance customer service",
  "hotel lobby reception staff",
  "factory warehouse workers machinery",
  "supermarket grocery shopping",
  "gym fitness exercise people",
  "library reading students books",
  "post office delivery mail",
  "train station commuters platform",
  "museum gallery visitors art",
  "pharmacy drugstore customer",
  "car repair mechanic garage",
  "garden landscaping outdoor workers",
  "office reception front desk",
  "sports stadium audience game",
  "farmers market vegetables fruit",
  "recycling waste management workers",
  "real estate house tour agent",
  "truck delivery loading dock",
  "photography studio professional shoot",
  "lab scientists research equipment",
];

export interface UnsplashPhoto {
  displayUrl: string;
  description: string;
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

  const parts: string[] = [];
  if (data.description) parts.push(data.description);
  if (data.alt_description) parts.push(data.alt_description);
  if (Array.isArray(data.tags)) {
    parts.push(data.tags.map((t: { title: string }) => t.title).join(", "));
  }

  return {
    displayUrl: data.urls.regular as string,
    description: parts.join(". ") || query,
  };
}

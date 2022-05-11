export async function getLinks(
  url: string,
  maxDepth: string,
  maxRequests: string
) {
  const response = await fetch(
    `/api/crawler?url=${url}&max_depth=${maxDepth}&max_requests=${maxRequests}`
  );
  return response.json();
}

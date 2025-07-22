export const normalizeURL = (urlString: string): string => {
  let normalizedURL = urlString.toLowerCase();
  normalizedURL = normalizedURL.replace("https://", "");
  normalizedURL = normalizedURL.replace("http://", "");
  normalizedURL = normalizedURL.replace("www.", "");
  normalizedURL = normalizedURL.replace(/\/+$/, "");
  return normalizedURL;
};

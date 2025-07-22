import { JSDOM } from "jsdom";

export const normalizeURL = (urlString: string): string => {
  let normalizedURL = urlString.toLowerCase();
  normalizedURL = normalizedURL.replace("https://", "");
  normalizedURL = normalizedURL.replace("http://", "");
  normalizedURL = normalizedURL.replace("www.", "");
  normalizedURL = normalizedURL.replace(/\/+$/, "");
  return normalizedURL;
};

export const getURLsFromHTML = (html: string, baseURL: string): string[] => {
  const urls = [];
  const dom = new JSDOM(html);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.startsWith("/")) {
      try {
        const fullURL = new URL(linkElement.href, baseURL);
        urls.push(fullURL.toString());
      } catch (error) {
        console.log(`Error with relative URL: ${error}`);
      }
    } else {
      try {
        const fullURL = new URL(linkElement.href);
        urls.push(fullURL.toString());
      } catch (error) {
        console.log(`Error with absolute URL: ${error}`);
      }
    }
  }
  return urls;
};

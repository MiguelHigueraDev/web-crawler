import { JSDOM } from "jsdom";
import pLimit from "p-limit";

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

class ConcurrentCrawler {
  baseURL: string;
  pages: Record<string, number>;
  limit: ReturnType<typeof pLimit>;

  constructor(
    baseURL: string,
    pages: Record<string, number>,
    limit: ReturnType<typeof pLimit>
  ) {
    this.baseURL = baseURL;
    this.pages = pages;
    this.limit = limit;
  }

  private addPageVisit(normalizedURL: string): boolean {
    if (this.pages[normalizedURL] == undefined) {
      this.pages[normalizedURL] = 1;
      return true;
    }
    this.pages[normalizedURL]++;
    return false;
  }

  private getHTML = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (response.status > 399) {
      console.log(`Error fetching ${url}: ${response.statusText}`);
      return "";
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.log(`Error fetching ${url}: ${response.statusText}`);
      return "";
    }

    return await this.limit(async () => {
      return await response.text();
    });
  };

  private crawlPage = async (currentURL: string): Promise<void> => {
    const baseURLObj = new URL(this.baseURL);
    const currentURLObj = new URL(currentURL);

    if (currentURLObj.hostname !== baseURLObj.hostname) {
      return;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    const isNewPage = this.addPageVisit(normalizedCurrentURL);
    if (!isNewPage) {
      return;
    }

    console.log(`actively crawling ${currentURL}`);

    try {
      const htmlBody = await this.getHTML(currentURL);

      if (htmlBody === "") {
        return;
      }

      const nextURLs = getURLsFromHTML(htmlBody, this.baseURL);

      await Promise.all(nextURLs.map((nextURL) => this.crawlPage(nextURL)));
    } catch (err) {
      console.log(`error in crawlPage: ${err}`);
    }
  };

  crawl = async (): Promise<Record<string, number>> => {
    await this.crawlPage(this.baseURL);
    return this.pages;
  };
}

export const crawlSiteAsync = async (
  baseURL: string,
  pages: Record<string, number>,
  limit: ReturnType<typeof pLimit>
) => {
  const crawler = new ConcurrentCrawler(baseURL, pages, limit);
  const crawledPages = await crawler.crawl();
  return crawledPages;
};

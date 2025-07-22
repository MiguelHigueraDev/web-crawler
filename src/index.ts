import { argv } from "process";
import { crawlSiteAsync } from "./crawl";
import pLimit from "p-limit";
import { printReport } from "./report";

const main = async () => {
  if (argv.length != 3) {
    console.log("Usage: npm run start <url>");
    process.exit(1);
  }

  const baseURL = argv[2];
  console.log(`Starting crawl of ${baseURL}`);
  const pages = await crawlSiteAsync(baseURL, {}, pLimit(10));
  printReport(pages, baseURL);
};

main();

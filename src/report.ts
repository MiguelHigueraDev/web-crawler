export const printReport = (pages: Record<string, number>, baseURL: string) => {
  console.log("===========");
  console.log(`REPORT for ${baseURL}`);
  console.log("===========");
  const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]);
  for (const [url, count] of sortedPages) {
    console.log(`Found ${count} internal links to ${url}`);
  }
};

import { NodeHtmlMarkdown } from "node-html-markdown";

const nhm = new NodeHtmlMarkdown();

/** Fetch a URL and convert its HTML content to markdown */
export async function scrapeUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  return nhm.translate(html);
}

// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

/**
 *
 * @param {Document{}} document
 * @param {string} property
 * @returns {string || null}
 */
const extractContentFromMeta = (document, property) => {
  return (
    document?.head?.querySelector(`meta[property="og:${property}"]`)?.content ??
    null
  );
};

/**
 *
 * @param {Document{}} document
 * @returns {string || null}
 */
const extractTitle = (document) => {
  return document.querySelector("title")?.innerHTML ?? null;
};

/**
 *
 * @param {Document{}} document
 * @param {string} name
 * @returns {string || null}
 */
const extractValueByName = (document, name) => {
  const element = document.getElementsByName(name);
  if (element.length) {
    if (name === "keywords") {
      const keywords = [];
      for (let i = 0; i < element.length; i += 1) {
        if (element[i].content) keywords.push(...element[i].content.split(","));
      }
      return keywords;
    }
    return element[0].content;
  }
  return null;
};

/**
 *
 * @param {Document{}} document
 * @returns {boolean}
 */
const isDescriptionAsProperty = (document) => {
  return Boolean(document?.querySelector(`meta[property="og:description"]`));
};

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  const document = new DOMParser().parseFromString(html, "text/html");

  return {
    url: extractContentFromMeta(document, "url"),
    siteName: extractContentFromMeta(document, "site_name"),
    title: extractTitle(document),
    description: isDescriptionAsProperty(document)
      ? extractContentFromMeta(document, "description")
      : extractValueByName(document, "description"),
    keywords: extractValueByName(document, "keywords"),
    author: extractValueByName(document, "author"),
  };
}

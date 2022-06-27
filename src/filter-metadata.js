/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 *
 * @param {string} query
 * @returns {StringArray[]}
 */
const combinedAndSplitString = (query) => {
  const strArr = [];
  const combinedQuery = query.replace(/[,-.]/g, "").toLowerCase();
  strArr.push(combinedQuery);
  const querySplit = query
    ?.replace(/[^a-zA-Z-]/g, "")
    .toLowerCase()
    .split(/[-]/g);
  strArr.push(...querySplit);
  return strArr;
};

/**
 *
 * @param {string} query
 * @returns {string}
 */
const searchableQuery = (query) => {
  // Test will check if query has periods, underscore or hyphen and based on that
  // combinedAndSplitString(query) will create a combined Array of strings.
  // Ex - if "light-year" is the query then it will create this array of strings: [ 'lightyear', 'light', 'year' ]
  return /[./_/-]/.test(query)
    ? combinedAndSplitString(query)
    : query
        ?.replace(/[,-.]|[^a-zA-Z ]/g, "")
        .toLowerCase()
        .split(/[, ]+/);
};

/**
 *
 * @param {Data{}} data
 * @param {string} query
 * @returns {Data{}}
 */
const filterMetadataByQuery = (data, query) => {
  return data?.replace(/[-.]/g, "").toLowerCase()?.includes(query);
};

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  if (!metadata && !query) return [];
  if (typeof query !== "string" || typeof metadata !== "object") return [];
  const searchQuery = searchableQuery(query);

  const resultArr = metadata.filter((arrItem) => {
    return searchQuery.some((queryItem) => {
      return (
        filterMetadataByQuery(arrItem.url, queryItem) ||
        filterMetadataByQuery(arrItem.title, queryItem) ||
        filterMetadataByQuery(arrItem.description, queryItem) ||
        arrItem.keywords
          ?.map((item) => item.replace(/[-.]/g, "").toLowerCase())
          ?.includes(queryItem) ||
        filterMetadataByQuery(arrItem.author, queryItem) ||
        filterMetadataByQuery(arrItem.siteName, queryItem)
      );
    });
  });

  return resultArr;
}

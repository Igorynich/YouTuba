import {SearchResource} from "./search-resource";

export class SearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number,
    resultsPerPage: number
  };
  items?: SearchResource[];
}

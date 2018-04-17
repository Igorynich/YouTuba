import {VideoResource} from "./video-resource";

export class VideoListResponse {

  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: {
    totalResults: number,
    resultsPerPage: number
  };
  items?: VideoResource[];

}


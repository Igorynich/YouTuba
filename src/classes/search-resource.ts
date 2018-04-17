export class SearchResource {

  kind: string;
  etag: string;
  id: {
    kind: string,
    videoId: string,
    channelId?: string,
    playlistId?: string
  };
  snippet: {
    publishedAt: Date,
    channelId: string,
    title: string,
    description: string,
    thumbnails: {
      [key:string]: {
        url: string,
        width: number,
        height: number
      }
    },
    channelTitle: string,
    liveBroadcastContent: string
  };

}

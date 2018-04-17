import {Injectable} from '@angular/core';
import {SearchResponse} from "../../classes/search-response";
import {VideoListResponse} from "../../classes/video-list-response";


@Injectable()
export class CachingService {


  private cache: Map<string, { date: Date, content: SearchResponse | VideoListResponse }> = new Map<string, { date: Date, content: SearchResponse | VideoListResponse }>();
  private maxStoredValues: number = 10;
  private partClear: number = Math.ceil(this.maxStoredValues * 0.4);
  private maxStoreTime: number = 3*60*1000;     //3 min - in ms

  constructor() {
  }

  store(key: string, value: any): void {
    this.deleteOutdated();
    if (Math.floor(this.maxStoredValues) > 0) {           //if cache is on (>0)
      if (this.cache.size >= this.maxStoredValues) {      //if cache max size is reached - delete ${partClear} first entries
        let i = 0;
        this.cache.forEach((value1, key1) => {
          if (i <= this.partClear) {
            this.cache.delete(key1);
            i++;
          }
        });
        //console.log("Current cache size(AFTER CUT): ", this.cache.size);
      }
      this.cache.set(key, {date: new Date(), content: value});
      console.log("Current cache size: ", this.cache.size);
    }
  }

  getValue(key: string): any {
    this.deleteOutdated();
    return this.cache.get(key).content;
  }

  hasValue(key: string): boolean {
    this.deleteOutdated();
    return this.cache.has(key);
  }

  getEtag(key: string): any{
    this.deleteOutdated();
    return this.cache.get(key).content.etag;
  }

  deleteOutdated(){
    let now = new Date();
    this.cache.forEach((value, key) => {
      if ((now.getTime() - value.date.getTime()) > this.maxStoreTime){     //delete outdated entries
        this.cache.delete(key);
      }
    });
  }

  seeCache() {
    console.error("-----Cache:-------", this.cache.size);
    this.cache.forEach((value, key) => {
      console.log(`${key} - `, value);
    });
    console.error("-----Cache Over-------");
  }

}

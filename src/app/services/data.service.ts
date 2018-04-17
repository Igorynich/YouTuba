import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {SearchRequestParams} from "../../classes/search-request-params";

import {VideoRequestParams} from "../../classes/video-request-params";
import {CachingService} from "./caching.service";


import {Observable} from "rxjs/Observable";

@Injectable()
export class DataService {

  constructor(private httpService: HttpService, private cache: CachingService) {
  }

  getResponseData<T>(requestParams: SearchRequestParams | VideoRequestParams): T | Observable<T>/*SearchResponse | VideoListResponse*/ {
    let searchString = this.paramsReducer9000(requestParams);
    let response: T | Observable<T>/*SearchResponse | VideoListResponse*/;
    console.log("SearchString from DataService: ", searchString);


    if (this.cache.hasValue(searchString)) {           //check for update here (etag changes all the time - so no sense in that)

      response = this.cache.getValue(searchString);
      console.log("<<<<Taken From DataService cache>>>>>", response);

    }
    else {
      response = this.httpService.makeYoutubeRequest<T>(searchString);

    }
    console.log("Response from DataService: ", response);
    return response;
  }

  paramsReducer9000(params: SearchRequestParams | VideoRequestParams): string {
    let startingString = "search?";
    //console.log("Params instanceof VideoRequestParams: ", "id" in params);
    if ("id" in params) {
      startingString = "videos?";
    }
    let str = Object.keys(params).reduce((previousValue, currentItem, index, arr) => {
      let and = "";
      if (index > 0) {
        and = "&";
      }

      if (params[currentItem]) {
        if (currentItem === "q") {
          return previousValue + and + currentItem + "=" + params[currentItem].trim().replace(/ +/g, "+");

        }
        return previousValue + and + currentItem + "=" + params[currentItem];
      }
      return previousValue;
    }, startingString);
    return str;
  }


}

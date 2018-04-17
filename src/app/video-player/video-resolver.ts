import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {VideoListResponse} from "../../classes/video-list-response";
import {DataService} from "../services/data.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {CachingService} from "../services/caching.service";
import {VideoRequestParams} from "../../classes/video-request-params";

@Injectable()
export class VideoResolver implements Resolve<VideoListResponse> {

  private redirectUrl: string = "/nosuchvideo";


  constructor(private dataService: DataService, private router: Router, private cache: CachingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VideoListResponse> | Promise<VideoListResponse> | VideoListResponse {

    let reqParams: VideoRequestParams = {
      part: "snippet,contentDetails,statistics,player",
      id: ""
                                            //container max-width - 2*15px paddings   -  switch for responsiveness
    };
    if (window.innerWidth >= 576){
      reqParams.maxWidth = 510;
    }
    if (window.innerWidth >= 768){
      reqParams.maxWidth = 690;
    }
    if (window.innerWidth >= 992){
      reqParams.maxWidth = 930;
    }
    if (window.innerWidth >= 1200){
      reqParams.maxWidth = 1110;
    }
    reqParams.id = route.paramMap.get('vidId');
    let reqString = this.dataService.paramsReducer9000(reqParams);
    let respData = <VideoListResponse>this.dataService.getResponseData<VideoListResponse>(reqParams);
    if (!(respData instanceof Observable)) {
      if (respData.items.length) {
        //console.log("------Taken from CACHE----", respData);
        return respData;
      } else { // id not found
        this.router.navigate([this.redirectUrl]);
        return null;
      }
    }
    else {
      return (<Observable<VideoListResponse>>respData).take(1).map(video => {
        if (video.items.length) {
          //console.log("------Taken from YOUTUBE----", video);
          this.cache.store(reqString, video);
          return video;
        } else { // id not found
          this.router.navigate([this.redirectUrl]);
          return null;
        }
      });
    }

  }

}

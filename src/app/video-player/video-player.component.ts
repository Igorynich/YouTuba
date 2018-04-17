import {Component, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {SearchRequestParams} from "../../classes/search-request-params";
import {VideoRequestParams} from "../../classes/video-request-params";

import {CachingService} from "../services/caching.service";
import {VideoListResponse} from "../../classes/video-list-response";
import {Location} from "@angular/common";
import {DataService} from "../services/data.service";
import {SearchResponse} from "../../classes/search-response";


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  video: VideoListResponse;
  requestString: string;
  videoReqParams: VideoRequestParams = {
    part: "snippet,contentDetails,statistics,player",
    id: "",
    maxWidth: 1024
  };
  aaa;    //remove
  bbb;    //remove
  routeData: object;
  adjustIframeHeightBound: () => void;
  aspectRatio: number;

  constructor(private route: ActivatedRoute, private httpService: HttpService, private cache: CachingService, private router: Router, private location: Location, private dataService: DataService) {

  }

  ngOnInit() {

    this.route.data.subscribe((data) => {
      console.log("!!!!!!!!!!!!!!!!!Route Data Video: ", data);
      this.routeData = data;
      this.video = {...data.video};
      let playerDiv = document.getElementById("player");
      playerDiv.innerHTML = this.video.items[0].player.embedHtml;
      //console.log("Div w/w/w: ", playerDiv.clientWidth, playerDiv.offsetWidth, playerDiv.scrollWidth);
      let iframe = document.getElementsByTagName("iframe")[0];

      this.aspectRatio = Number.parseInt(iframe.width) / Number.parseInt(iframe.height);
      //console.log("Iframe w/h/aspect ratio:", iframe.width, iframe.height, this.aspectRatio);
      iframe.width = "100%";
      iframe.height = playerDiv.clientWidth / this.aspectRatio + "px";
      //console.log("Iframe w/h after:", iframe.width, iframe.height);
      //console.log("div.cw/window.innerWidth/document.documentElement.clientWidth: ", playerDiv.clientWidth, window.innerWidth, document.documentElement.clientWidth);
      this.adjustIframeHeightBound = this.adjustIframeHeight.bind(this);
      window.addEventListener("resize", this.adjustIframeHeightBound);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.adjustIframeHeightBound);
  }

  adjustIframeHeight() {
    let iframe = document.getElementsByTagName("iframe")[0];
    let playerDiv = document.getElementById("player");
    iframe.height = (playerDiv.clientWidth / this.aspectRatio) + "px";
  }

  goBack() {
    this.location.back();
    return false;
  }

}

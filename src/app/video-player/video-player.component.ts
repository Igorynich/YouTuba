import {Component, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {CachingService} from "../services/caching.service";
import {VideoListResponse} from "../../classes/video-list-response";
import {Location} from "@angular/common";
import {DataService} from "../services/data.service";



@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  video: VideoListResponse;
  routeData: object;
  adjustIframeHeightBound: () => void;
  aspectRatio: number;

  constructor(private route: ActivatedRoute, private httpService: HttpService, private cache: CachingService, private router: Router, private location: Location) {

  }

  ngOnInit() {

    this.route.data.subscribe((data) => {
      //console.log("!!!!!!!!!!!!!!!!!Route Data Video: ", data);
      this.routeData = data;
      this.video = {...data.video};
      let playerDiv = document.getElementById("player");
      playerDiv.innerHTML = this.video.items[0].player.embedHtml;

      let iframe = document.getElementsByTagName("iframe")[0];

      this.aspectRatio = Number.parseInt(iframe.width) / Number.parseInt(iframe.height);

      iframe.width = "100%";
      iframe.height = playerDiv.clientWidth / this.aspectRatio + "px";
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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SearchResponse} from "../../classes/search-response";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CachingService} from "../services/caching.service";
import {HttpService} from "../services/http.service";
import {SearchRequestParams} from "../../classes/search-request-params";
import {DataService} from "../services/data.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit, OnDestroy {
  title: string = "Результаты поиска";
  searchString: string;
  searchResponse: SearchResponse = undefined;
  requestParams: SearchRequestParams;
  scrollToNextPageBound: () => void;

  constructor(private route: ActivatedRoute, private cache: CachingService, private httpService: HttpService, private dataService: DataService) {
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      console.log("Params: ", params);
      this.requestParams = {q: "", maxResults: "", type: "", part: ""};
      //this.searchResponse = undefined;
      params.keys.map((val: string, index: number) => {
        this.requestParams[val] = params.get(val);
      });

      this.searchString = this.dataService.paramsReducer9000(this.requestParams);

      //console.log("RequestParams: ", this.requestParams);
      if (this.requestParams.q) {
        let respData = this.dataService.getResponseData<SearchResponse>(this.requestParams);
        if (respData instanceof Observable) {
          (<Observable<SearchResponse>>respData).subscribe(data => {
            this.searchResponse = {...data};
            this.cache.store(this.searchString, this.searchResponse);
            console.log("SearchResp form Obs: ", this.searchResponse);
          }, error => {
            console.log("Error in ResultListComponent: ", error.error.message);
          });
        } else {
          this.searchResponse = <SearchResponse>respData;
          console.error("SearchResp form Cache: ", this.searchResponse);
        }
      }
    });

    this.scrollToNextPageBound = this.scrollToNextPage.bind(this);
    window.addEventListener("scroll", this.scrollToNextPageBound);

  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.scrollToNextPageBound);
  }


  scrollToNextPage() {
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    //console.log("Scrolled111", scrolled);
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    //console.log("Scroll Height", scrollHeight);
    let windowHeight = window.innerHeight;
    //console.log("Window Height", windowHeight);
    if (scrolled == (scrollHeight - windowHeight)) {

      //console.log("Load Additional Staff");
      if ((this.searchResponse) && (this.searchResponse.nextPageToken)) {
        this.httpService.requestNextPage(this.searchString, this.searchResponse.nextPageToken).subscribe((data) => {
          //console.log("New Data: ", data);
          this.searchResponse.pageInfo = data.pageInfo;
          this.searchResponse.nextPageToken = data.nextPageToken;
          this.searchResponse.etag = data.etag;             //do we need that?
          this.searchResponse.items.push(...data.items);

        });
      }
    }
  }

  seeCache(){
    this.cache.seeCache();
  }

}

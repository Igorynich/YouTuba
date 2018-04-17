import {Component, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {SearchRequestParams} from "../../classes/search-request-params";
import {SearchResponse} from "../../classes/search-response";
import {CachingService} from "../services/caching.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {


  requestParams: SearchRequestParams = {q: "", maxResults: "20", type: "video", part: "snippet", order: "", videoDefinition: undefined, videoDuration: undefined,
                                          videoEmbeddable: "true"};

  response: SearchResponse;     //remove
  requestString: string;
  link:string;          //?
  routeData:object;
  publishedAfter = "";
  showFilters:boolean = false;

  constructor(private httpService: HttpService, private cache: CachingService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe((data)=>{
      console.log("Data: ", data);
      this.routeData = data;
    });

    console.log("URL: ", this.router.url);

  }

  dateResolver(hours:string):string{
    let now = new Date();
    //console.log("Date now: ", now);
    now.setHours(now.getHours() - Number.parseInt(hours));
    //console.log("Date "+ hours+"h earlier: ", now);
    if (hours === "0"){
      return undefined;
    }
    return now.toISOString();
  }

  onSubmit() {

    //console.log("-------ReqParams1111: ", this.requestParams);
    if (this.publishedAfter){
      this.requestParams.publishedAfter = this.dateResolver(this.publishedAfter);
    }

    //if (this.requestParams.q){
      console.log("Initial SearchReqParams: ", this.requestParams);
      this.router.navigate(['/search'], {queryParams: this.requestParams});
    //}

    return false;
  }


}

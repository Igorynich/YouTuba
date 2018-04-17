import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SearchPageComponent } from './search-page/search-page.component';
import {FormsModule} from "@angular/forms";
import { ResultListComponent } from './result-list/result-list.component';
import {HttpClientModule} from "@angular/common/http";
import {HttpService} from "./services/http.service";
import {CachingService} from "./services/caching.service";
import { VideoPlayerComponent } from './video-player/video-player.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {RouterModule} from "@angular/router";
import { IgHrefPipe } from './pipes/ig-href.pipe';
import {DataService} from "./services/data.service";
import {VideoResolver} from "./video-player/video-resolver";
import {NoSuchVideoComponent} from "./no-such-video/no-such-video.component";

const routes = [
  {path: "video/:vidId", component: VideoPlayerComponent, data: {breadCrumb: ["Поиск", "Видео"]}, resolve: {video: VideoResolver}},
  {path: "search", component: SearchPageComponent, data: {breadCrumb: "Поиск"}, children: [
      {path: "", component: ResultListComponent}
    ]},
  {path: "nosuchvideo", component: NoSuchVideoComponent},
  {path: "", redirectTo: "/search", pathMatch: "full"},
  {path: "**", component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    ResultListComponent,
    VideoPlayerComponent,
    PageNotFoundComponent,
    IgHrefPipe, NoSuchVideoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [VideoResolver, HttpService, CachingService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

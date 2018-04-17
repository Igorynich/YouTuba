import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {SearchResponse} from "../../classes/search-response";
import {catchError, retry} from 'rxjs/operators';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";


@Injectable()
export class HttpService {

  private youtubeApiLink: string = "https://www.googleapis.com/youtube/v3/";
  private key: string = "AIzaSyCxyZy_Q1jom2pAG2Ji4osxnTxlHDx5LY4";

  constructor(private http: HttpClient) {
  }

  makeYoutubeRequest<T>(params: string, etag?:string): Observable<T> {        //etag param for etag requests but it seems like etags change all the time, so no sense
    if (etag){
      let headers = new HttpHeaders({"If-None-Match": etag});
      return this.http.get<T>(this.youtubeApiLink + params + "&key=" + this.key, {headers: headers}).pipe(catchError(this.handleError));
    }

    return this.http.get<T>(this.youtubeApiLink + params + "&key=" + this.key).pipe(retry(3), catchError(this.handleError));
  }


  requestNextPage(params: string, nextPageToken: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(this.youtubeApiLink + params + "&key=" + this.key + "&pageToken=" + nextPageToken).pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };
}

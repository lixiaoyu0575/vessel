/**
 * Created by th3ee on 11/7/17.
 */
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../net/token/token.service';
import { Headers, Http, Response, RequestOptions} from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';


@Injectable()
export class LoginAuthService {
    constructor(private http: HttpClient, private normalHttp: Http, private injector: Injector) {
    }
    private Url = 'http://123.56.247.133:9500/';



    redirectUrl: String;
    createAuthorizationHeader(headers: Headers) {
        const localInfo = JSON.parse(localStorage.getItem('_user'));
        headers.append('X-CSRFToken', localInfo.access_token);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }

   /* loginObservable(Formval: object): Observable<any> {
        return this.http.post(this.Url + 'account/login/', JSON.stringify(Formval))
            .do((res: any) => {
            console.log(res);
            localStorage.setItem('TOKEN', res.TOKEN);
            localStorage.setItem('userID', res.username);
            localStorage.setItem('userGroup', res.group);
            localStorage.setItem('userProvince', res.province);
            console.log(res);
        })

            .catch((error: any) => Observable.throw(error || 'Server error'));
    }*/

    logout(): Object {
        localStorage.removeItem('_user');
        return ({'status': 'TOKEN_REMOVED'});
    }

    getUsers(): Observable<any> {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        const Returns = JSON.parse(localStorage.getItem('_user'));
        console.log(Returns);
        const options = {
            headers: new HttpHeaders({'X-CSRFToken': Returns.access_token})
        };
        console.log(headers);
        return this.http.get(this.Url + 'account/userlist/', options)
            .do((res: Response) =>
            console.log(res)
            )
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    register(body): Observable<any> {
        console.log(body);
        return this.http.post(this.Url + 'account/register/', JSON.stringify(body))
            .do((res: Response) => console.log(res))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    updateAuth(body): Observable<any> {
        console.log(body);
        return this.http.put(this.Url + 'account/user/', JSON.stringify(body))
            .do((res: Response) => console.log(res))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    remove(username): Observable<any> {
        const header = new Headers();
        this.createAuthorizationHeader(header);
        console.log(username);
        return this.normalHttp.delete(this.Url + 'account/user/',  new RequestOptions({
            headers: header,
            body: JSON.stringify({username: username})
            }
        ))
            .do((res: Response) => console.log(res))
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}

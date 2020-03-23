import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { TokenService } from '../net/token/token.service';
import {Headers, Http} from '@angular/http';

import { saveAs } from 'file-saver';

@Injectable()
export class FileDownloadService {

    baseUrl = 'http://123.56.247.133:9500';

    constructor(
        private http: HttpClient,
        private Http: Http,
        private msgSrv: NzMessageService,
        private injector: Injector
    ) {}


    options = {
        headers: new HttpHeaders({'X-CSRFToken': this.injector.get(TokenService).data.access_token})
    };

    private handleError(error: any): Promise<any> {
        console.error('An error occured', error);
        return Promise.reject(error.message || error); // ?
    }

    /**
     * 
     * @param params 参数转json
     */
    getParams(params: any): any {
        return 'q=' + JSON.stringify(params);
    }
    
    /**
     * 
     * @param url 链接地址
     * @param params 参数格式： {'key':'value'}
     * @param filename  保存文件的文件名
     */
    downloadFile(url, params, filename) {
        this.msgSrv.loading('正在下载' + filename);
        this.http.get(this.baseUrl + '/' + url, {
            headers: new HttpHeaders({'X-CSRFToken': this.injector.get(TokenService).data.access_token}),
            params: this.getParams(params),
            responseType: 'blob',
            observe: 'response'
        }).subscribe((res: HttpResponse<Blob>) => {
            if (res.body.size <= 0) {
                this.msgSrv.error(`下载失败`, { nzDuration: 1000 * 3 });
                return;
            }
            if (res.body.size === 13) { // 如果返回值是 {“Return" : 1} ,说明数据获取失败
                this.msgSrv.error(`下载失败,参数有误`, { nzDuration: 1000 * 3 });
                return;
            }
            const fileName = filename || res.headers.get('filename') || res.headers.get('x-filename');
            saveAs(res.body, decodeURI(fileName));
            this.msgSrv.success('下载成功');
        }, (err) => {
            this.msgSrv.error(`下载失败，${err}`, { nzDuration: 1000 * 3 });
        }, () => {
            // this.el.nativeElement.disabled = false;
        });
    }

}

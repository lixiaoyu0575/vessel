import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router, PreloadingStrategy, Params} from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { FileUploader } from 'ng2-file-upload';
import { TokenService } from '@core/net/token/token.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, AfterViewInit {

    uploader: FileUploader = new FileUploader({
        url: 'http://123.56.247.133:9500/filesystem/fileop/',    // http://202.117.54.95:8888/filesystem/fileop/
        method: 'POST',
        itemAlias: 'File',
        autoUpload: false,
        headers: [
            {name: 'X-CSRFToken', value: this.injector.get(TokenService).data.access_token}
        ]
    });

    hasBaseDropZoneOver = false;
    files: any[] = [];

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    constructor(private router: Router,
                private service: HttpService,
                private injector: Injector,
                private msg: NzMessageService
    ) {
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploader.onAfterAddingFile = (f) => {
            this.files = this.uploader.queue;
            // console.log('onAfterAddingFile');
            return f;
        };
    }

    selectedFileOnChanged(event: any) {
        console.log('-*->' + event.target);
    }

    File() {
        this.uploader.queue[0].onSuccess = function (response, status, headers) {
            // 上传文件成功
            console.log(status);
            console.log(response);
            console.log(headers);
            if (status === 200) {
                this.msg.info('文件上传成功');
                // 上传文件后获取服务器返回的数据
                const tempRes = JSON.parse(response);
                console.log('-->' + tempRes);
            }else {
                // 上传文件后获取服务器返回的数据错误
                console.log('上传文件后获取服务器返回的数据错误');
            }
        };
        this.uploader.queue[0].upload(); // 开始上传
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    // 退出，直接跳转回原页面
    exit() {
        this.router.navigate( ['system/file/detail/']);
    }

}

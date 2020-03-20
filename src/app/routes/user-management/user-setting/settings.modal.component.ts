import { Component, Input } from '@angular/core';
import { NzModalSubject, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { LoginAuthService } from '@core/services/login.auth.service';
@Component({
    selector: 'app-model-custom',
    template: `
    <div class="modal-header">
        <div class="modal-title">用户信息</div>
    </div>
    <h3>
        用户姓名
    </h3>
    <p>{{user.first_name}} {{user.last_name}}</p>
    <br>
    <h3>
        注册邮箱
    </h3>
    <p>{{user.email}}</p>
    <br>
    <h3>
        注册日期
    </h3>
    <p>{{user.date_joined}}</p>
    <br>
    <h3>
        所属省份
    </h3>
    <p>{{user.province}}</p>
    <br>
    <h3>
        权限设定
    </h3>
    <nz-dropdown>
        <a class="ant-dropdown-link" nz-dropdown>
            {{authority}} <i class="anticon anticon-down"></i>
        </a>
        <ul nz-menu>
            <li *ngIf="user_group == '1'" nz-menu-item (click)="authority='省内管理员'">省内管理员</li>
            <li nz-menu-item (click)="authority='普通用户'">普通用户</li>
            <li nz-menu-item (click)="authority='高级用户'">高级用户</li>
        </ul>
    </nz-dropdown>
    <div class="modal-footer">
        <button nz-button [nzType]="'default'" [nzSize]="'large'" (click)="cancel()">
            关闭
        </button>
        <button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="ok();
        updateAuth()">
            确认
        </button>
    </div>
    `
})
export class ModelCustomComponent {

    @Input() user: any;
    @Input() authority: string;
    @Input() user_group: string;


    constructor(
        private model: NzModalService,
        private msg: NzMessageService,
        private subject: NzModalSubject,
        private service: LoginAuthService,
    ) {

    }


    ok() {
        this.subject.next(`new time: ${+new Date}`);
        this.cancel();
    }

    cancel() {
        this.subject.destroy();
        //console.log(this.user_group);
    }

    updateAuth() {
        let group = '0';
        if (this.authority === '省内管理员') {
            group = '2';
        } else if (this.authority === '普通用户') {
            group = '4';
        } else group = '3';

        this.service.updateAuth({'group': group, 'username': this.user.username}).subscribe((res) => {
            //console.log(res);
        });
    }


}

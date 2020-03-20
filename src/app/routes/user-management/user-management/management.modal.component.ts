import { Component, Input } from '@angular/core';
import { NzModalSubject, NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-model-custom',
    template: `
    <div class="modal-header">
        <div class="modal-title">用户信息</div>
    </div>
    <div nz-row>
        <div nz-col [nzXs]="24" [nzSm]="12">
            <img alt width="95%" src="/assets/img/{{url}}" >
        </div>
        <div nz-col [nzXs]="24" [nzSm]="12">
            <h3>
                姓名
            </h3>
            <p>
                {{charactor['name']}}
            </p>
        </div>
    </div>
    <br>
    <h3>人物介绍</h3>
    <p>
        {{charactor['introduction']}}
    </p>
    <br>
    <h3>人物经历</h3>
    <p>
        {{charactor['experience']}}
    </p>
    <div class="modal-footer">
        <button nz-button [nzType]="'default'" [nzSize]="'large'" (click)="cancel()">
            关闭
        </button>
        <!--<button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="ok()">
            OK
        </button>-->
    </div>
    `
})
export class ManageModelCustomComponent {

    @Input() charactor: object;
    @Input() url: string;

    constructor(
        private model: NzModalService,
        private msg: NzMessageService,
        private subject: NzModalSubject) {}

    ok() {
        this.subject.next(`new time: ${+new Date}`);
        this.cancel();
    }

    cancel() {
        this.subject.destroy();
    }
}

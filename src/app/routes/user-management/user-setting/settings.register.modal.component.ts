/**
 * Created by th3ee on 11/21/17.
 */
import { Component, Input } from '@angular/core';
import { NzModalSubject, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '@core/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-model-custom',
    template: `
        <div class="modal-header">
            <div class="modal-title">添加新用户</div>
        </div>
        <div>
            <br>
                <form nz-form [formGroup]="valForm" (ngSubmit)="submit()" role="form" >
                    <div nz-form-label nz-col [nzSm]="5">
                        <label>用户ID</label>
                    </div>
                    <div nz-row nz-form-item>
                        <div nz-col [nzSm]="15" >
                            <div nz-form-control [nzValidateStatus]="valForm.controls.userID">
                                <nz-input formControlName="userID" [nzPlaceHolder]="'请输入唯一ID'" [nzSize]="'large'">
                                    <ng-template #suffix>
                                        <i class="anticon anticon-key"></i>
                                    </ng-template>
                                </nz-input>
                                <div nz-form-explain *ngIf="valForm.controls.email.dirty&&valForm.controls.email.hasError('required')">注册ID必填</div>
                            </div>
                        </div>
                    </div>
                    <div nz-form-label nz-col [nzSm]="5">
                        <label>姓名</label>
                    </div>
                    <div nz-row nz-form-item >
                        <div nz-col  [nzSm]="15">
                            <div nz-form-control [nzValidateStatus]="valForm.controls.real_first_name">
                                <nz-input formControlName="real_first_name" [nzPlaceHolder]="'请输入真实姓名'" [nzSize]="'large'">
                                    <ng-template #suffix>
                                        <i class="anticon anticon-user"></i>
                                    </ng-template>
                                </nz-input>
                            </div>
                        </div>
                    </div>
                    <div nz-form-label nz-col [nzSm]="5">
                        <label>邮箱</label>
                    </div>
                    <div nz-row nz-form-item >
                        <div nz-col  [nzSm]="15">
                            <div nz-form-control [nzValidateStatus]="valForm.controls.email">
                                <nz-input formControlName="email" [nzPlaceHolder]="'请输入邮箱地址'" [nzSize]="'large'">
                                    <ng-template #suffix>
                                        <i class="anticon anticon-mail"></i>
                                    </ng-template>
                                </nz-input>
                            </div>
                        </div>
                    </div>
                    <div nz-form-label nz-col [nzSm]="5">
                        <label>密码</label>
                    </div>
                    <div nz-row nz-form-item >
                        <div nz-col [nzSm]="15">
                            <div nz-form-control [nzValidateStatus]="valForm.controls.password">
                                <nz-input formControlName="password" [nzPlaceHolder]="'请输入密码'" [nzType]="'password'" [nzSize]="'large'">
                                    <ng-template #suffix>
                                        <i class="anticon anticon-lock"></i>
                                    </ng-template>
                                </nz-input>
                                <div nz-form-explain *ngIf="valForm.controls.password.dirty&&valForm.controls.password.hasError('required')">密码必填</div>
                            </div>
                        </div>
                    </div>
                    <div nz-form-label nz-col [nzSm]="5">
                        <label>所属省份</label>
                    </div>
                    <div nz-row nz-form-item >
                        <div nz-col [nzSm]="12">
                            <div nz-form-control nzHasFeedback [nzValidateStatus]="valForm.controls.province">
                                <nz-select formControlName="province" (click)="console.log('clicked')">
                                    <nz-option [nzLabel]="'陕西'" [nzValue]="'陕西'"></nz-option>
                                    <nz-option [nzLabel]="'甘肃'" [nzValue]="'甘肃'"></nz-option>
                                    <nz-option [nzLabel]="'宁夏'" [nzValue]="'宁夏'"></nz-option>
                                    <nz-option [nzLabel]="'青海'" [nzValue]="'青海'"></nz-option>
                                    <nz-option [nzLabel]="'新疆'" [nzValue]="'新疆'"></nz-option>
                                </nz-select>
                            </div>
                        </div>
                    </div>
                    <div nz-row nz-form-item>
                        <div nz-col [nzSm]="4" style="left: 40%">
                            <button nz-button [disabled]="!valForm.valid" [nzType]="'primary'" [nzSize]="'large'" class="ant-btn__block"  >
                                <span>注册</span>
                            </button>
                        </div>
                    </div>
                </form>
        </div>
    `
})
export class ModelRegisterComponent {



    constructor(
        fb: FormBuilder,
        private model: NzModalService,
        private msg: NzMessageService,
        private subject: NzModalSubject,
        private service: HttpService
    ) {
        this.valForm = fb.group({
            userID: [null, Validators.compose([Validators.required])],
            real_first_name: [null],
            real_last_name: [null],
            email: [null],
            password: [null, Validators.required],
            province: ['陕西', Validators.required],
        });
    }

    valForm: FormGroup;
    ok() {
        this.subject.next(`new time: ${+new Date}`);
        this.cancel();
    }

    cancel() {
        this.subject.destroy();
    }


    submit() {
        // tslint:disable-next-line:forin
        for (const i in this.valForm.controls) {
            this.valForm.controls[i].markAsDirty();
        }
        if (this.valForm.valid) {
            //console.log('Valid!');
            //console.log(this.valForm.value);
            const submitBody = {
                'province': this.valForm.value.province,
                'username': this.valForm.value.userID,
                'first_name': this.valForm.value.real_first_name,
                'last_name': this.valForm.value.real_last_name,
                'password': this.valForm.value.password,
                'email': this.valForm.value.email
            };
            //console.log(submitBody);
            this.service.register(submitBody)
                .subscribe((res) => {
                    //console.log(res);
                    if (res.Return === 0) {
                    this.cancel();
                    this.msg.info('注册成功');
                    } else {
                        this.msg.info('注册失败，ID已存在或其他问题。');
                    }

                });
        }
    }


}

import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
    selector: 'app-info8-modal-component',
    template: `
    <div>
      <br/>
      <span style="float: left">随访时间(月)</span>
      <nz-input-number style="float:left;left: 20px" [nzMin]="0" [nzMax]="1024" [(ngModel)]="time"></nz-input-number>
      <br/>
      <br/>
      <br/>
      <div class="customize-footer">
        <button style="float: right" nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="emitDataOutside($event)">
          确 定
        </button>
        <div style="clear: both"></div>
      </div>
    </div>H
  `,
    styles  : [
        `
      :host ::ng-deep .customize-footer {
        border-top: 1px solid #e9e9e9;
        padding: 10px 18px 0 10px;
        text-align: right;
        border-radius: 0 0 0px 0px;
        margin: 15px -16px -5px -16px;
      }
    `
    ]
})
export class NzModalInfo8Component implements OnInit {
    _name: string;
    time: number;

    @Input()
    set name(value: string) {
        this._name = value;
    }

    emitDataOutside() {
        this.subject.next(this.time);
        this.subject.destroy();
    }

    handleCancel(e) {
        this.subject.destroy('onCancel');
    }

    constructor(private subject: NzModalSubject) {
    }

    ngOnInit() {
    }
}

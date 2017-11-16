import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { InputcmpComponent } from '../shared/inputcmp/inputcmp.component';
import { RadiocmpComponent } from '../shared/radiocmp/radiocmp.component';
import { saveAs } from 'file-saver';
import { HttpService } from '@core/services/http.service';
import { ActivatedRoute, Router, PreloadingStrategy, Params} from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { CheckboxcmpComponent} from '../shared/checkboxcmp/checkboxcmp.component';
import { TablecmpComponent} from '../shared/tablecmp/tablecmp.component';
import { IdccmpComponent} from '../shared/idccmp/idccmp.component';
import { PhoneComponent } from '../shared/phonecmp/phonecmp.component';
import { SelectivePreloadingStrategy} from './selective-preloading-strategy';
import { QuestionList } from '../shared/questionList';
import { ScheduleList } from '../shared/scheduleList';
import {DatecmpComponent} from '../shared/datecmp/datecmp.component';

@Component({
    selector: 'app-survey-management',
    templateUrl: './survey-management.component.html',
    styleUrls: ['./survey-management.component.css']
})
export class SurveyManagementComponent implements OnInit {
    schedule_list =  new ScheduleList().schedule_list;
    PID = '';
    questionList = new QuestionList();
    qlist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => this.questionList.getQuestions(index));
    answerlist = [];
    hiddens = [false, true, true, true, true, true, true, true, true, true] ;
    confirmlist = [];
    manOrwoman = true; // ture 表示女 false 表示男
    singleif = '';
    @ViewChildren(InputcmpComponent) InputItems: QueryList<InputcmpComponent>;
    @ViewChildren(RadiocmpComponent) RadioItems: QueryList<RadiocmpComponent>;
    @ViewChildren(CheckboxcmpComponent) Checkbox: QueryList<CheckboxcmpComponent>;
    @ViewChildren(IdccmpComponent) Idc: QueryList<IdccmpComponent>;
    @ViewChildren(PhoneComponent) Phone: QueryList<PhoneComponent>;
    @ViewChildren(DatecmpComponent) DateItem: QueryList<DatecmpComponent>;
    current = 0;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private confirmServ: NzModalService,
        private preloadStrategy: SelectivePreloadingStrategy,
        private service: HttpService
    ) {
        this.singleif = preloadStrategy.preloadedModules;
    }
    ngOnInit() {
        this.PID = this.route.params['value']['PID'];
        this.fillingAnswer();
        this.answerlist.push(
            { 'Record_ID': 'ID0_3', 'Record_Value': localStorage.getItem('userProvince')},
            { 'Record_ID': 'ID0_5', 'Record_Value': localStorage.getItem('userID')}
        );
        this.route.data.subscribe((data: { resp: any }) => {
            console.log(data);
        });
    }
    changeHiddens(current: number) {
        for (let i = 0; i <= 9; i++) {
            if ( i === current) {
                this.hiddens[i] = false;
            }else {
                this.hiddens[i] = true;
            }
        }
    }
    pre() {
        this.current -= 1;
        this.changeHiddens(this.current);
    }
    confirm() {
        let confirms = true;
        this.confirmlist = [];
        this.InputItems.forEach(item => {
            if (item.answerChanged === false) {
                confirms = false;
                this.confirmlist.push(item.question.id);
            }
        });
        this.RadioItems.forEach(item => {
            if (item.answerChanged === false) {
                confirms = false;
                this.confirmlist.push(item.question.id);
            }
        });
        this.Checkbox.forEach(item => {
            if (item.answerChanged === false) {
                confirms = false;
                this.confirmlist.push(item.question.id);
            }
        });
        const confirmall = {
            confirms: confirms,
            confirmslist: this.confirmlist
        };

        return confirmall;
    }
    next() { // 跳转至下一步
        if (this.current === 0) {
            this.RadioItems.forEach(item => {
                if ( item.answerChanged === true)
                    for (let i = 0; i < item.answer.length; i++) {
                        if (item.answer[i]['Record_ID'] === 'ID1_3_0') {
                            if ( item.answer[i]['Record_Value'] === true ) {
                                this.manOrwoman = false;
                                break;
                            }else {
                                this.manOrwoman = true;
                            }
                        }
                    }
            });
        }
        if (true) { // 检查当前步骤是否合法，如果不合法禁止转向下一步
            if (this.current === 7) {
                if (this.manOrwoman === false) {
                    this.current += 2;
                }else {
                    this.current += 1;
                }
            }else {
                this.current += 1;
            }
        } else {
            // let str;
            // for (let i = 0; i < this.confirm().confirmslist.length; i++) {
            //     str = str + this.confirm().confirmslist[i] + '、';
            // }
            // this.confirmServ.error({
            //     title: '您还有以下必填项未完成：' ,
            //     content: str
            // });
        }
        this.changeHiddens(this.current);
    }

    fillingAnswer() {
        const putRecord = {
            'PID': this.PID
        };
        let fillinglist = [];
        this.service.getRecord(putRecord).subscribe((res) => {
            console.log('这是返回结果！');
            console.log(res);
            fillinglist = res['Records'];
            this.InputItems.forEach(item => {
                for (let i = 0; i < fillinglist.length; i++) {
                    let id = '';
                    if ( item.question.id === '1.0') {
                        id = 'ID0_1';
                    }else {
                        id = 'ID' + item.question.id.replace(/\./g , '_');
                    }
                    if (fillinglist[i][id] && fillinglist[i][id] !== '') {
                        item.localAnswer[0] = fillinglist[i][id];
                    }
                }
            });
            this.RadioItems.forEach(item => {
                for (let i = 0; i < fillinglist.length; i++) {
                    for ( let j = 1 ; j <= item.question.content.length; j ++) {
                        const id = 'ID' + item.question.id.replace(/\./g , '_') + '_' + j;
                        if (fillinglist[i][id] && fillinglist[i][id] !== '') {
                            const ar = id.split('_');
                            item.localAnswer = Number.parseInt (ar[ar.length - 1]) - 1;
                        }
                    }
                }
            });
            this.Checkbox.forEach(item => {
                for (let i = 0; i < fillinglist.length; i++) {
                    for ( let j = 1 ; j <= item.question.content.length; j ++) {
                        const id = 'ID' + item.question.id.replace(/\./g , '_') + '_' + j;
                        if (fillinglist[i][id] && fillinglist[i][id] !== '') {
                            const ar = id.split('_');
                            item.localAnswer[Number.parseInt (ar[ar.length - 1]) - 1] = true;
                        }
                    }
                }
            });
            this.Idc.forEach( item => {
                for (let i = 0; i < fillinglist.length; i++) {
                    if (fillinglist[i]['ID1_5'] && fillinglist[i]['ID1_5'] !== '') {
                        item.localAnswer = fillinglist[i]['ID1_5'];
                    }
                }
            });
            this.Phone.forEach( item => {
                const id = 'ID' + item.question.id.replace(/\./g, '_');
                for (let i = 0; i < fillinglist.length; i++) {
                    if ( fillinglist[i][id] && fillinglist[i][id] !== '') {
                        item.localAnswer = fillinglist[i][id];
                    }
                }
            });
            this.DateItem.forEach( item => {
                const id = 'ID' + item.question.id.replace(/\./g, '_');
                for (let i = 0; i < fillinglist.length; i++) {
                    if (fillinglist[i][id] && fillinglist[i][id] !== '') {
                        item.date = new Date(fillinglist[i][id]);
                    }
                }
            });
        }, err => {
            console.log('这是错误信息！');
            console.log(err);
        } );

    }

    collectallAnswer() {
        this.RadioItems.forEach(item => {
            if (item.answerChanged === true)
                for ( let i = 0; i < item.answer.length; i++) {
                    this.answerlist.push(item.answer[i]);
                }
        });
        this.Checkbox.forEach(item => {
            if (item.answerChanged === true)
                for ( let i = 0; i < item.answer.length; i++) {
                    this.answerlist.push(item.answer[i]);
                }
        });
        this.InputItems.forEach(item => {
            if (item.answerChanged === true)
                for ( let i = 0; i < item.answer.length; i++) {
                    this.answerlist.push(item.answer[i]);
                }
        });
        this.Idc.forEach(item => {
            if (item.answerChanged === true)
                for ( let i = 0; i < item.answer.length; i++) {
                    this.answerlist.push(item.answer[i]);
                }
        });
        this.Phone.forEach(item => {
            if (item.answerChanged === true)
                for ( let i = 0; i < item.answer.length; i++) {
                    this.answerlist.push(item.answer[i]);
                }
        });
        this.DateItem.forEach(item => {
            if (item.answerChanged === true) {
                this.answerlist.push(item.answer[0]);
            }
        });
    }
    log() { // 暂存
        const date = new Date();
        let str = '';
        str = date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日' + date.getHours() + '时'
            + date.getMinutes() + '分';
        if (this.confirm().confirms === false) {
            this.answerlist.push({'Record_ID': 'ID0_2', 'Record_Value': '未完成'}, {'Record_ID': 'ID0_4', 'Record_Value': str});
        }
        this.collectallAnswer();
        let putRecord = {};
        if (this.PID !== '') {
            putRecord = {
                'Records': this.answerlist,
                'PID': this.PID
            };
        }else {
            putRecord = {
                'Records': this.answerlist
            };
        }

        this.service.putRecord(putRecord).subscribe((res) => {
            console.log(res);
        }, err => {
            console.log(err);
        });

        this.router.navigate(['/survey/detail']);
    }
    exit() {
        this.router.navigate(['/survey/detail']);
    }

}

/**
 *  input radio
 */
import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, PreloadingStrategy, Params} from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { HttpService } from '@core/services/http.service';

import { InputcmpComponent } from '../shared/inputcmp/inputcmp.component';
import { RadiocmpComponent } from '../shared/radiocmp/radiocmp.component';
import { Table613Component } from '../shared/tablecmp/table613/table613.component';

import { QuestionList } from '../shared/questionList';
import { ScheduleList } from '../shared/scheduleList';

@Component({
    selector: 'app-sixth-step',
    templateUrl: './sixth-step.component.html',
    styleUrls: ['./sixth-step.component.css']
})

export class SixthStepComponent implements OnInit, AfterViewInit {
    @ViewChildren(InputcmpComponent) InputItems: QueryList<InputcmpComponent>;
    @ViewChildren(RadiocmpComponent) RadioItems: QueryList<RadiocmpComponent>;
    @ViewChildren(Table613Component) Table613Item: QueryList<Table613Component>;
    current = 5;                                        // 当前步骤
    questionList = new QuestionList().questions[this.current];     // 问题总列表
    schedule_list =  new ScheduleList().schedule_list;  // 步骤列表
    resultList = [];                                    // 填写结果
    confirmlist = [];                                   // 验证列表
    PID = '';
    finished = false;
    answerList = [];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private service: HttpService,
        private confirmServ: NzModalService
    ) {}

    ngOnInit() {
        this.PID = this.route.params['value']['PID'];
    }
    ngAfterViewInit() {
        this.fillingAllanswer();
    }
    pre() {
        this.collectAllanswer();
        const putRecord = { 'PID': this.PID, 'Records' : this.resultList };
        this.service.putRecord(putRecord).subscribe( (res) => {
        }, error => { });
        this.router.navigate( ['/survey/fifth_step/' + this.PID]);

    }
    next() {                                            // 下一步
        if ( this.confirm().confirms ) {
            this.collectAllanswer();
            const putRecord = { 'Records': this.resultList, 'PID': this.PID};
            this.service.putRecord(putRecord).subscribe( (res) => {
                console.log(res);
                this.router.navigate(['/survey/seventh_step/' + this.PID]);
            }, error => {
                console.log(error);
            });
        }else {
            let str = '';
            for ( let i = 0; i < this.confirm().confirmList.length; i++) {
                str = str + this.confirm().confirmList[i] + '、';
            }
            this.confirmServ.error({
                title: '您还有以下必填项没有完成： ',
                content: str
            });
        }

    }

    /**
     *  点击steps上的按钮，进行步骤跳跃
     */
    jumpTo(step_index) {
        const numWords = ['first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
        if (this.PID) { // 如果有病人编号，则跳跃
            console.log(step_index);
            this.router.navigate(['/survey/' + numWords[step_index] + '_step/' + this.PID]);  // 拼接跳转链接
        }

    }

    temporary_deposit() {                               // 暂存
        this.collectAllanswer();
        const putRecord = { 'PID': this.PID, 'Records' : this.resultList };
        this.service.putRecord(putRecord).subscribe( (res) => {
            this.router.navigate( ['/survey/detail/']);
        }, error => { });
    }
    exit() {                                            // 退出
        this.router.navigate(['/survey/detail/']);
    }
    confirm() {
        const confirmlist = [];
        let confirms = true;
        this.InputItems.forEach(item => { if (item.answerChanged === false) { confirms = false; confirmlist.push(item.question.id);
        }});
        this.RadioItems.forEach(item => { if (item.localAnswer === -1) { confirms = false; confirmlist.push(item.question.id);
        }});
        const confirmAll = {
            confirms: confirms,
            confirmList: confirmlist
        };
        return confirmAll;
    }
    collectAllanswer() {
        this.RadioItems.forEach(item => {
            if (item.answerChanged === true) { for ( let i = 0; i < item.answer.length; i++) { this.resultList.push(item.answer[i]); } }
        });
        this.InputItems.forEach(item => {
            if (item.answerChanged === true) { for ( let i = 0; i < item.answer.length; i++) { this.resultList.push(item.answer[i]); } }
        });
        this.Table613Item.forEach( item => {
            if ( true ) { item.getAnswer().forEach( it => {this.resultList.push(it); } ); }
        });
        if (this.confirm().confirms)
            this.resultList.push(
                {'Record_ID': 'ID0_4', 'Record_Value': this.getNowdate()},
                {'Record_ID': 'ID3', 'Record_Value': 'finished'});
        else {
            this.resultList.push(
                {'Record_ID': 'ID0_4', 'Record_Value': this.getNowdate()},
                {'Record_ID': 'ID6', 'Record_Value': ''},
                {'Record_ID': 'ID0_2', 'Record_Value': '未完成'});
        }
        for ( let i = 0; i < this.answerList.length; i ++) {
            for ( let j = 0; j < this.resultList.length; j++) {
                const id = this.resultList[j].Record_ID;
                if (this.answerList[i][id] || this.answerList[i][id] === 0) {
                    this.resultList[j]['Updated_time'] = this.answerList[i]['Updated_time'];
                }
            }
        }
    }
    fillingAllanswer() {
        const getRecord = {
            'PID': this.PID,
            'RecordID': 'ID6'
        };
        this.service.getRecord(getRecord).subscribe( (res) => {
                const fillingList = res.Records;
                this.answerList = fillingList;
                fillingList.forEach( it => { if ( it['ID3'] && it['ID3'] === 'finished') this.finished = true;
                });
                console.log(fillingList);
                this.InputItems.forEach( item => { fillingList.forEach( it => {
                    let id = '';
                    id = this.getTransid( item.question.id );
                    if ( it[id] && it[id] !== '') {  item.localAnswer[0] = it[id]; }});
                });
                this.RadioItems.forEach( item => {
                    for ( let i = 0; i < fillingList.length; i++) {
                        for ( let j = 1 ; j <= item.question.content.length; j++) {
                            const id = this.getTransid(item.question.id) + '_' + j;
                            if ( fillingList[i][id] && fillingList[i][id] !== '') {
                                const nums = id.split('_');
                                item.localAnswer = Number.parseInt( nums[nums.length - 1]) - 1 ;
                            }
                        }
                    }
                });
                this.Table613Item.forEach( item => {
                    for ( let i = 0; i < 4; i++) {
                        const id = 'ID6_13_' + (i + 1);
                        let x = '';
                        if ( i === 0 ) x = 'a';
                        if ( i === 1 ) x = 'b';
                        if ( i === 2 ) x = 'c';
                        if ( i === 3 ) x = 'd';
                        const id2 = 'ID6_13_' + x;
                        fillingList.forEach( it => {
                            if (it[id]) { item.selected[i] = true; }
                            if (it[id2]) { item.exposureTime[i] = it[id2]; }
                        });
                    }
                });
                this.Table613Item.forEach( item => {
                    for ( let i = 0; i < 4; i++) {
                        const id = 'ID6_13_' + (i + 1);
                        fillingList.forEach( it => {
                            if (it[id]) { item.selected[i] = true; }
                        });
                    }
                });
            }, error => {
                console.log(error);
            }
        );
    }
    getNowdate() {
        const date = new Date();
        let str = '';
        str = date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日' + date.getHours() + '时'
            + date.getMinutes() + '分';
        return str;
    }
    getTransid(str: string) {
        let id = 'ID';
        id = id + str.replace(/\./g, '_');
        return id;
    }

}

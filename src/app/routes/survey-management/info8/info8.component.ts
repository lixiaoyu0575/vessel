import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Question } from '../../survey-management/shared/question';
import {ScheduleList} from '../shared/scheduleList';
import { NzModalInfo8Component } from './info8.modal.component';
import { NzModalService } from 'ng-zorro-antd';
import { HttpService } from '../../../core/services/http.service';

@Component({
    selector: 'app-info8-step',
    templateUrl: './info8.component.html',
    styleUrls: ['./info8.component.css']
})
export class Info8Component extends Question implements OnInit {

    PID = '';
    nzTabPosition = 'left';
    selectedIndex = 0;
    schedule_list = new ScheduleList().schedule_list;
    current = 8;
    buttondisable = false;
    finished = '';
    currentModal;

    answerSet: any;

    followUp: any;

    rowTitle_1 = [ '走行(1:正常,2:异常)',
        '内径(1:正常,2:变宽,3:变窄)', '宫腔(1:清晰,2:不清晰，可见暗淡回声填充,3:完全闭塞)', '静脉压缩性(1:好,2:差)', '侧枝(1:可见侧枝形成,2:无侧枝形成)', '静脉瓣功能(1:良好,2:关闭不全)'];
    columnTitle_1 = ['髂外静脉', '股总静脉', '股浅静脉', '股深静脉', '腘静脉', '胫后静脉', '胫前静脉', '大隐静脉', '腓静脉', '肌间静脉'];
    secondLevelTitle_1 = ['左', '右', '左', '右', '左', '右', '左', '右', '左', '右', '左', '右', '左', '右', '左', '右', '左', '右', '左', '右'];
    overallId = ['ea7a1', 'ea7a2', 'ea7a3', 'ea7a4'];

    rowTitle_2 = ['心率(次/分)', '心律', '电轴', '右束支传导阻滞', '肺性P波', 'SI QIII TIII', 'ST-T改变', 'T波倒置', '总体印象', '', ''];
    columnTitle_2 = ['入院', '治疗后3d', '治疗后5d', '治疗后1w'];

    rowTitle_3 = ['胸部CT', '肺灌注显像', '肺动脉CTA'];
    columnTitle_3 = ['', '', '', ''];

    rowTitle_4 = [''];
    columnTitle_4 = ['主动脉', '升主', '主动脉弓', '降主', '腹主', '肺动脉', '室间隔厚度',
        '室间隔搏幅', '左室后壁厚度', '左室后壁搏幅', '左心房1', '左心房2', '右心房',
        '右心室1', '右心室2', '右室流出道', '左心室1', '左心室2', '(mm1)', '(mm2)',
        '左右室壁运动减弱', '室间隔运动减低', '肺动脉收缩压_三尖瓣反流法估测', 'EF', 'FS',
        '总体评价1', '总体评价2', '彩色血流示1', '彩色血流示2'];

    rowTitle_5 = ['CK', 'CKMB(u/L)', 'CtnT(ng/ml)', 'MYO(ng/ml)'];
    columnTitle_5 = ['入院时', '第二次检查'];

    rowTitle_6 = ['第一次', '第二次', '第三次', '第四次', '第五次', '第六次', '第七次', '第八次', '第九次', '第十次'];
    columnTitle_6 = ['RBC', 'WBC', 'Hb', 'PLT109/', 'NEUT', 'NEUT%', 'LYMPH', 'LYMPH%', 'MONO', 'MONO%'];

    rowTitle_7 = ['第一次', '第二次', '第三次', '第四次', '第五次', '第六次', '第七次'];
    columnTitle_7 = ['PT', 'APTT', 'TT', 'INR', 'FIB', 'FDP', 'D-D'];

    rowTitle_8 = ['ESR', 'hsCRP', 'pro-BNP', 'ACA', 'ANCA', 'HCY(mmol/l)'];
    columnTitle_8 = ['入院时', '第二次检查'];

    rowTitle_9 = ['C反应蛋白(mg/L)'];
    columnTitle_9 = ['入院时', '第二次检查'];

    data_10 = [
        {category: '物理治疗', children: ['气压泵治疗', '硫酸镁冷敷', '着医用弹力袜']},
        {category: '消肿药物', children: ['草木犀流浸液片', '羟苯磺酸钙', '马栗种子提取物片', '地奥司明', '七叶皂苷钠', '其他']},
        {category: '扩管改善循环药', children: ['丹参注射液', '疏血通', '丹参多酚酸盐', '丹参川芎嗪', '其他']},
        {category: '抗凝药', children: ['普通肝素', '低分子肝素', '磺达肝癸钠', '阿加曲班', '比伐卢定', '华法林', '利伐沙班', '达比加群酯']},
        {category: '溶栓药', children: ['尿激酶', 'rtPA']},
        {category: '降肺压药', children: ['西地那非', '曲前列尼尔', '波生坦', '安立生坦', '贝前列素钠']},
        {category: '心血管药物', children: ['氢氯噻嗪', '安体舒通', '呋塞米', '地高辛']},
        {category: '其他特殊用药', children: ['']}
    ];
    columnTitle_10 = ['项目', '内容', '种类', '剂量', '用法', '频次', '用药时间'];
    rowTitle_10 = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private modalService: NzModalService,
                private httpService: HttpService
    ) {

        super();
        this.PID = this.route.params['value']['PID'];
        this.followUp = {
            PID: this.PID,
            tabs: []
        };
    }

    ngOnInit() {
        this.data_10.forEach(d => {
            for (let i = 0; i < d.children.length; i++) {
                const sets = {
                    category: d.category,
                    value: d.children[i],
                    length: d.children.length,
                    start: i === 0
                };
                this.rowTitle_10.push(sets);
            }
        });
        this.httpService.getFollowUp(this.PID).subscribe(res => {
            console.log(res);
            if (res.Record.tabs.length === 0) {
                console.log('new patient');
                this.followUp.tabs.push(this.newAnswerSet(1));
                this.followUp.tabs.push(this.newAnswerSet(3));
                this.followUp.tabs.push(this.newAnswerSet(6));
                this.followUp.tabs.push(this.newAnswerSet(12));
                this.followUp.tabs.push(this.newAnswerSet(24));
                console.log(this.followUp);
                this.answerSet = this.followUp.tabs[0];
            } else {
                this.followUp.tabs = res.Record.tabs;
                console.log(this.followUp.tabs);
                this.answerSet = this.followUp.tabs[0];
            }
        });



    }

    initAnswerBox(table: string,
                  row: Array<string>,
                  column: Array<string>,
                  secondLevel_column ?: Array<string> ,
                  extraAnswer ?: Array<number>) {
        const answerBox = {
            table_name: table,
            answer_array: []
        };
        let new_column;
        if (secondLevel_column) {
            const temp_column = [];
            for (let i = 0; i < column.length; i++) {
                for (let j = 0; j < secondLevel_column.length; j++) {
                    temp_column.push(column[i] + secondLevel_column[j]);
                }
            }
            new_column = temp_column;
        } else {
            new_column = column;
        }
        for (let line = 0; line < row.length; line ++) {
            answerBox.answer_array.push([]);
            for (let vertical = 0; vertical < new_column.length; vertical ++) {
                const answer = {
                    answerId: table + '_' + row[line] + '_' + new_column[vertical],
                    answerValue: ''
                };
                answerBox.answer_array[line].push(answer);
            }
        }
        if (extraAnswer) {
            for (let i = 0; i < extraAnswer[0]; i ++) {
                answerBox.answer_array.push([]);
                for (let j = 0; j < extraAnswer[1]; j++) {
                    answerBox.answer_array[answerBox.answer_array.length - 1].push({
                        answerId: table + '_总体评价' + i + j,
                        answerValue: ''
                    });
                }
            }

        }
        return answerBox;
    }

    newAnswerSet(time: number) {
        const answerSet = {
            Time: time,
            answers: []
        };
        answerSet.answers.push(this.initAnswerBox('下肢静脉超声', this.rowTitle_1, this.columnTitle_1, ['左', '右'], [1, 4]));
        answerSet.answers.push(this.initAnswerBox( '心电图', this.rowTitle_2.slice(0, 8), this.columnTitle_2, null, [3, 4]));
        answerSet.answers.push(this.initAnswerBox('其他检查', this.rowTitle_3, this.columnTitle_3));
        answerSet.answers.push(this.initAnswerBox('心脏超声', this.rowTitle_4, this.columnTitle_4));
        answerSet.answers.push(this.initAnswerBox('心肌酶谱', this.rowTitle_5, ['是否'].concat(this.columnTitle_5)));
        answerSet.answers.push({answerId: '6分钟步行试验', answerValue: ''});
        answerSet.answers.push(this.initAnswerBox('血常规', this.rowTitle_6, this.columnTitle_6));
        answerSet.answers.push(this.initAnswerBox('凝血项目', this.rowTitle_7, this.columnTitle_7));
        answerSet.answers.push(this.initAnswerBox('VTE危险因素', this.rowTitle_8, ['是否'].concat(this.columnTitle_8)));
        answerSet.answers.push(this.initAnswerBox('C反应蛋白', this.rowTitle_9, ['是否'].concat(this.columnTitle_9)));
        const Title10 = [];
        this.rowTitle_10.forEach(d => {
           Title10.push(d.value);
        });
        Title10.splice(33, 1, '其他特殊用药');
        answerSet.answers.push(this.initAnswerBox('随访用药', Title10, this.columnTitle_10.slice(2)));
        return answerSet;
    }

    test() {
        console.log(this.answerSet.answers);
    }

    selectTabs(tab: any) {
        this.followUp.tabs.forEach(d => {
            if (d.Time === tab) {
               this.answerSet = d;
            }
        });
    }

    jumpTo(step_index , footer) {
        const numWords = ['info0', 'info1', 'info2', 'info3', 'info4', 'info5', 'info6', 'info7', 'info8'];
        this.httpService.putFollowUp({
            'PID': this.PID,
            'Record': {
                'tabs': this.followUp.tabs
            }
        }).subscribe(res => {
            console.log(res);
            this.router.navigate(['system/survey/' + numWords[step_index] + '/' + this.PID]);
        });
        
    }

    showModalForComponent() {
        const subscription = this.modalService.open({
            title          : '对话框标题',
            content        : NzModalInfo8Component,
            footer         : false,
            componentParams: {
                name: '新建随访记录'
            }
        });
        subscription.subscribe(result => {
            console.log(result);
            if (typeof result === 'number') {
                this.followUp.tabs.push(this.newAnswerSet(result));
            }
        });
    }

    convertToYear(month: number) {
        if (month >= 12) {
            let time = '';
            if (month % 12 === 0) {
               time =  Math.floor(month / 12) + '年';
            } else {
                time =  Math.floor(month / 12) + '年' + month % 12 + '个月';
            }
          return time;
        } else {
            return month + '个月';
        }
    }

    saveFollowUp() {
        this.httpService.putFollowUp({
            'PID': this.PID,
            'Record': {
               'tabs': this.followUp.tabs
            }
        }).subscribe(res => {
            console.log(res);
        });
    }

    pre() {
        this.saveFollowUp();
        this.router.navigate( ['system/survey/info7/' + this.PID]);
    }

    exit () {
        this.router.navigate( ['system/survey/detail/']);
    }
}

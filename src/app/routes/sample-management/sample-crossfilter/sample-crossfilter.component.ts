import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { HttpService } from '@core/services/http.service';

@Component({
    selector: 'app-sample-crossfilter',
    templateUrl: './sample-crossfilter.component.html',
    styleUrls: ['./sample-crossfilter.component.css']
})
export class SampleCrossfilterComponent implements OnInit {
    /**
     * crossfilter part
     *  */
    content = {
        "ZY010001329467": {
            "Stay_days": 13,
            "Name": "陈永亮",
            "Gender": "男",
            "Age": 60,
            "Score": 51.73456211058211,
            "Pathway_on": 0,
            "Cost": 91074.11
        },
        "ZY010001324105": {
            "Stay_days": 8,
            "Name": "李爱英",
            "Gender": "女",
            "Age": 69,
            "Score": 21.081372549019605,
            "Pathway_on": 0,
            "Cost": 17627.15
        },
        "ZY010001131581": {
            "Stay_days": 16,
            "Name": "雷益柱",
            "Gender": "男",
            "Age": 55,
            "Score": 42.7911575433247,
            "Pathway_on": 1,
            "Cost": 65697.77
        },
        "ZY030001211822": {
            "Stay_days": 21,
            "Name": "王会生",
            "Gender": "男",
            "Age": 53,
            "Score": 72.82804503980633,
            "Pathway_on": 1,
            "Cost": 95421.75
        },
        "ZY010001319160": {
            "Stay_days": 4,
            "Name": "翟满堂",
            "Gender": "男",
            "Age": 77,
            "Score": 2.509803921568628,
            "Pathway_on": 0,
            "Cost": 4721.56
        },
        "ZY030001306814": {
            "Stay_days": 7,
            "Name": "田根龙",
            "Gender": "男",
            "Age": 56,
            "Score": 6.7215686274509805,
            "Pathway_on": 0,
            "Cost": 22684.34
        }
    };

    records = [];

    constructor(
        private fb: FormBuilder,
        private service: HttpService
    ) { }

    ngOnInit() {

        /**
         * crossfilter part
         * @type {Array}
         */
        this.records = this.getData(this.content);
        console.log(this.records);
        let recordsCF = crossfilter(this.records);
        console.log(recordsCF);
        let path = {
            "gender":recordsCF.dimension(function (d) {
                return d.Gender;
            }),
            "age":recordsCF.dimension(function (d) {
                return d.age;
            }),
            "score":recordsCF.dimension(function (d) {
                return d.Score;
            })
        };
        console.log(path);

        let genderGroup = path.gender.group().reduceCount();
        // ageGroup = path.age.group().reduceCount
        let genderChart = dc.barChart("#gender");

        // console.log(genderChart);
        // console.log(genderGroup);
        genderChart.margins().left = 60;
        let width = 250,
            height = 250;
        genderChart.width(width)
            .height(height)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            // .brushOn(true)
            .yAxisLabel("人数")
            .xAxisLabel("性别")
            .dimension(path.gender)
            .group(genderGroup)
            .elasticY(true)
            .controlsUseVisibility(true);

        dc.renderAll();

    }

    submit(){
        // //获取记录
        // this.service.getRecord(this.api, this.params)
        //     .subscribe((res) => {
        //     console.log(res);
        // },err => {
        //     console.log(err);
        //     });
        // //添加信息
        // this.service.putRecord(this.api, this.putRecord).subscribe((res) => {
        //     console.log(res);
        // },err => {
        //     console.log(err);
        // });
        // //获取所有记录
        // this.service.getRecordList().subscribe((res) =>{
        //     console.log(res);
        // },err => {
        //         console.log(err);
        //     })
    }

    getData(content){
        let records = [];
        for (let key in content){
            records.push(content[key]);
        }
        return records;
    }

}
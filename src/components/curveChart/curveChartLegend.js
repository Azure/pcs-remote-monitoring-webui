// Copyright (c) Microsoft. All rights reserved.

import $ from "jquery";

function CurveChartLegend(container, chart) {
    this.container = $(container);
    this.chart = chart;
    this.curpage = 1;
}

CurveChartLegend.prototype.createElement = function () {
    let chart = this.chart;
    if (chart.data.datasets.length > 0) {
        let legendContainer = this.legendContainer = $('<div class="chartLegendContainer"></div>').appendTo(this.container);
        let legendText = this.legendText = $('<div  class="curveLegendText"></div>').appendTo(legendContainer);
        let legendul = $('<ul></ul').appendTo(legendText);
        for (let i = 0; i < chart.data.datasets.length; i++) {
            let legendli = $('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>' + chart.data.datasets[i].label + '</li>').appendTo(legendul);
            legendli.click($.proxy(function (e) {
                this.hide($(e.target), chart);
            }, this));
        }
        let legendBtn = $('<div class="chartLegendBtn"></div>').appendTo(this.container);
        this.up = $('<span class="legendBtn legendBtnUp active" ></span >').appendTo(legendBtn).click($.proxy(function () {
            this.previous();
        }, this));
        this.down = $('<span class="legendBtn legendBtnDown active"></span >').appendTo(legendBtn).click($.proxy(function () {
            this.next();
        }, this));
        this.initData();
    }
}

CurveChartLegend.prototype.initData = function () {
    let cntInLine = Math.floor(this.legendContainer.width() / $("li", this.legendText).width())
    this.pageSize = cntInLine * 2;
    this.pageCnt = Math.ceil(this.chart.data.datasets.length / this.pageSize);
    this.distance = $("li", this.legendText).height() + 5;
    let lineCnt = Math.ceil(this.chart.data.datasets.length / cntInLine);
    this.legendContainer.css("height", lineCnt > 1 ? "36px" : "18px");
    this.changeColor();
}

CurveChartLegend.prototype.next = function () {
    if (this.curpage < this.pageCnt) {
        this.curpage++;
        this.legendText.animate({ top: (-this.distance * 2) * (this.curpage - 1) + "px" });
        this.changeColor();
    }
}

CurveChartLegend.prototype.previous = function () {
    if (this.curpage > 1) {
        this.curpage--;
        this.legendText.animate({ top: (-this.distance * 2) * (this.curpage - 1) + "px" });
        this.changeColor();
    }
}

CurveChartLegend.prototype.hide = function (legend, chart) {
    let index = legend.index();
    legend.toggleClass("strike");
    let curr = chart.data.datasets[index];
    if (curr) {
        curr.hidden = !curr.hidden;
        chart.update();
    }
}

CurveChartLegend.prototype.changeColor = function () {
    if (this.pageCnt === 1) {
        this.up.hide();
        this.down.hide();
    } else {
        if (1 === this.curpage) {
            this.up.removeClass("active").addClass("inactive");
            this.down.removeClass("inactive").addClass("active");
        } else if (this.pageCnt === this.curpage) {
            this.down.removeClass("active").addClass("inactive");
            this.up.removeClass("inactive").addClass("active");
        }
    }
}

export default CurveChartLegend;



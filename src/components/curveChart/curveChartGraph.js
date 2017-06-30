// Copyright (c) Microsoft. All rights reserved.

import $ from "jquery";
import Chart from "chart.js";
import CurveChartLegend from "./curveChartLegend";

function CurveChartGraph(setting) {
    this.chartControl = setting.chartControl;
    this.legends = setting.legends;
    this.refreshMilliseconds = setting.refreshMilliseconds;
    this.loadDataUrlBase = setting.loadDataUrlBase;
    this.maxPointsNumber = setting.maxPointsNumber;
}

CurveChartGraph.prototype._createDefaultConfig = function () {
    let config = {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: ''
            },
            legend: {
                display: false
            },
            tooltips: {
                mode: 'nearest',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    type: 'time',
                    time: {
                        format: "HH:mm:ss"
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };
    return config;
};

CurveChartGraph.prototype._createChart = function () {
    let ctx = this.chartControl.getContext("2d");
    this.config = this._createDefaultConfig();
    this.chart = new Chart(ctx, this.config);
};

CurveChartGraph.prototype.init = function () {

    this._createChart();
};

CurveChartGraph.prototype._produceGraphData = function (data) {
    let results;
    let dateTime;
    results = {
        timestamps: []
    };
    let maxDate = new Date(Math.max.apply(null, this.config.data.labels.length !== 0 ? this.config.data.labels : [new Date('2016-01-01')]));
    $.each(data, function (i, item) {
        results[item.telemetry] = [];
        $.each(item.metrics, function (j, metric) {
            dateTime = new Date(metric.timestamp);
            if (!dateTime.replace) {
                dateTime.replace = ('' + this).replace;
            }
            if (dateTime > maxDate) {
                results[item.telemetry].push(metric.value);
                if (i === 0) {
                    results.timestamps.push(dateTime);
                }
            }
        });
    });
    return results;
}

CurveChartGraph.prototype._getDatasetData = function () {
    if (this.currentAjax) {
        this.currentAjax.abort();
    }

    return this.currentAjax = $.ajax({
        cache: false,
        type: "post",
        url: this.telemetryDataUrl,
        data: this.args,
        dataType: "json",

    });

}

var utils = {
    getRandomColor: function getRandomColor(datasets) {
        var color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
        for (var i = 0; i < datasets.length; i++) {
            if (datasets[i].backgroundColor === color)
                getRandomColor();
        }
        return color;
    }
}

CurveChartGraph.prototype.update = function (url, deviceGroup, telemetries) {
    this.loadDataUrlBase = url;
    this.telemetryDataUrl =
        this.loadDataUrlBase + encodeURIComponent(deviceGroup);
    this.args = { '': telemetries };
    //Clear old and create new dataset
    this.config.data.datasets = [];
    this.config.data.labels = [];
    this.legends.innerHTML = "";
    this.chart.update();
    if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
    }
    this._getDatasetData().done((data) => {
        $.each(data, (index, item) => {
            var newColor = utils.getRandomColor(this.config.data.datasets);
            var newDataset = {
                label: item.telemetry,
                backgroundColor: newColor,
                borderColor: newColor,
                data: [],
                fill: false
                // lineTension:0.1
            };
            this.config.data.datasets.push(newDataset);
        })
        this.chart.update();
        this._addDataToDataset(data);
        //customize legends
        let legends = new CurveChartLegend(this.legends, this.chart);
        legends.createElement();
        //refresh data every 3000 millisecond
        this._refreshData();
    }
    );
}

CurveChartGraph.prototype._addDataToDataset = function (data) {
    data = this._produceGraphData(data);
    $.each(this.config.data.datasets, (i, dataset) => {
        $.each(data[dataset.label], (j, value) => {
            dataset.data.push(value);
        });
    });
    $.each(data.timestamps, (k, time) => {
        this.config.data.labels.push(time);
    })
    while (this.config.data.labels.length > this.maxPointsNumber) {
        this.config.data.labels.shift();
        $.each(this.config.data.datasets, (i, item) => {
            item.data.shift();
        });
    }
    this.chart.update();
}

CurveChartGraph.prototype._refreshData = function () {
    if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
    }

    this._getDatasetData().done((data) => {
        this._addDataToDataset(data);
        if (this.refreshMilliseconds) {
            this.timerId = setTimeout(() => this._refreshData(), this.refreshMilliseconds)
        }
    }).fail((jqXHR, textStatus, errorThrown) => {
        if (textStatus !== "abort") {
            if (this.refreshMilliseconds) {
                this.timerId = setTimeout(() => this._refreshData(), this.refreshMilliseconds)
            }
        }
    });
}

CurveChartGraph.prototype.dispose = function () {
    if (this.currentAjax) {
        this.currentAjax.abort();
    }

    if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
    }
}

export default CurveChartGraph;

// Copyright (c) Microsoft. All rights reserved.

import Chart from "chart.js";

function PieChartGraph() {  
    this.chartColors = {
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
}

PieChartGraph.prototype.init = function (settings) {
    this.chartControl = settings.chartControl;
    this._createConfig();
    var ctx = this.chartControl.getContext("2d");
    this.chart = new Chart(ctx, this.config);
}

PieChartGraph.prototype._createConfig = function () {
    this.config = {
        type: 'pie',
        data: {
            datasets: [{
                data: [

                ],
                backgroundColor: [
                ],
                label: 'Dataset 1'
            }],
            labels: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            }
        }
    };
}

PieChartGraph.prototype._getRandomColor = function (index) {
    var colorNames = Object.keys(this.chartColors);
    var colorName = colorNames[index % colorNames.length];;
    return this.chartColors[colorName];
}

PieChartGraph.prototype.update = function (data) {
    var newDataset = {
        backgroundColor: [],
        data: [],
        label: 'dataset 1',
    };
    this.config.data.labels = [];
    this.config.data.datasets[0] = newDataset;
    for (var i = 0; i < data.length; ++i) {
        newDataset.data.push(data[i].value);
        newDataset.backgroundColor.push(this._getRandomColor(i));
        this.config.data.labels.push(data[i].field);
    }
    this.chart.update();
}


export default PieChartGraph;

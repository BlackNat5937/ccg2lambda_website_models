let globalTotalAnswers;
let globalRightAnswers;
let drsTotalAnswers;
let drsRightAnswers;
let graphTotalAnswers;
let graphRightAnswers;

function ready(callback) {
    // in case the document is already rendered
    if (document.readyState !== 'loading') callback();
    else document.addEventListener('DOMContentLoaded', callback);
}

function drawGlobalSuccessChart() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Representation Type');
    data.addColumn('number', 'Right Answers');
    data.addRows([
        ['DRS', drsRightAnswers],
        ['Graph', graphRightAnswers],
    ]);

    const options = {
        title: 'Right answer repartition between representation types'
    };

    let chart = new google.visualization.PieChart(document.getElementById('globalsuccesschart'));

    chart.draw(data, options);
}

function drawDRSSuccessChart() {
    let rightQty = drsRightAnswers;
    let wrongQty = drsTotalAnswers - drsRightAnswers;

    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Answer status');
    data.addColumn('number', 'Occurrences');
    data.addRows([
        ['Right', rightQty],
        ['Wrong', wrongQty],
    ]);

    const options = {
        title: 'Answer repartition for DRS visualizations'
    };

    let chart = new google.visualization.PieChart(document.getElementById('drssuccesschart'));

    chart.draw(data, options);
}

function drawGraphSuccessChart() {
    let rightQty = graphRightAnswers;
    let wrongQty = graphTotalAnswers - graphRightAnswers;
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Answer status');
    data.addColumn('number', 'Occurrences');
    data.addRows([
        ['Right', rightQty],
        ['Wrong', wrongQty],
    ]);

    const options = {
        title: 'Answer repartition for Graph visualizations'
    };

    let chart = new google.visualization.PieChart(document.getElementById('graphsuccesschart'));

    chart.draw(data, options);
}

function drawCharts() {
    drawGlobalSuccessChart();
    drawDRSSuccessChart();
    drawGraphSuccessChart();
}

ready(() => {
    // the document is ready, do things

    // initialize global data variables
    let globalData = document.querySelector('.js-global-stats');
    globalTotalAnswers = +globalData.dataset.globalTotalAnswers;
    globalRightAnswers = +globalData.dataset.globalRightAnswers;

    // initialize drs data variables
    let drsData = document.querySelector('.js-drs-stats');
    drsTotalAnswers = +drsData.dataset.drsTotalAnswers;
    drsRightAnswers = +drsData.dataset.drsRightAnswers;

    // initialize graph data variables
    let graphData = document.querySelector('.js-graph-stats');
    graphTotalAnswers = +graphData.dataset.graphTotalAnswers;
    graphRightAnswers = +graphData.dataset.graphRightAnswers;

    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
});
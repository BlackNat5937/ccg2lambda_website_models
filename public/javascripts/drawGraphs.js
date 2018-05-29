let globalTotalAnswers;
let globalRightAnswers;
let drsTotalAnswers;
let drsRightAnswers;
let drsPercentage;
let graphTotalAnswers;
let graphRightAnswers;
let graphPercentage;

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

function drawGlobalRightPercentageComparativeChart() {
    let data = google.visualization.arrayToDataTable([
        ["Representation Type", "Percentage of Right Answers", {role: "style"}],
        ["DRS", 8.94, "lightgreen"],
        ["Graph", 10.49, "lightblue"],
    ]);

    const options = {
        title: 'Right answer percentage for each Representation Type',
        legend: {position: "none"},
        hAxis: {minValue: 0},
    };

    let chart = new google.visualization.BarChart(document.getElementById('globalpercentagechart'));

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
    drawGlobalRightPercentageComparativeChart();
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
    drsPercentage = +drsData.dataset.drsPercentage;

    // initialize graph data variables
    let graphData = document.querySelector('.js-graph-stats');
    graphTotalAnswers = +graphData.dataset.graphTotalAnswers;
    graphRightAnswers = +graphData.dataset.graphRightAnswers;
    graphPercentage = +graphData.dataset.graphPercentage;

    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawCharts);
});
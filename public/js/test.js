function getString() {
    return "bleh";
}

var rawData = [];
var minutes = [];

window.onload = function() {
    var meh = getString();
    var node = document.getElementById("blehbleh");
    node.textContent += meh;

    d3.csv("data/data.csv", function(data) {
        rawData.push({Date:new Date(data.Date), KW:Number(data.KW)});
    }).then( function() { onDataLoaded();} );
};

function onDataLoaded() {
    rawData.sort( function(a,b) { return a.Date.getTime() > b.Date.getTime() ? 1 : -1; });

    for(var i = 1; i < rawData.length; i++) {
        var difference = rawData[i].Date.getTime()-rawData[i-1].Date.getTime();
        var m = difference / 1000 / 60;

        // ignore recharges
        if(m < 1) {
            console.log("How has this happened?");
            continue;
        }

        var averageKW = (rawData[i-1].KW - rawData[i].KW ) / m;

        // ignore recharges
        if(averageKW < 0) {
            continue;
        }

        for(var j = 0; j < m; j++) {
            var newDate = new Date(rawData[i-1].Date.getTime() + (60000 * j));
            minutes.push({Date:newDate, KW:averageKW});
        }
    }
    
    console.log("Complete!");

    var dataset = getWeeklyReport();
    buildChart(dataset);
}

function getWeeklyReport() {
    var days = [{x:"Sunday", y:0, z:0},
                {x:"Monday", y:0, z:0},
                {x:"Tuesday", y:0, z:0},
                {x:"Wednesday", y:0, z:0},
                {x:"Thursday", y:0, z:0},
                {x:"Friday", y:0, z:0},
                {x:"Saturday", y:0, z:0}];

    for(var i = 0; i < minutes.length; i++) {
        var day = minutes[i].Date.getDay();
        var kw = minutes[i].KW;

        days[day].y += kw;
        days[day].z++;
    }       
    
    for(var j = 0; j < days.length; j++) {
        days[j].y = (days[j].y / days[j].z)*1440;
    } 

    return days;
}

function buildChart(set){
    //console.log(dataset);
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'KW',
                data: set
            }]
        }
    });
    /*
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    */
}
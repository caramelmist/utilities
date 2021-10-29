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

    getWeeklyReport();
}

function getWeeklyReport() {
    var days = [{Day:"Sunday", KW:0},
                {Day:"Monday", KW:0},
                {Day:"Tuesday", KW:0},
                {Day:"Wednesday", KW:0},
                {Day:"Thursday", KW:0},
                {Day:"Friday", KW:0},
                {Day:"Saturday", KW:0}];

    for(var i = 0; i < minutes.length; i++) {
        var day = minutes[i].Date.getDay();
        var kw = minutes[i].KW;

        if(kw < 0) {
            console.log(minutes[i]);
        }

        days[day].KW += kw;
    }            
    console.log(days);
}

function buildChart(){
    var ctx = document.getElementById('myChart');
}
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
        var minutes = difference / 1000 / 60;

        // ignore recharges
        if(minutes < 1) {
            return;
        }

        var averageKW = (rawData[i-1].KW - rawData[i].KW ) / minutes;

        for(var j = 0; j < minutes; j++) {
            var newDate = new Date(rawData[i-1].Date.getTime() + (60000 * j));
            minutes.push({Date:newDate, KW:averageKW});
        }
    }
    
    console.log("Complete!");
}
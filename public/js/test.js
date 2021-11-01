var myChart;

var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var rawData = [];
var allMinutes = [];
var minutes = [];

function daysInMonth(year, month) {
    if(month === 1){
        return year % 4 == 0 ? 29 : 28;
    }
    if(month == 3 || month == 5 || month == 8 || month == 10){
        return 30;
    }
    return 31;
}

window.onload = function() {
    initializeList('list1');
    initializeList('list2');

    console.log('Loading data...');
    d3.csv("data/data.csv", function(data) {
        rawData.push({Date:new Date(data.Date), KW:Number(data.KW)});
    }).then( function() { onDataLoaded();} );
};

function initializeList(id) {
    var checkList = document.getElementById(id);
    checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
    };
}

function onButtonClick() {
    var average = document.getElementById("average").checked;
    var chartType = document.getElementById("charts").value;
    
    setChart(chartType, average);
}

function setChart(chartType, average) {

    filterMinutes();

    var dataset = null;
    switch(chartType) {
        case 'hourly': dataset = getHourlyReport(average);
            break;
        case 'daily': dataset = getWeeklyReport();
            break;
        case 'monthly': dataset = getMonthlyReport(average);
            break;
    }
    
    buildChart(dataset);
}

function onDataLoaded() {
    console.log('Data loaded.');
    rawData.sort( function(a,b) { return a.Date.getTime() > b.Date.getTime() ? 1 : -1; });

    for(var i = 1; i < rawData.length; i++) {
        var difference = rawData[i].Date.getTime()-rawData[i-1].Date.getTime();
        var m = difference / 1000 / 60;

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
            allMinutes.push({Date:newDate, KW:averageKW});
        }
    }

    setChart('daily', false);
}

function filterMinutes() {
    minutes = [];
    for(var i = 0; i < allMinutes.length; i++) {
        var year = allMinutes[i].Date.getFullYear();
        var month = allMinutes[i].Date.getMonth();
        var date = allMinutes[i].Date.getDate();
        var day = allMinutes[i].Date.getDay();
        var hour = allMinutes[i].Date.getHours();

        if(isYearFiltered(year) || isDayFiltered(day)) {
            continue;
        }
        
        minutes.push(allMinutes[i]);
    }
}

function isDayFiltered(day) {
    return (day == 0 && document.getElementById('chkSunday').checked == false) ||
           (day == 1 && document.getElementById('chkMonday').checked == false) ||
           (day == 2 && document.getElementById('chkTuesday').checked == false) ||
           (day == 3 && document.getElementById('chkWednesday').checked == false) ||
           (day == 4 && document.getElementById('chkThursday').checked == false) ||
           (day == 5 && document.getElementById('chkFriday').checked == false) ||
           (day == 6 && document.getElementById('chkSaturday').checked == false);
}

function isYearFiltered(year) {
    return (year == 2019 && document.getElementById('chk2019').checked == false) ||
           (year == 2020 && document.getElementById('chk2020').checked == false) ||
           (year == 2021 && document.getElementById('chk2021').checked == false) ||
           (year == 2022 && document.getElementById('chk2022').checked == false);
}

function getHourlyReport(average) {
    var hours = new Array(24);
    for(var h = 0; h < hours.length; h++){
        var label = h.toString();
        hours[h] = {x: label, y: 0, z: 0};
    }

    for(var i = 0; i < minutes.length; i++) {
        var year = minutes[i].Date.getFullYear();
        var month = minutes[i].Date.getMonth();
        var day = minutes[i].Date.getDate();
        var hour = minutes[i].Date.getHours();
        var kw = minutes[i].KW;

        hours[hour].y += kw;
        hours[hour].z++;
    }       
    
    if(average) {
        for(var j = 0; j < hours.length; j++) {
            hours[j].y = (hours[j].y / hours[j].z)*60;
        } 
    }

    return hours;
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

function getMonthlyReport(average) {
    var months = [];

    for(var i = 0; i < minutes.length; i++) {
        var year = minutes[i].Date.getFullYear();
        var month = minutes[i].Date.getMonth();
        var day = minutes[i].Date.getDate();
        var kw = minutes[i].KW;

        var label = monthArray[month] + "-" + year;
        var set = getDataSet(months, label);
        if(!set) {
            set = {x: label, y: 0, z: 0, year: year, month: month, maxDay: 0, minDay: 32};
            months.push(set);
        }

        set.y += kw;
        set.z++;
        set.maxDay = day;
        set.minDay = day < set.minDay ? day : set.minDay;
    }       
    
    if(average) {
        for(var j = 0; j < months.length; j++) {
            months[j].y = months[j].y / (months[j].maxDay - months[j].minDay + 1);
        } 
    }

    return months;
}

function getDataSet(months, label) {
    for(var i = 0; i < months.length; i++) {
        if(months[i].x == label) {
            return months[i];
        }
    }
    return null;
}

function buildChart(set){
    console.log('Building chart.');

    if(myChart) {
        myChart.destroy();
    }

    var ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'KW',
                data: set
            }]
        }
    });
}
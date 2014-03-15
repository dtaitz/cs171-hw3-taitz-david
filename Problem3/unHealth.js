var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

var parseDate = d3.time.format("%y-%b").parse;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};

dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

d3.csv("womenshealth.csv", function(data) {


    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.womenshealth = +convertToInt(d.womenshealth);
    });

    dataSet = data;

    console.log(dataSet);

    createOverview(dataSet)
    createDetail(dataSet)

});

createOverview = function(dataSet) {
  var x = d3.time.scale()
      .range([0, bbOverview.w]);

  var y = d3.scale.linear()
      .range([bbOverview.h, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.womenshealth); });

  var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(bbOverview.h)
      .y1(function(d) { return y(d.womenshealth); });

  //console.log(data);

    x.domain(d3.extent(dataSet, function(d) { return d.date; }));
    y.domain(d3.extent(dataSet, function(d) { return d.womenshealth; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(25," + bbOverview.h + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25,0)")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")


    svg.append("path")
        .datum(dataSet)
        .attr("class", "line")
        .attr("transform", "translate(25,0)")
        .attr("class", "timeArea")
        .attr("d", line)
        .attr("d", area);
}

createDetail = function(dataSet) {
  var x = d3.time.scale()
      .range([0, bbDetail.w]);

  var y = d3.scale.linear()
      .range([bbDetail.h, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.womenshealth); });

  var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(bbDetail.h)
      .y1(function(d) { return y(d.womenshealth); });

    x.domain(d3.extent(dataSet, function(d) { return d.date; }));
    y.domain(d3.extent(dataSet, function(d) { return d.womenshealth; }));

    var newOverview =  bbOverview.h + 50;
    var newHeight = newOverview + bbDetail.h;
    console.log(newHeight)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(25," + newHeight + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25," + newOverview + ")")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tweets");

    svg.append("path")
        .datum(dataSet)
        .attr("transform", "translate(25," + newOverview + ")")
        .attr("class", "line")
        .attr("class", "timeArea")
        .attr("d", line)
        .attr("d", area);
}





var bbDetail, bbOverview, dataSet, svg, areaDetail;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

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

var parseDate = d3.time.format("%y-%b").parse;

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

var xOverviewScale = d3.time.scale()
      .range([0, bbOverview.w]);

var yOverviewScale = d3.scale.linear()
      .range([bbOverview.h, 0]);

var xDetailScale = d3.time.scale()
      .range([0, bbDetail.w]);

var yDetailScale = d3.scale.linear()
      .range([bbDetail.h, 0]);

var xAxisDetail = d3.svg.axis().scale(xDetailScale).orient("bottom");
var xAxisOverview = d3.svg.axis().scale(xOverviewScale).orient("bottom");
var yAxisDetail = d3.svg.axis().scale(yDetailScale).orient("left");
var yAxisOverview = d3.svg.axis().scale(yOverviewScale).orient("left");

var brush = d3.svg.brush()
  .x(xOverviewScale)
  .on("brush", brushed);

var svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    });

var areaDetail = d3.svg.area()
    .x(function(d) { 
      console.log((d.date))
      return xDetailScale(d.date); })
    .y0(bbDetail.h)
    .y1(function(d) { return yDetailScale(d.womenshealth); });


var areaOverview = d3.svg.area()
    .x(function(d) { return xOverviewScale(d.date); })
    .y0(bbOverview.h)
    .y1(function(d) { return yOverviewScale(d.womenshealth); });

/*
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height); */

var detail = svg.append("g")
  .attr("class", "detail")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var overview = svg.append("g")
    .attr("class", "overview")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

d3.csv("womenshealth.csv", type, function(error , data) {
  xDetailScale.domain(d3.extent(data, function(d) { return d.date; }));
  yDetailScale.domain(d3.extent(data, function(d) { return d.womenshealth; }));
  xOverviewScale.domain(d3.extent(data, function(d) { return d.date; }));
  yOverviewScale.domain(d3.extent(data, function(d) { return d.womenshealth; }));

  var newOverview =  bbOverview.h + 50;
  var newHeight = newOverview + bbDetail.h;


  detail.append("path")
        .datum(data)
        .attr("transform", "translate(25," + newOverview + ")")
        .attr("class","area")
        .attr("class","path")
        .attr("class", "line")
        //.attr("d", lineDetail)
        .attr("d", areaDetail);

    detail.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(25," + newHeight + ")")
        .call(xAxisDetail);

    detail.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25," + newOverview + ")")
        .call(yAxisDetail)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tweets");

    overview.append("path")
        .datum(data)
        .attr("transform", "translate(25,0)")
        .attr("class","area")
        .attr("class","path")
        .attr("class", "line")
        .attr("class", "timeArea")
        //.attr("d", lineOverview)
        .attr("d", areaOverview);

    overview.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(25," + bbOverview.h + ")")
        .call(xAxisOverview);

    overview.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25,0)")
        .call(yAxisOverview) 

    overview.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", bbOverview.h + 7);

    /* overview.append("g")
            .selectAll("circle")
            .attr("class","point")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xOverviewScale(d.date) +25; })
            .attr("cy", function(d) { return yOverviewScale(d.womenshealth); })
            .attr("r", "3")
            .style("fill", "blue")


    detail.append("g")
            .selectAll("circle")
            .attr("class","point")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xDetailScale(d.date) +25; })
            .attr("cy", function(d) { return yDetailScale(d.womenshealth)+newOverview; })
            .attr("r", "3")
            .style("fill", "blue") */

});

  function brushed() {
    xDetailScale.domain(brush.empty() ? xOverviewScale.domain() : brush.extent());
    detail.select(".area").attr("d", areaDetail);
    detail.select(".x.axis").call(xAxisDetail);
  }; 


  function type(d) {
      d.date = parseDate(d.date);
      //console.log(+convertToInt(d.womenshealth));
      d.womenshealth = +convertToInt(d.womenshealth);
      return d;
  }







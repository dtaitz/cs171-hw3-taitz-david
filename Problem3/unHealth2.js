var bbDetail, bbOverview, dataSet, svg, areaDetail, areaOverview;

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

var xOverviewScale = d3.time.scale()
      .range([0, bbOverview.w]);

var yOverviewScale = d3.scale.linear()
      .range([bbOverview.h, 0]);

var xDetailScale = d3.time.scale()
      .range([0, bbDetail.w]);

var yDetailScale = d3.scale.linear()
      .range([bbDetail.h, 0]);

var xAxisOverview = d3.svg.axis()
      .scale(xOverviewScale)
      .orient("bottom");

var yAxisOverview = d3.svg.axis()
      .scale(yOverviewScale)
      .orient("left");

var xAxisDetail = d3.svg.axis()
    .scale(xDetailScale)
    .orient("bottom");

var yAxisDetail = d3.svg.axis()
    .scale(yDetailScale)
    .orient("left");

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

    createVis(dataSet);

});

createVis = function(dataSet) {

  var lineOverview = d3.svg.line()
      .x(function(d) { return xOverviewScale(d.date); })
      .y(function(d) { return yOverviewScale(d.womenshealth); });

  areaOverview = d3.svg.area()
      .x(function(d) { return xOverviewScale(d.date); })
      .y0(bbOverview.h)
      .y1(function(d) { return yOverviewScale(d.womenshealth); });

  //console.log(data);

    xOverviewScale.domain(d3.extent(dataSet, function(d) { return d.date; }));
    yOverviewScale.domain(d3.extent(dataSet, function(d) { return d.womenshealth; }));

    var overview = svg.append("g");
    var detail = svg.append("g");

    overview.append("g")
        .attr("class", "xAxisOverview")
        .attr("transform", "translate(25," + bbOverview.h + ")")
        .call(xAxisOverview);

    overview.append("g")
        .attr("class", "yAxisOverview")
        .attr("transform", "translate(25,0)")
        .call(yAxisOverview)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")


    overview.append("path")
        .datum(dataSet)
        .attr("class", "line")
        .attr("class","overviewPath")
        .attr("class","path")
        .attr("transform", "translate(25,0)")
        .attr("class", "timeArea")
        .attr("d", lineOverview)
        .attr("d", areaOverview);

    overview.append("g")
            .selectAll("circle")
            .attr("class","point")
            .data(dataSet)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xOverviewScale(d.date) +25; })
            .attr("cy", function(d) { return yOverviewScale(d.womenshealth); })
            .attr("r", "3")
            .style("fill", "blue")

  var lineDetail = d3.svg.line()
      .x(function(d) { return xDetailScale(d.date); })
      .y(function(d) { return yDetailScale(d.womenshealth); });

  areaDetail = d3.svg.area()
      .x(function(d) { return xDetailScale(d.date); })
      .y0(bbDetail.h)
      .y1(function(d) { return yDetailScale(d.womenshealth); });

    xDetailScale.domain(d3.extent(dataSet, function(d) { return d.date; }));
    yDetailScale.domain(d3.extent(dataSet, function(d) { return d.womenshealth; }));

    var newOverview =  bbOverview.h + 50;
    var newHeight = newOverview + bbDetail.h;
    console.log(newHeight)

    detail.append("g")
        .attr("class", "xAxisDetail")
        .attr("transform", "translate(25," + newHeight + ")")
        .call(xAxisDetail);

    detail.append("g")
        .attr("class", "yAxisDetail")
        .attr("transform", "translate(25," + newOverview + ")")
        .call(yAxisDetail)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tweets");

    detail.append("path")
        .datum(dataSet)
        .attr("transform", "translate(25," + newOverview + ")")
        .attr("class","detailPath")
        .attr("class","path")
        .attr("class", "line")
        .attr("class", "detailArea")
        .attr("d", lineDetail)
        .attr("d", areaDetail);

    detail.append("g")
            .selectAll("circle")
            .attr("class","point")
            .data(dataSet)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xDetailScale(d.date) +25; })
            .attr("cy", function(d) { return yDetailScale(d.womenshealth)+newOverview; })
            .attr("r", "3")
            .style("fill", "blue")

    overview.append("g").attr("class", "brush").call(brush)
      .selectAll("rect").attr({
        height: bbOverview.h,
        transform: "translate(0,0)"
      });


}
    var brush = d3.svg.brush().x(xOverviewScale).on("brush", brushed(brush));


  function brushed() {
    xDetailScale.domain(brush.empty() ? xOverviewScale.domain() : brush.extent());
    detail.select(".area").attr("d", areaDetail);
    detail.select(".x.axis").call(xAxisDetail);
  }


//console.log(dataSet);






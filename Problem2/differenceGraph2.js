/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;
    var color = d3.scale.category10();
    var years = [];
    var estimates = [];

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 120
    };

    width = 1000 - margin.left - margin.right;

    height = 650 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 200,
        y: 10,
        w: width - 60,
        h: 300
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("World_population_estimates4.csv", function(data) {

        var keys = d3.keys(data[0]).filter(function(key) { return key !== "year"; });
        keys.push("newValues");

        //color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
        color.domain(keys)

        estimates = color.domain().map(function(census) {
            return {
              name: census,
              values: data.map(function(d) {
                    var results = getValue(d, census, data);
                    return {year: +d.year, population: results.population, name: results.name};
              }).filter(function(d) { return d.population > 0; })
            };
          });

          //console.log(estimates);
        /*
        for (x = 0; x < data.length; x++){
            console.log(data[x].years);
            years.push(parseInt(data[x].years));
        } */

        //console.log(years); // returns parsed years
        //doEverythingElse(); //Asynchronous

        createVis();
    });

    getValue = function(d,census,data){

        var maxDate = 0;
        var minDate = "bad";
        var includeData = data.filter(function(a){
            return +a[census] != 0 && !isNaN(a[census]); 
        });

        //console.log(includeData);

        var includeDataScale = d3.scale.linear()
        .domain(includeData.map(function(a){
            if (minDate == "bad"){
                //console.log(mindate)
                minDate = a.year
            }
            else if (a.year > maxDate){
                maxDate = a.year
            }
            //console.log(a.year);
            //console.log(a.year);
            return a.year;
        }))
        .range(includeData.map(function(a){
            //console.log(a[census]);

            return a[census];
        }));

        if (d.year < maxDate && d.year > minDate && d[census] == 0){
            return {
                population: includeDataScale(d.year),
                name: "newValues" //&& return name
            };
        }
        else{
            return {
                population: +d[census], //&& return census
                name: census
            };
        }
    }

    var yearSet = [];

    addPoint = function(year, population, census){
        //database columns as estimate names
        var added = false;
        yearSet.forEach(function(d){
            if (d.year == year){
                d[census]= +population;
                added = true;
                return false;
            }
        })
            if (added){
                return;
            }
            var x = {
            year: year,

        }
        x[census] = +population;
        yearSet.push(x);
    }

    createVis = function() {
        //console.log("has run");
        var xAxis, xScale, yAxis,  yScale;

        estimates.forEach(function(d){
            d.values.forEach(function(x){
                addPoint(x.year,x.population,d.name); 
            })
        });

        //console.log("yearSet",yearSet);

        var newDataSet = [];

        yearSet.forEach(function(d){
            var yearData = [];
            d3.keys(d).forEach(function(x){
                if (x != "year"){
                    yearData.push(d[x])
                }
            })
            newDataSet.push({
                year: d.year,
                max: d3.max(yearData),
                min: d3.min(yearData),
                mean: d3.mean(yearData)
            })
        });

        newDataSet.sort(function(a,b){
            return d3.ascending(a.year,b.year);
        })

       console.log(newDataSet);

        //newDataSet.forEach(function(d){})

          xScale = d3.scale.linear()
            .range([0, bbVis.w]);  // define the right domain generically

        //console.log(estimates);

        xScale.domain([
            d3.min(newDataSet, function(d) { return d.year }),
            d3.max(newDataSet, function(d) { return d.year })
        ]);

		  // example that translates to the bottom left of our vis space:
		  var visFrame = svg.append("g").attr({
		      "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
		  	  //....
			  
		  });
		  
		  visFrame.append("rect");


        var yScale = d3.scale.log()
            .range([bbVis.h , 0]);

        yScale.domain([
            d3.min(newDataSet, function(d) { return d.mean }),
            d3.max(newDataSet, function(d) { return d.mean })
        ]);

            //d3.min(newDataset, function(d){return d.min}),
            //d3.max(newDataset, function(d){return d.max})

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.mean); });




          svg.append("g")
              .attr("class", "xaxis")
              .attr("transform", "translate(0," + bbVis.h + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)

            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Population Estimates");


        var estimate = svg.selectAll(".estimate")
              .data(newDataSet)
              .enter()
              .append("g")
              .attr("class", "estimate")

        var minPoint = svg.selectAll(".min")
              .data(newDataSet)
              .enter()
              .append("g")
              .attr("class", "min")


        var maxPoint = svg.selectAll(".max")
              .data(newDataSet)
              .enter()
              .append("g")
              .attr("class", "max")

        estimate.append("path")
          .attr("class", "line")
          //.attr("transform", "translate(" + bbVis.x + ",0)")
          .attr("d", 
                line(newDataSet)
            )
          .style("stroke","black")
          //.style("stroke", estimates, function(d) { return color(d.name); });

        /*estimate.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + xScale(d.year) + "," + yScale(d.population) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; }); */

          //console.log(color("newValues"))

        newDataSet.forEach(function(d){
            //console.log(yScale(d.mean));
        })

        estimate.selectAll("circle")
            .attr("class","point")
            .data(newDataSet)
            .enter()
            //d3.keys(d).forEach(function(x){
                .append("circle")
                //.attr("transform", "translate(" + bbVis.x + ",0)")
                .attr("cx", function(d) { return xScale(d.year); })
                .attr("cy", function(d) { return yScale(d.mean) ; })
                .attr("r", "3")
                .style("fill","black")


        minPoint.selectAll("circle")
            .attr("class","point")
            .data(newDataSet)
            .enter()
            //d3.keys(d).forEach(function(x){
                .append("circle")
                //.attr("transform", "translate(" + bbVis.x + ",0)")
                .attr("cx", function(d) { return xScale(d.year); })
                .attr("cy", function(d) { return yScale(d.min) ; })
                .attr("r", "3")
                .style("fill","orange")


        maxPoint.selectAll("circle")
            .attr("class","point")
            .data(newDataSet)
            .enter()
            //d3.keys(d).forEach(function(x){
                .append("circle")
                //.attr("transform", "translate(" + bbVis.x + ",0)")
                .attr("cx", function(d) { return xScale(d.year); })
                .attr("cy", function(d) { return yScale(d.max) ; })
                .attr("r", "3")
                .style("fill","blue")

            /* d3.keys(d).forEach(function(x){
                    if (x != "year"){
                        return yScale(d[x]);
                    }
            }) */


            //.style("fill", estimates, function(d) { return color(d.name); })
            //.filter(function(d) { return d.population == ""; }).remove();

    };

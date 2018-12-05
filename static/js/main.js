
// Load the data
queue()
    .defer(d3.csv, "static/data/categories.csv")
    .defer(d3.csv, "static/data/scores.csv")
    .await(compileData);

function compileData(error, categoryData, scoreData) {
    // Make sure no error loading data
    if (error){
        return console.log(error);
    }

    // Create map between artist ID and the name
    let categoryMap = {};
    categoryData.forEach(function(categoryObj) {
        categoryMap[categoryObj.categoryID] = categoryObj.category;
    });

    // 347 albums
    // {albumID, title, artistID}
    console.log("score data", scoreData);
    console.log("category map", categoryMap);


    // Now that the data has laoded, we can make the visualization
    createVis("chart-display-col", scoreData, categoryMap);
    createVis("chart-display-col1", scoreData, categoryMap);

}

function createVis(parentElement, scoreData, categoryMap) {
    // Configure margins
    let margin = { top: 20, right: 20, bottom: 90, left: 30 };

    // Cofigure height and width of the visualization
    let width = $("#" + parentElement).width() - margin.left - margin.right,
        height = $("#" + parentElement).height() - margin.top - margin.bottom;

    // SVG drawing area
    let svg = d3.select("#" + parentElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales
    // Use ordinal scale since the x axis isn't numerical
    let xOrdinalScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(.5)
        .domain(d3.map(scoreData, function(datum){return categoryMap[datum.categoryID]}).keys());

    let yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]) // we could also set this to height and 0, but would need to translate axis
        .domain([0, d3.max(scoreData, function(datum){ return datum.score})]);

    // Now set up the axis
    let barYAxis = d3.axisLeft()
        .scale(yScale);

    let barXAxis = d3.axisBottom()
        .scale(xOrdinalScale);

    // Append the axes to the svg
    let barYAxisGroup = svg.append("g")
        .attr("class", "axis bar-y-axis")
        .call(barYAxis);

    let barXAxisGroup = svg.append("g")
        .attr("class", "axis bar-x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(barXAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(75)") // allows us to rotate the text
        .style("text-anchor", "start");;

    // Draw the bars
    let bars = svg.selectAll("rect")
        .data(scoreData)
        .enter()
        .append("rect")
        .attr("class","count-bar")
        .attr("fill", "red")
        .attr("width", xOrdinalScale.bandwidth())
        .attr("height", function(datum) {
            return yScale(0) - yScale(datum.score);
        })
        .attr("y", function(datum){
            return yScale(datum.score);
        })
        .attr("x", function(datum){
            return xOrdinalScale(categoryMap[datum.categoryID]);
        });
}






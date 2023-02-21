import "d3"
import Logger from "log"

async function drawBarChart() {
  Logger.showMode = true

  const ROOT_ELEM = d3.select("#root")
  // 0. Delete All Chids inside of root
  ROOT_ELEM.selectAll("*").remove()

  const data = await d3.json("./data/my_weather_data.json")

  const minSize = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])

  let dimension = {
    width: minSize,
    height: minSize,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  }

  const { width, height, margin } = dimension

  dimension.boundedWidth = width - margin.left - margin.right
  dimension.boundedHeight = height - margin.top - margin.bottom


  // 3. draw canvas
  const wrapper = ROOT_ELEM.append("svg")
    .attr("width", width)
    .attr("height", height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${margin.left}px, ${margin.top}px)`)

  const attrName = "humidity"
  const xAccessor = d => d[attrName]

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, xAccessor)])
    .range([0, dimension.boundedWidth])

  const binGenerator = d3.bin()
    .domain(xScale.domain())
    .value(xAccessor)

  const bins = binGenerator(data)

  const yScale = d3.scaleLinear()
    .domain([0, Math.max(...(bins.map(d => d.length)))])
    .range([0, dimension.boundedHeight])


  const binGroup = bounds.append("g")
  const binGroups = binGroup.selectAll("g")
    .data(bins)
    .join("g")

  binGroups.append("rect")
    .attr("x", d => xScale(d.x0))
    .attr("y", d => dimension.boundedHeight - yScale(d.length))
    .attr("width", d => xScale(d.x1 - d.x0) - 1)
    .attr("height", d => yScale(d.length))
    .attr("fill", "cornflowerblue")

  const xAxisGenerator = d3.axisBottom(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimension.boundedHeight}px)`)


  const texts = binGroups.append("text")
    .attr("x", d => xScale(d.x0) + xScale(d.x1 - d.x0) / 2)
    .attr("y", d => dimension.boundedHeight - yScale(d.length))
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .html(d => d.length)

  const mean = d3.mean(data, xAccessor)

  const meanGroup = bounds.append("g")
  const meanLine = meanGroup.append("line")
    .attr("x1", xScale(mean))
    .attr("x2", xScale(mean))
    .attr("y1", -20)
    .attr("y2", dimension.boundedHeight)
    .attr("stroke", "maroon")
    .attr("stroke-dasharray", "2px 4px")
  const meanText = meanGroup.append("text")
    .attr("x", xScale(mean))
    .attr("y", -30)
    .attr("fill", "maroon")
    .style("text-anchor", "middle")
    .html("mean")
}

export default drawBarChart
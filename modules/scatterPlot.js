import "d3"
import Logger from "log"

async function drawScatterPlot() {
  Logger.showMode = true

  const ROOT_ELEM = d3.select("#root")
  // 0. Delete All Chids inside of root
  ROOT_ELEM.selectAll("*").remove()

  const data = await d3.json("./data/my_weather_data.json")
  console.table(data[0])

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  const minSize = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])

  let dimension = {
    width: minSize,
    height: minSize,
    margin: {
      top: 10,
      right: 10,
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

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimension.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimension.boundedHeight, 0])
    .nice()

  const colorAccessor = d => d.cloudCover
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(["skyblue", "darkslategrey"])

  const dots = bounds.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)))

  // axis
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimension.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
    .attr("x", dimension.boundedWidth / 2)
    .attr("y", dimension.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point(F)")

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
  const yAxisLabel = yAxis.append("text")
    .attr("x", -dimension.boundedHeight / 2)
    .attr("y", -dimension.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .style("rotate", "-90deg")
    .style("text-anchor", "middle")
    .html("Relative Humidity")

}

export default drawScatterPlot
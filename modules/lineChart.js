import "d3"
import Logger from "log"

async function drawLineChart() {
  Logger.showMode = false

  const ROOT_ELEM = d3.select("#root")
  // 0. Delete All Chids inside of root
  ROOT_ELEM.selectAll("*").remove()

  // 1. Make Area
  const wrapper = {
    width: 500,
    height: 500,
    padding: 30
  }

  const bound = {
    width: wrapper.width - (wrapper.padding * 2),
    height: wrapper.height - (wrapper.padding * 2),
  }

  const Wrapper = ROOT_ELEM
    .append("svg")
    .attr("width", `${wrapper.width}px`)
    .attr("height", `${wrapper.height}px`)
    .style("outline", "1px solid blue")

  const Bound = Wrapper
    .append("g")
    .style("transform", `translate(${wrapper.padding}px, ${wrapper.padding}px)`)


  // 2. Mangle Data
  const _rawData = await d3.tsv("https://raw.githubusercontent.com/ttimbers/palmerpenguins/aef2d7c48466b88dcfe0832a67b0a270607f1737/inst/extdata/penguins.tsv")

  const xAttrName = "flipper_length_mm"
  const yAttrName = "bill_length_mm"

  const xAccessor = d => d[xAttrName]
  const yAccessor = d => d[yAttrName]

  const rawData = _rawData.filter(d => xAccessor(d) !== "NA" && yAccessor(d) !== "NA")

  Logger.log(rawData.map(xAccessor))
  Logger.log(rawData.map(yAccessor))

  const xScale = d3.scaleLinear()
    .domain(d3.extent(rawData, xAccessor))
    .range([0, bound.width])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(rawData, yAccessor))
    .range([bound.height, 0])


  // 3. Draw Line
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  Bound.append("path")
    .attr("d", lineGenerator(rawData))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2);

  // 4. Draw Axis
  const yAxisGenerator = d3.axisLeft().scale(yScale)
  Bound.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom().scale(xScale)
  Bound.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${bound.height}px)`)
}

export default drawLineChart
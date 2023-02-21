import "d3"
import Logger from "log"

async function drawScatterPlotExercise() {
  Logger.showMode = true

  const ROOT_ELEM = d3.select("#root")
  // 0. Delete All Chids inside of root
  ROOT_ELEM.selectAll("*").remove()

  // 1. Make Area
  const wrapper = {
    width: 500,
    height: 500,
    padding: 50
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
  const rawData = await d3.tsv("https://raw.githubusercontent.com/ttimbers/palmerpenguins/aef2d7c48466b88dcfe0832a67b0a270607f1737/inst/extdata/penguins.tsv")
  console.table(rawData[0])


  const xAttrName = "bill_depth_mm"
  const yAttrName = "bill_length_mm"
  const colorAttrName = "body_mass_g"
  const numberParser = d => parseFloat(d, 10)
  const xAccessor = d => numberParser(d[xAttrName])
  const yAccessor = d => numberParser(d[yAttrName])
  const colorAccessor = d => numberParser(d[colorAttrName])

  const xScale = d3.scaleLinear()
    .domain(d3.extent(rawData, xAccessor))
    .range([0, bound.width])
    .nice()
  console.log(d3.extent(rawData, xAccessor), xScale(13))
  const yScale = d3.scaleLinear()
    .domain(d3.extent(rawData, yAccessor))
    .range([bound.height, 0])
    .nice()
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(rawData, colorAccessor))
    .range(["skyblue", "red"])

  Bound.selectAll("circle")
    .data(rawData)
    .join("circle")
    .filter(d => !(Number.isNaN(xAccessor(d)) || Number.isNaN(yAccessor(d))))
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 3)
    .attr("fill", d => colorScale(colorAccessor(d)))


  const xAxisGenerator = d3.axisBottom(xScale)
  const yAxisGenerator = d3.axisLeft(yScale)


  const fontStyle = `
    font-size: 1rem;
    font-weight: bold;
  `
  const xAxis = Bound.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${bound.height}px)`)
  xAxis.append("text")
    .attr("x", `${bound.width / 2}px`)
    .attr("y", `${wrapper.padding / 2 + 10}px`)
    .attr("fill", "red")
    .attr("style", fontStyle)
    .html(xAttrName)

  const yAxis = Bound.append("g")
    .call(yAxisGenerator)
  yAxis.append("text")
    .attr("x", `${wrapper.padding / 2 + 10}px`)
    .attr("y", `${bound.height / 2 - wrapper.padding / 2}px`)
    .attr("style", `transform: rotate(-90deg); ${fontStyle}`)
    .attr("transform-origin", `0 ${bound.height / 2}`)
    .attr("fill", "red")
    .html(yAttrName)
}

export default drawScatterPlotExercise
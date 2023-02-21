import "d3"
import * as modules from "modules"

// modules.lineChart()
// modules.scatterPlot()
// modules.scatterPlotExercise()
modules.barChart()

const xScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 100])
console.log(xScale(1))

const sampleData = [1,2,3,4,5,6,7,8,1,2,3,9]
const binsGenerator = d3.bin()
  .domain(xScale.domain())

const bins = binsGenerator(sampleData)
console.log(bins)
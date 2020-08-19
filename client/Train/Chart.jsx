import React from 'react'
import '../../../node_modules/react-vis/dist/style.css'
import {
  XYPlot,
  LineSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
} from 'react-vis'

export default function Chart(props) {
  return (
    <XYPlot width={300} height={300}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <LineSeries data={props.data} color="blue" />
    </XYPlot>
  )
}

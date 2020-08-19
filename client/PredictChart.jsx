import React from 'react'
import {
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  YAxis,
  XAxis,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import PropTypes from 'prop-types'

const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`

const CustomizedLabel = (props) => {
  const { x, y, width, allData, value, index } = props
  const radius = 17

  return allData.length - 1 === index ? (
    value > 0.85 ? (
      <g>
        <circle
          cx={x + width / 2}
          cy={y + radius + 5}
          r={radius}
          fill="#fff"
          style={{ opacity: '85%' }}
        />
        <text
          x={x + width / 2}
          y={y + radius + 5}
          fill="#000000"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {`${(value * 100).toFixed(0)}%`}
        </text>
      </g>
    ) : (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          fill="#000000"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {`${(value * 100).toFixed(0)}%`}
        </text>
      </g>
    )
  ) : (
    ''
  )
}

CustomizedLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  allData: PropTypes.array,
  width: PropTypes.number,
  value: PropTypes.number,
  index: PropTypes.number,
}

const CustomizedAxisTick = (props) => {
  const { x, y, payload } = props

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-70)"
      >
        {payload.value}
      </text>
    </g>
  )
}

CustomizedAxisTick.propTypes = {
  payload: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
}

const TooltipContent = (props) => {
  const total = props.payload.reduce((result, entry) => result + entry.value, 0)
  const recomend = total > 0.6 ? 'Рекомендуется посетить кардиолога.' : ''
  const tooltipText = `Вероятность наличия сердечно-сосудистого 
                            риска: ${(total * 100).toFixed(0)}%.`
  return (
    <div
      className="custom-tooltip"
      style={{
        border: '1px solid #f5f5f5',
        backgroundColor: 'rgba(255, 255, 255, 255)',
        color: 'black',
        maxWidth: '180px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50px',
        borderRadius: '4px',
        padding: '5px',
        opacity: '85%',
      }}
    >
      <span className="label">{tooltipText}</span>
      <span className="intro">{recomend}</span>
    </div>
  )
}

TooltipContent.propTypes = {
  payload: PropTypes.array,
}

const CustomShape = (props) => {
  const { x, y, width, height, data } = props
  let BarShapeFill = ''
  if (data <= 0.1) BarShapeFill = 'url(#color1)'
  else if (data <= 0.2) BarShapeFill = 'url(#color2)'
  else if (data <= 0.3) BarShapeFill = 'url(#color3)'
  else if (data <= 0.4) BarShapeFill = 'url(#color4)'
  else if (data <= 0.5) BarShapeFill = 'url(#color5)'
  else if (data <= 0.6) BarShapeFill = 'url(#color6)'
  else if (data <= 0.7) BarShapeFill = 'url(#color7)'
  else if (data <= 0.8) BarShapeFill = 'url(#color8)'
  else if (data <= 0.9) BarShapeFill = 'url(#color9)'
  else if (data <= 1) BarShapeFill = 'url(#color10)'

  return <rect fill={BarShapeFill} x={x} y={y} width={width} height={height} />
}

CustomShape.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  data: PropTypes.number,
}

const PredictChart = (props) => {
  const data =
    props.data.length > 0
      ? props.data
      : [
        { name: '25.04.2020', data: 0.30 },
      ]
  return (
    <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="color10" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FF523F" offset="25%" />
            <stop stopColor="#FFEB01" offset="30%" />
            <stop stopColor="#FFEB01" offset="45%" />
            <stop stopColor="#13C500" offset="80%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color9" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FF523F" offset="15%" />
            <stop stopColor="#FFEB01" offset="25%" />
            <stop stopColor="#FFEB01" offset="43%" />
            <stop stopColor="#13C500" offset="75%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color8" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FF523F" offset="10%" />
            <stop stopColor="#FFEB01" offset="15%" />
            <stop stopColor="#FFEB01" offset="35%" />
            <stop stopColor="#13C500" offset="65%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color7" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FF523F" offset="0.1%" stopOpacity="80%" />
            <stop stopColor="#FFEB01" offset="5%" />
            <stop stopColor="#FFEB01" offset="30%" />
            <stop stopColor="#13C500" offset="60%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color6" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FFEB01" offset="20%" />
            <stop stopColor="#13C500" offset="45%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color5" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#FFEB01" offset="1%" />
            <stop stopColor="#13C500" offset="30%" />
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color4" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color3" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color2" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
          <linearGradient id="color1" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#13C500" offset="100%" />
          </linearGradient>
        </defs>
        <Tooltip content={<TooltipContent />} />
        <XAxis
          dataKey="name"
          tick={<CustomizedAxisTick />}
          height={80}
          interval={0}
        />
        <YAxis
          tickFormatter={toPercent}
          ticks={[0.2, 0.4, 0.6, 0.8, 1]}
          type="number"
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="data" shape={<CustomShape />}>
          <LabelList
            dataKey="data"
            content={<CustomizedLabel allData={data} />}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

PredictChart.propTypes = {
  data: PropTypes.array,
}

export default PredictChart

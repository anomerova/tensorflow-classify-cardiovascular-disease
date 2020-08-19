import React from 'react'
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import PropTypes from 'prop-types'
import moment from 'moment'

const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`

const TooltipContent = (props) => {
  const total = props.payload.reduce((result, entry) => result + entry.value, 0)
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
    </div>
  )
}

TooltipContent.propTypes = {
  payload: PropTypes.array,
}

const AllUserChart = (props) => {
  const data = props.data.map((todayData) => {
    return {
      name: todayData.personnelNumber,
      data: todayData.result,
    }
  })

  React.useEffect(() => {
    props.getTodayData(moment(new Date()).format('DD.MM.YYYY'))
  }, [])

  return data.length > 0 ? (
    <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Tooltip content={<TooltipContent />} />
        <YAxis
          tickFormatter={toPercent}
          ticks={[0.2, 0.4, 0.6, 0.8, 1]}
          type="number"
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Line dataKey="data" />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    ''
  )
}

AllUserChart.propTypes = {
  getTodayData: PropTypes.func,
  data: PropTypes.array,
}

export default AllUserChart

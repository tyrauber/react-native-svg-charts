import React from 'react'
import LineChart from './line-chart'
import LineChartGrouped from './line-chart-grouped'

interface LineChartGateProps {
    data: Array<any>
    [key: string]: any
}

const LineChartGate: React.FC<LineChartGateProps> = ({ data, ...props }) => {
    if (data[0] && 'data' in data[0]) {
        return <LineChartGrouped data={data} {...props} />
    }

    return <LineChart data={data} {...props} />
}

export default LineChartGate

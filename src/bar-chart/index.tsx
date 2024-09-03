import React from 'react'
import BarChart from './bar-chart'
import BarChartGrouped from './bar-chart-grouped'

interface BarChartGateProps {
    data: Array<any>
    [key: string]: any
}

const BarChartGate: React.FC<BarChartGateProps> = ({ data, ...props }) => {
    if (data[0] && data[0].hasOwnProperty('data')) {
        return <BarChartGrouped data={data} {...props} />
    }

    return <BarChart data={data} {...props} />
}

export default BarChartGate

import React from 'react'
import { View } from 'react-native'
import * as shape from 'd3-shape'
import Chart, { ChartProps } from './chart'

interface AreaChartProps extends ChartProps {
    start?: number
}

const AreaChart: React.FC<AreaChartProps> = ({ start = 0, ...props }) => {
    const createPaths = ({ data, x, y }: { data: any[]; x: any; y: any }) => {
        const { curve } = props

        const area = shape
            .area()
            .x((d: any) => x(d.x))
            .y0(y(start))
            .y1((d: any) => y(d.y))
            .defined((item: any) => typeof item.y === 'number')
            .curve(curve)(data)

        const line = shape
            .line()
            .x((d: any) => x(d.x))
            .y((d: any) => y(d.y))
            .defined((item: any) => typeof item.y === 'number')
            .curve(curve)(data)

        return {
            path: area,
            area,
            line,
        }
    }

    return <Chart {...props} createPaths={createPaths} />
}

export default AreaChart

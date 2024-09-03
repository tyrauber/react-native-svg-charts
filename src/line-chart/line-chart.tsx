import * as shape from 'd3-shape'
import Chart, { ChartProps } from '../chart'

interface LineChartProps extends ChartProps {
    curve?: shape.CurveFactory
}

class LineChart extends Chart<LineChartProps> {
    createPaths({ data, x, y }: { data: any[]; x: any; y: any }) {
        const { curve = shape.curveLinear } = this.props

        const line = shape
            .line()
            .x((d: any) => x(d.x))
            .y((d: any) => y(d.y))
            .defined((item: any) => typeof item.y === 'number')
            .curve(curve)(data)

        return {
            path: line,
            line,
        }
    }
}

export default LineChart

import * as shape from 'd3-shape'
import ChartGrouped, { ChartGroupedProps } from '../chart/chart-grouped'

interface LineChartGroupedProps extends ChartGroupedProps {
    curve?: shape.CurveFactory
}

class LineChartGrouped extends ChartGrouped<LineChartGroupedProps> {
    createPaths({ data, x, y }: { data: any[][]; x: any; y: any }) {
        const { curve = shape.curveLinear } = this.props

        const lines = data.map((line) =>
            shape
                .line()
                .x((d: any) => x(d.x))
                .y((d: any) => y(d.y))
                .defined((item: any) => typeof item.y === 'number')
                .curve(curve)(line)
        )

        return {
            path: lines,
            lines,
        }
    }
}

export default LineChartGrouped

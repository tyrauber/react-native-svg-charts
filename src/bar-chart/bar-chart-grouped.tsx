import React from 'react'
import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import BarChart from './bar-chart'

interface BarChartGroupedProps extends React.ComponentProps<typeof BarChart> {
    data: Array<{
        data: Array<number | { value: number; svg?: object }>
        svg?: object
    }>
}

class BarChartGrouped extends BarChart<BarChartGroupedProps> {
    calcXScale(domain: any[]) {
        const {
            horizontal,
            contentInset: { left = 0, right = 0 },
            spacingInner,
            spacingOuter,
            clamp = false,
        } = this.props

        const { width } = this.state

        if (horizontal) {
            return scale
                .scaleLinear()
                .domain(domain)
                .range([left, width - right])
                .clamp(clamp)
        }

        return scale
            .scaleBand()
            .domain(domain)
            .range([left, width - right])
            .paddingInner([spacingInner])
            .paddingOuter([spacingOuter])
    }

    calcYScale(domain: any[]) {
        const {
            horizontal,
            spacingInner,
            spacingOuter,
            contentInset: { top = 0, bottom = 0 },
            clamp = false,
        } = this.props

        const { height } = this.state

        if (horizontal) {
            return scale
                .scaleBand()
                .domain(domain)
                .range([top, height - bottom])
                .paddingInner([spacingInner])
                .paddingOuter([spacingOuter])
        }

        return scale
            .scaleLinear()
            .domain(domain)
            .range([height - bottom, top])
            .clamp(clamp)
    }

    calcAreas(x: any, y: any) {
        const { horizontal, data, yAccessor } = this.props

        const _data = data.map((obj) => {
            const { svg = {} } = obj
            return {
                ...obj,
                data: obj.data.map((item) => {
                    if (typeof item === 'number') {
                        return {
                            value: item,
                            svg,
                        }
                    }

                    return {
                        ...item,
                        svg: {
                            ...svg,
                            ...item.svg,
                        },
                        value: yAccessor({ item }),
                    }
                }),
            }
        })

        const areas: Array<{ bar: any; path: string }> = []

        if (horizontal) {
            const barWidth = y.bandwidth() / data.length

            _data.forEach((obj, collectionIndex) => {
                obj.data.forEach((item, valueIndex) => {
                    areas.push({
                        bar: item,
                        path: shape
                            .area()
                            .y((value, _index) =>
                                _index === 0
                                    ? y(valueIndex) + barWidth * collectionIndex
                                    : y(valueIndex) + barWidth + barWidth * collectionIndex
                            )
                            .x0(x(0))
                            .x1((value) => x(value))
                            .defined((value) => typeof value === 'number')([item.value, item.value]),
                    })
                })
            })
        } else {
            const barWidth = x.bandwidth() / data.length

            _data.forEach((obj, collectionIndex) => {
                obj.data.forEach((item, valueIndex) => {
                    areas.push({
                        bar: item,
                        path: shape
                            .area()
                            .x((value, _index) =>
                                _index === 0
                                    ? x(valueIndex) + barWidth * collectionIndex
                                    : x(valueIndex) + barWidth + barWidth * collectionIndex
                            )
                            .y0(y(0))
                            .y1((value) => y(value))
                            .defined((value) => typeof value === 'number')([item.value, item.value]),
                    })
                })
            })
        }

        return areas
    }

    calcExtent() {
        const { data, yAccessor, gridMin, gridMax } = this.props
        const dataExtent = array.merge(data.map((obj) => obj.data.map((item) => yAccessor({ item }))))

        const extent = array.extent([...dataExtent, gridMin, gridMax])

        const { yMin = extent[0], yMax = extent[1] } = this.props

        return [yMin, yMax]
    }

    calcIndexes() {
        const { data } = this.props
        return data[0].data.map((_, index) => index)
    }
}

export default BarChartGrouped

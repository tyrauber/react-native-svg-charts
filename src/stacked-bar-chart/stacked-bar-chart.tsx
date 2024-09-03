import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import Svg from 'react-native-svg'
import Path from '../animated-path'

interface StackedBarChartProps {
    data: Array<{ [key: string]: number | { value: number; svg?: object } }>
    keys: Array<string>
    colors: Array<string>
    offset?: (series: any, order: any) => any
    order?: (series: any) => any
    style?: ViewStyle
    spacingInner?: number
    spacingOuter?: number
    animate?: boolean
    animationDuration?: number
    contentInset?: {
        top?: number
        left?: number
        right?: number
        bottom?: number
    }
    gridMin?: number
    gridMax?: number
    valueAccessor?: (params: { item: any; key: string }) => number
    numberOfTicks?: number
    showGrid?: boolean
    horizontal?: boolean
    children?: React.ReactNode
}

interface StackedBarChartState {
    width: number
    height: number
}

class StackedBarChart extends PureComponent<StackedBarChartProps, StackedBarChartState> {
    state: StackedBarChartState = {
        width: 0,
        height: 0,
    }

    private _onLayout = (event: any) => {
        const {
            nativeEvent: {
                layout: { height, width },
            },
        } = event
        this.setState({ height, width })
    }

    calcXScale(domain: any[]) {
        const {
            horizontal,
            contentInset: { left = 0, right = 0 },
            spacingInner = 0.05,
            spacingOuter = 0.05,
        } = this.props

        const { width } = this.state

        if (horizontal) {
            return scale
                .scaleLinear()
                .domain(domain)
                .range([left, width - right])
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
            contentInset: { top = 0, bottom = 0 },
            spacingInner,
            spacingOuter,
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
    }

    calcAreas(x: any, y: any, series: any[]) {
        const { horizontal, colors, keys } = this.props

        if (horizontal) {
            return array.merge(
                series.map((serie, keyIndex) => {
                    return serie.map((entry: any, entryIndex: number) => {
                        const path = shape
                            .area()
                            .x0((d: any) => x(d[0]))
                            .x1((d: any) => x(d[1]))
                            .y((d: any, _index: number) =>
                                _index === 0 ? y(entryIndex) : y(entryIndex) + y.bandwidth()
                            )
                            .defined((d: any) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry])

                        return {
                            path,
                            color: colors[keyIndex],
                            key: keys[keyIndex],
                        }
                    })
                })
            )
        }

        return array.merge(
            series.map((serie, keyIndex) => {
                return serie.map((entry: any, entryIndex: number) => {
                    const path = shape
                        .area()
                        .y0((d: any) => y(d[0]))
                        .y1((d: any) => y(d[1]))
                        .x((d: any, _index: number) => (_index === 0 ? x(entryIndex) : x(entryIndex) + x.bandwidth()))
                        .defined((d: any) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry])

                    return {
                        path,
                        color: colors[keyIndex],
                        key: keys[keyIndex],
                    }
                })
            })
        )
    }

    calcExtent(values: number[]) {
        const { gridMin, gridMax } = this.props
        return array.extent([...values, gridMin, gridMax])
    }

    calcIndexes() {
        const { data } = this.props
        return data.map((_, index) => index)
    }

    getSeries() {
        const { data, keys, offset, order, valueAccessor } = this.props

        return shape
            .stack()
            .keys(keys)
            .value((item, key) => valueAccessor({ item, key }))
            .order(order)
            .offset(offset)(data)
    }

    render() {
        const { data, animate, animationDuration, style, numberOfTicks, children, horizontal } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const series = this.getSeries()

        //double merge arrays to extract just the values
        const values = array.merge(array.merge(series))
        const indexes = this.calcIndexes()

        const extent = this.calcExtent(values)
        const ticks = array.ticks(extent[0], extent[1], numberOfTicks)

        const xDomain = horizontal ? extent : indexes
        const yDomain = horizontal ? indexes : extent

        const x = this.calcXScale(xDomain)
        const y = this.calcYScale(yDomain)

        const bandwidth = horizontal ? y.bandwidth() : x.bandwidth()

        const areas = this.calcAreas(x, y, series)

        const extraProps = {
            x,
            y,
            width,
            height,
            ticks,
            data,
            bandwidth,
        }

        return (
            <View style={style}>
                <View style={{ flex: 1 }} onLayout={this._onLayout}>
                    {height > 0 && width > 0 && (
                        <Svg style={{ height, width }}>
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child) && child.props.belowChart) {
                                    return React.cloneElement(child, extraProps)
                                }
                                return null
                            })}
                            {areas.map((bar, index) => {
                                const keyIndex = index % data.length
                                const key = `${keyIndex}-${bar.key}`
                                const { svg } = data[keyIndex][bar.key] as { svg?: object }

                                return (
                                    <Path
                                        key={key}
                                        fill={bar.color}
                                        {...svg}
                                        d={bar.path}
                                        animate={animate}
                                        animationDuration={animationDuration}
                                    />
                                )
                            })}
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child) && !child.props.belowChart) {
                                    return React.cloneElement(child, extraProps)
                                }
                                return null
                            })}
                        </Svg>
                    )}
                </View>
            </View>
        )
    }
}

export default StackedBarChart

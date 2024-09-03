import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Svg from 'react-native-svg'
import Path from '../animated-path'

interface BarChartProps {
    data: Array<number | { value: number; svg?: object }>
    style?: object
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
    numberOfTicks?: number
    gridMin?: number
    gridMax?: number
    svg?: object
    yMin?: number
    yMax?: number
    clamp?: boolean
    horizontal?: boolean
    yAccessor?: ({ item }: { item: any }) => number
}

interface BarChartState {
    width: number
    height: number
}

class BarChart extends PureComponent<BarChartProps, BarChartState> {
    state: BarChartState = {
        width: 0,
        height: 0,
    }

    _onLayout = (event: any) => {
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
            contentInset: { top = 0, bottom = 0 },
            spacingInner = 0.05,
            spacingOuter = 0.05,
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
        const { horizontal, data, yAccessor = ({ item }: { item: any }) => item } = this.props

        const values = data.map((item) => yAccessor({ item }))

        if (horizontal) {
            return data.map((bar, index) => ({
                bar,
                path: shape
                    .area()
                    .y((value, _index) => (_index === 0 ? y(index) : y(index) + y.bandwidth()))
                    .x0(x(0))
                    .x1((value) => x(value))
                    .defined((value) => typeof value === 'number')([values[index], values[index]]),
            }))
        }

        return data.map((bar, index) => ({
            bar,
            path: shape
                .area()
                .y0(y(0))
                .y1((value) => y(value))
                .x((value, _index) => (_index === 0 ? x(index) : x(index) + x.bandwidth()))
                .defined((value) => typeof value === 'number')([values[index], values[index]]),
        }))
    }

    calcExtent() {
        const { data, gridMin, gridMax, yAccessor = ({ item }: { item: any }) => item } = this.props
        const values = data.map((obj) => yAccessor({ item: obj }))

        const extent = array.extent([...values, gridMin, gridMax])

        const { yMin = extent[0], yMax = extent[1] } = this.props

        return [yMin, yMax]
    }

    calcIndexes() {
        const { data } = this.props
        return data.map((_, index) => index)
    }

    render() {
        const { 
            data, 
            animate, 
            animationDuration, 
            style, 
            numberOfTicks = 10, 
            svg = {}, 
            horizontal, 
            children,
            contentInset = {}
        } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const extent = this.calcExtent()
        const indexes = this.calcIndexes()
        const ticks = array.ticks(extent[0], extent[1], numberOfTicks)

        const xDomain = horizontal ? extent : indexes
        const yDomain = horizontal ? indexes : extent

        const x = this.calcXScale(xDomain)
        const y = this.calcYScale(yDomain)

        const bandwidth = horizontal ? y.bandwidth() : x.bandwidth()

        const areas = this.calcAreas(x, y).filter(
            (area) => area.bar !== null && area.bar !== undefined && area.path !== null
        )

        const extraProps = {
            x,
            y,
            width,
            height,
            bandwidth,
            ticks,
            data,
        }

        return (
            <View style={style}>
                <View style={{ flex: 1 }} onLayout={this._onLayout}>
                    {height > 0 && width > 0 && (
                        <Svg style={{ height, width }}>
                            {React.Children.map(children, (child) => {
                                if (child && (child as React.ReactElement).props.belowChart) {
                                    return React.cloneElement(child as React.ReactElement, extraProps)
                                }
                            })}
                            {areas.map((area, index) => {
                                const {
                                    bar: { svg: barSvg = {} },
                                    path,
                                } = area

                                return (
                                    <Path
                                        key={index}
                                        {...svg}
                                        {...barSvg}
                                        d={path}
                                        animate={animate}
                                        animationDuration={animationDuration}
                                    />
                                )
                            })}
                            {React.Children.map(children, (child) => {
                                if (child && !(child as React.ReactElement).props.belowChart) {
                                    return React.cloneElement(child as React.ReactElement, extraProps)
                                }
                            })}
                        </Svg>
                    )}
                </View>
            </View>
        )
    }
}

export default BarChart
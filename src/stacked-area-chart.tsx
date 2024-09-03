import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import { Svg } from 'react-native-svg'
import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import Path from './animated-path'

interface StackedAreaChartProps {
    data: Array<object>
    keys: Array<string>
    colors: Array<string>
    svgs?: Array<object>
    style?: ViewStyle
    animate?: boolean
    animationDuration?: number
    contentInset?: {
        top?: number
        bottom?: number
        left?: number
        right?: number
    }
    gridMin?: number
    gridMax?: number
    curve?: any
    numberOfTicks?: number
    showGrid?: boolean
    xScale?: Function
    xAccessor?: ({ item, index }: { item: any; index: number }) => number
    yMin?: number
    yMax?: number
    xMin?: number
    xMax?: number
    clampY?: boolean
    clampX?: boolean
    offset?: Function
    order?: Function
    children?: React.ReactNode
}

interface StackedAreaChartState {
    height: number
    width: number
}

class StackedAreaChart extends PureComponent<StackedAreaChartProps, StackedAreaChartState> {
    state: StackedAreaChartState = {
        height: 0,
        width: 0,
    }

    private _onLayout = (event: any) => {
        const {
            nativeEvent: {
                layout: { height, width },
            },
        } = event
        this.setState({ height, width })
    }

    render() {
        const {
            data,
            keys,
            colors,
            curve = shape.curveLinear,
            offset = shape.stackOffsetNone,
            order = shape.stackOrderNone,
            svgs = [],
            animate,
            animationDuration,
            style,
            numberOfTicks = 10,
            contentInset = {},
            gridMin,
            gridMax,
            children,
            xScale = scale.scaleLinear,
            xAccessor = ({ index }) => index,
            showGrid = true,
            clampY,
            clampX,
        } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const { top = 0, bottom = 0, left = 0, right = 0 } = contentInset

        const series = shape.stack().keys(keys).order(order).offset(offset)(data)

        const yValues = array.merge(array.merge(series))
        const xValues = data.map((item, index) => xAccessor({ item, index }))

        const yExtent = array.extent([...yValues, gridMin, gridMax])
        const xExtent = array.extent(xValues)

        const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props

        const y = scale
            .scaleLinear()
            .domain([yMin, yMax])
            .range([height - bottom, top])
            .clamp(clampY)

        const x = xScale()
            .domain([xMin, xMax])
            .range([left, width - right])
            .clamp(clampX)

        const ticks = y.ticks(numberOfTicks)

        const areas = series.map((serie, index) => {
            const path = shape
                .area()
                .x((d, index) => x(xAccessor({ item: d.data, index })))
                .y0((d) => y(d[0]))
                .y1((d) => y(d[1]))
                .curve(curve)(data.map((_, index) => serie[index]))

            return {
                path,
                key: keys[index],
                color: colors[index],
            }
        })

        const extraProps = {
            x,
            y,
            width,
            height,
            ticks,
            areas,
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
                            {areas.map((area, index) => (
                                <Path
                                    key={area.key}
                                    fill={area.color}
                                    {...svgs[index]}
                                    animate={animate}
                                    animationDuration={animationDuration}
                                    d={area.path}
                                />
                            ))}
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

export default StackedAreaChart

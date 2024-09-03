import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import Svg from 'react-native-svg'
import Path from '../animated-path'

export interface ChartProps {
    data: Array<any>
    svg?: object
    style?: ViewStyle
    animate?: boolean
    animationDuration?: number
    curve?: any
    contentInset?: {
        top?: number
        left?: number
        right?: number
        bottom?: number
    }
    numberOfTicks?: number
    gridMin?: number
    gridMax?: number
    yMin?: number
    yMax?: number
    xMin?: number
    xMax?: number
    clampX?: boolean
    clampY?: boolean
    xScale?: Function
    yScale?: Function
    xAccessor?: ({ index }: { index: number }) => number
    yAccessor?: ({ item }: { item: any }) => number
    children?: React.ReactNode
}

interface ChartState {
    width: number
    height: number
}

class Chart extends PureComponent<ChartProps, ChartState> {
    state: ChartState = {
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

    createPaths(): { path: string; line?: any } {
        throw new Error('Extending "Chart" requires you to override "createPaths"')
    }

    render() {
        const {
            data,
            xAccessor = ({ index }) => index,
            yAccessor = ({ item }) => item,
            yScale = scale.scaleLinear,
            xScale = scale.scaleLinear,
            style,
            animate,
            animationDuration,
            svg = {},
            curve = shape.curveLinear,
            contentInset = {},
            numberOfTicks = 10,
            gridMax,
            gridMin,
            clampX,
            clampY,
            children,
        } = this.props

        const { width, height } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const { top = 0, bottom = 0, left = 0, right = 0 } = contentInset

        const mappedData = data.map((item, index) => ({
            y: yAccessor({ item, index }),
            x: xAccessor({ item, index }),
        }))

        const yValues = mappedData.map((item) => item.y)
        const xValues = mappedData.map((item) => item.x)

        const yExtent = array.extent([...yValues, gridMin, gridMax])
        const xExtent = array.extent([...xValues])

        const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props

        const y = yScale()
            .domain([yMin, yMax])
            .range([height - bottom, top])
            .clamp(clampY)

        const x = xScale()
            .domain([xMin, xMax])
            .range([left, width - right])
            .clamp(clampX)

        const paths = this.createPaths({
            data: mappedData,
            x,
            y,
        })

        const ticks = y.ticks(numberOfTicks)

        const extraProps = {
            x,
            y,
            data,
            ticks,
            width,
            height,
            ...paths,
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
                            <Path
                                fill={'none'}
                                {...svg}
                                d={paths.path}
                                animate={animate}
                                animationDuration={animationDuration}
                            />
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

export default Chart

import React, { PureComponent } from 'react'
import { View, Platform, ViewStyle } from 'react-native'
import * as shape from 'd3-shape'
import Svg, { G, Path } from 'react-native-svg'

interface PieChartProps {
    data: Array<{
        key: string | number
        value: number
        svg?: object
        arc?: object
        onPress?: () => void
    }>
    innerRadius?: number | string
    outerRadius?: number | string
    labelRadius?: number | string
    padAngle?: number
    animate?: boolean
    animationDuration?: number
    style?: ViewStyle
    sort?: (a: any, b: any) => number
    valueAccessor?: (item: { item: any }) => number
    children?: React.ReactNode
    startAngle?: number
    endAngle?: number
}

interface PieChartState {
    height: number
    width: number
}

class PieChart extends PureComponent<PieChartProps, PieChartState> {
    state: PieChartState = {
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

    private _calculateRadius(arg: number | string | undefined, max: number, defaultVal: number): number {
        if (typeof arg === 'string') {
            return (parseInt(arg) / 100) * max
        } else if (arg) {
            return arg
        } else {
            return defaultVal
        }
    }

    render() {
        const {
            data,
            innerRadius = '50%',
            outerRadius = '100%',
            labelRadius,
            padAngle = 0.05,
            animate,
            animationDuration,
            style,
            sort = (a, b) => b.value - a.value,
            valueAccessor = ({ item }) => item.value,
            children,
            startAngle = 0,
            endAngle = Math.PI * 2,
        } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const maxRadius = Math.min(width, height) / 2

        if (Math.min(...data.map((obj) => valueAccessor({ item: obj }))) < 0) {
            console.error("don't pass negative numbers to pie-chart, it makes no sense!")
        }

        const _outerRadius = this._calculateRadius(outerRadius, maxRadius, maxRadius)
        const _innerRadius = this._calculateRadius(innerRadius, maxRadius, 0)
        const _labelRadius = this._calculateRadius(labelRadius, maxRadius, _outerRadius)

        if (_innerRadius >= _outerRadius) {
            console.warn('innerRadius is equal to or greater than outerRadius')
        }

        const arcs = data.map((item) => {
            const arc = shape.arc().outerRadius(_outerRadius).innerRadius(_innerRadius).padAngle(padAngle)

            if (item.arc) {
                Object.entries(item.arc).forEach(([key, value]) => {
                    if (typeof arc[key] === 'function') {
                        if (typeof value === 'string') {
                            arc[key]((parseInt(value) / 100) * _outerRadius)
                        } else {
                            arc[key](value)
                        }
                    }
                })
            }

            return arc
        })

        const labelArcs = data.map((item, index) => {
            if (labelRadius) {
                return shape.arc().outerRadius(_labelRadius).innerRadius(_labelRadius).padAngle(padAngle)
            }
            return arcs[index]
        })

        const pieSlices = shape
            .pie()
            .value((d) => valueAccessor({ item: d }))
            .sort(sort)
            .startAngle(startAngle)
            .endAngle(endAngle)(data)

        const slices = pieSlices.map((slice, index) => ({
            ...slice,
            pieCentroid: arcs[index].centroid(slice),
            labelCentroid: labelArcs[index].centroid(slice),
        }))

        const extraProps = {
            width,
            height,
            data,
            slices,
        }

        return (
            <View pointerEvents={'box-none'} style={style}>
                <View pointerEvents={'box-none'} style={{ flex: 1 }} onLayout={this._onLayout}>
                    {height > 0 && width > 0 && (
                        <Svg
                            pointerEvents={Platform.OS === 'android' ? 'box-none' : undefined}
                            style={{ height, width }}
                        >
                            <G x={width / 2} y={height / 2}>
                                {React.Children.map(children, (child) => {
                                    if (React.isValidElement(child) && child.props.belowChart) {
                                        return React.cloneElement(child, extraProps)
                                    }
                                    return null
                                })}
                                {pieSlices.map((slice, index) => {
                                    const { key, onPress, svg } = data[index]
                                    return (
                                        <Path
                                            key={key}
                                            onPress={onPress}
                                            {...svg}
                                            d={arcs[index](slice)}
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
                            </G>
                        </Svg>
                    )}
                </View>
            </View>
        )
    }
}

export default PieChart

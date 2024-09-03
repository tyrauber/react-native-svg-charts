import React, { PureComponent } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import * as d3Scale from 'd3-scale'
import * as array from 'd3-array'
import Svg, { G, Text as SVGText } from 'react-native-svg'

interface XAxisProps {
    data: Array<any>
    spacingInner?: number
    spacingOuter?: number
    formatLabel?: (value: any, index: number) => string
    contentInset?: {
        left?: number
        right?: number
    }
    scale?: Function
    numberOfTicks?: number
    xAccessor?: ({ item, index }: { item: any; index: number }) => any
    svg?: object
    min?: any
    max?: any
    style?: ViewStyle
    children?: React.ReactNode
}

interface XAxisState {
    width: number
    height: number
}

class XAxis extends PureComponent<XAxisProps, XAxisState> {
    state: XAxisState = {
        width: 0,
        height: 0,
    }

    private _onLayout = (event: any) => {
        const {
            nativeEvent: {
                layout: { width, height },
            },
        } = event

        if (width !== this.state.width) {
            this.setState({ width, height })
        }
    }

    private _getX(domain: any[]) {
        const {
            scale = d3Scale.scaleLinear,
            spacingInner = 0.05,
            spacingOuter = 0.05,
            contentInset: { left = 0, right = 0 } = {},
        } = this.props

        const { width } = this.state

        const x = scale()
            .domain(domain)
            .range([left, width - right])

        if (scale === d3Scale.scaleBand) {
            x.paddingInner([spacingInner]).paddingOuter([spacingOuter])

            //add half a bar to center label
            return (value: any) => x(value) + x.bandwidth() / 2
        }

        return x
    }

    render() {
        const {
            style,
            scale = d3Scale.scaleLinear,
            data,
            xAccessor = ({ index }) => index,
            formatLabel = (value) => value,
            numberOfTicks,
            svg = {},
            children,
            min,
            max,
        } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const values = data.map((item, index) => xAccessor({ item, index }))
        const extent = array.extent(values) as [number, number]
        const domain = scale === d3Scale.scaleBand ? values : [min || extent[0], max || extent[1]]

        const x = this._getX(domain)
        const ticks = numberOfTicks ? x.ticks(numberOfTicks) : values

        const extraProps = {
            x,
            ticks,
            width,
            height,
            formatLabel,
        }

        return (
            <View style={style}>
                <View style={{ flexGrow: 1 }} onLayout={this._onLayout}>
                    <Text
                        style={{
                            opacity: 0,
                            fontSize: svg.fontSize,
                            fontFamily: svg.fontFamily,
                            fontWeight: svg.fontWeight,
                        }}
                    >
                        {formatLabel(ticks[0], 0)}
                    </Text>
                    {height > 0 && width > 0 && (
                        <Svg
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height,
                                width,
                            }}
                        >
                            <G>
                                {React.Children.map(children, (child) => {
                                    if (React.isValidElement(child)) {
                                        return React.cloneElement(child, extraProps)
                                    }
                                    return null
                                })}
                                {width > 0 &&
                                    ticks.map((value, index) => {
                                        const { svg: valueSvg = {} } = data[index] || {}

                                        return (
                                            <SVGText
                                                textAnchor={'middle'}
                                                originX={x(value)}
                                                alignmentBaseline={'hanging'}
                                                {...svg}
                                                {...valueSvg}
                                                key={index}
                                                x={x(value)}
                                            >
                                                {formatLabel(value, index)}
                                            </SVGText>
                                        )
                                    })}
                            </G>
                        </Svg>
                    )}
                </View>
            </View>
        )
    }
}

export default XAxis

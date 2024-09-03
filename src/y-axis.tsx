import React, { PureComponent } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { Svg, G, Text as SVGText } from 'react-native-svg'
import * as d3Scale from 'd3-scale'
import * as array from 'd3-array'

interface YAxisProps {
    data: Array<object | number>
    svg?: object
    style?: ViewStyle
    numberOfTicks?: number
    formatLabel?: (value: number, index: number, ticks: number[]) => string
    contentInset?: {
        top?: number
        bottom?: number
    }
    min?: number
    max?: number
    yAccessor?: ({ item, index }: { item: any; index: number }) => number
    scale?: Function
    spacingInner?: number
    spacingOuter?: number
}

interface YAxisState {
    height: number
    width: number
}

class YAxis extends PureComponent<YAxisProps, YAxisState> {
    state: YAxisState = {
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

    private getY(domain: number[]) {
        const {
            scale = d3Scale.scaleLinear,
            spacingInner = 0.05,
            spacingOuter = 0.05,
            contentInset: { top = 0, bottom = 0 } = {},
        } = this.props

        const { height } = this.state

        const y = scale()
            .domain(domain)
            .range([height - bottom, top])

        if (scale === d3Scale.scaleBand) {
            // use index as domain identifier instead of value since
            // same value can occur at several places in dataPoints
            y
                // set range top to bottom - we are not sorting on values in scaleBand
                .range([top, height - bottom])
                .paddingInner([spacingInner])
                .paddingOuter([spacingOuter])

            //add half a bar to center label
            return (value: number) => y(value) + y.bandwidth() / 2
        }

        return y
    }

    render() {
        const {
            style,
            data,
            scale = d3Scale.scaleLinear,
            yAccessor = ({ item }) => item,
            numberOfTicks = 10,
            formatLabel = (value) => value && value.toString(),
            svg = {},
            children,
        } = this.props

        const { height, width } = this.state

        if (data.length === 0) {
            return <View style={style} />
        }

        const values = data.map((item, index) => yAccessor({ item, index }))

        const extent = array.extent(values) as [number, number]

        const { min = extent[0], max = extent[1] } = this.props

        const domain = scale === d3Scale.scaleBand ? values : [min, max]

        //invert range to support svg coordinate system
        const y = this.getY(domain)

        const ticks = scale === d3Scale.scaleBand ? values : y.ticks(numberOfTicks)

        const longestValue = ticks
            .map((value, index) => formatLabel(value, index, ticks))
            .reduce((prev, curr) => (prev.toString().length > curr.toString().length ? prev : curr), 0)

        const extraProps = {
            y,
            ticks,
            width,
            height,
            formatLabel,
        }

        return (
            <View style={[style]}>
                <View style={{ flexGrow: 1 }} onLayout={this._onLayout}>
                    {/*invisible text to allow for parent resizing*/}
                    <Text
                        style={{
                            opacity: 0,
                            fontSize: svg.fontSize,
                            fontFamily: svg.fontFamily,
                            fontWeight: svg.fontWeight,
                        }}
                    >
                        {longestValue}
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
                                    return React.cloneElement(child as React.ReactElement, extraProps)
                                })}
                                {// don't render labels if width isn't measured yet,
                                // causes rendering issues
                                height > 0 &&
                                    ticks.map((value, index) => {
                                        return (
                                            <SVGText
                                                originY={y(value)}
                                                textAnchor={'middle'}
                                                x={'50%'}
                                                alignmentBaseline={'middle'}
                                                {...svg}
                                                key={y(value)}
                                                y={y(value)}
                                            >
                                                {formatLabel(value, index, ticks)}
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

export default YAxis

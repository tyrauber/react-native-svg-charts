import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import Svg from 'react-native-svg'
import * as array from 'd3-array'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import Path from '../animated-path'

interface StackedBarGroupedProps {
    data: Array<{
        data: Array<{ [key: string]: number | { svg?: object } }>
        svg?: object
    }>
    keys: Array<Array<string>>
    colors: Array<Array<string>>
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
    borderRadius?: number
    innerBarSpace?: number
    horizontal?: boolean
    numberOfTicks?: number
    children?: React.ReactNode
}

interface StackedBarGroupedState {
    width: number
    height: number
}

class StackedBarGrouped extends PureComponent<StackedBarGroupedProps, StackedBarGroupedState> {
    state: StackedBarGroupedState = {
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

    private calcXScale(domain: any[]) {
        const {
            horizontal,
            contentInset: { left = 0, right = 0 } = {},
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

    private calcYScale(domain: any[]) {
        const {
            horizontal,
            contentInset: { top = 0, bottom = 0 } = {},
            spacingInner = 0.05,
            spacingOuter = 0.05,
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

    private calcAreas(x: any, y: any, series: any[]) {
        const { horizontal, colors, keys, data, borderRadius: initialBorderRadius = 0, innerBarSpace = 0 } = this.props

        let areas
        let barWidth

        if (horizontal) {
            barWidth = y.bandwidth() / data.length

            areas = series.map((stack, stackIndex) => {
                return stack.map((serie, keyIndex) => {
                    return serie.map((entry, entryIndex) => {
                        const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0

                        const path = shape
                            .area()
                            .x0((d: any) => x(d[0]))
                            .x1((d: any) => x(d[1]))
                            .y(
                                (d: any, _index: number) =>
                                    (_index === 0
                                        ? y(entryIndex) + barWidth * stackIndex + leftMargin
                                        : y(entryIndex) + barWidth + barWidth * stackIndex) - leftMargin
                            )
                            .defined((d: any) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry])

                        return {
                            path,
                            color: colors[stackIndex][keyIndex],
                            key: keys[stackIndex][keyIndex],
                        }
                    })
                })
            })
        } else {
            barWidth = x.bandwidth() / data.length

            areas = series.map((stack, stackIndex) => {
                return stack.map((serie, keyIndex) => {
                    return serie.map((entry, entryIndex) => {
                        const leftMargin = series.length > 1 ? innerBarSpace / 2 : 0
                        const x0 = x(entryIndex) + barWidth * stackIndex + leftMargin
                        const x1 = x(entryIndex) + barWidth + barWidth * stackIndex - leftMargin
                        const y0 = y(entry[1])
                        const y1 = y(entry[0])
                        const barHeight = y1 - y0
                        const borderRadius = initialBorderRadius * 2 > barHeight ? barHeight / 2 : initialBorderRadius
                        const showTopBorder = keyIndex === stack.length - 1
                        const showBottomBorder = keyIndex === 0
                        const commands = this.coordinatesToPathCommands(
                            x0,
                            y0,
                            x1,
                            y1,
                            borderRadius,
                            showTopBorder,
                            showBottomBorder
                        )

                        return {
                            path: this.commandsToSvgPath(commands),
                            color: colors[stackIndex][keyIndex],
                            key: keys[stackIndex][keyIndex],
                        }
                    })
                })
            })
        }

        return array.merge(areas)
    }

    private coordinatesToPathCommands = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        borderRadius: number,
        showTopBorder: boolean,
        showBottomBorder: boolean
    ) => {
        const commands = []
        commands.push({ marker: 'M', values: [x0, y0] })

        if (showTopBorder) {
            const topLeft1 = [x0 + borderRadius, y0]
            const topLeft2 = [x0, y0 + borderRadius]
            commands.push({ marker: 'L', values: topLeft1 })
            commands.push({
                marker: 'C',
                values: [...topLeft1, x0, y0, ...topLeft2],
            })
            commands.push({ marker: 'L', values: topLeft2 })
        } else {
            commands.push({ marker: 'L', values: [x0, y0] })
        }

        if (showBottomBorder) {
            const bottomLeft1 = [x0, y1 - borderRadius]
            const bottomLeft2 = [x0 + borderRadius, y1]
            commands.push({ marker: 'L', values: bottomLeft1 })
            commands.push({
                marker: 'C',
                values: [...bottomLeft1, x0, y1, ...bottomLeft2],
            })
            commands.push({ marker: 'L', values: bottomLeft2 })
            const bottomRight1 = [x1 - borderRadius, y1]
            const bottomRight2 = [x1, y1 - borderRadius]
            commands.push({ marker: 'L', values: bottomRight1 })
            commands.push({
                marker: 'C',
                values: [...bottomRight1, x1, y1, ...bottomRight2],
            })
            commands.push({ marker: 'L', values: bottomRight2 })
        } else {
            commands.push({ marker: 'L', values: [x0, y1] })
            commands.push({ marker: 'L', values: [x1, y1] })
        }

        if (showTopBorder) {
            const topRight1 = [x1, y0 + borderRadius]
            const topRight2 = [x1 - borderRadius, y0]

            commands.push({ marker: 'L', values: topRight1 })
            commands.push({
                marker: 'C',
                values: [...topRight1, x1, y0, ...topRight2],
            })
            commands.push({ marker: 'L', values: topRight2 })
        } else {
            commands.push({ marker: 'L', values: [x1, y0] })
        }

        commands.push({ marker: 'Z', values: [] })

        return commands
    }

    private commandsToSvgPath = (commands: Array<{ marker: string; values: number[] }>) =>
        commands
            .map((command) => `${command.marker} ${command.values.join(',')}`)
            .join(' ')
            .trim()

    private calcExtent(values: number[][]) {
        const { gridMax, gridMin } = this.props

        // One more merge for stacked groups
        const mergedValues = array.merge(values)

        return array.extent([...mergedValues, gridMin, gridMax])
    }

    private calcIndexes() {
        const { data } = this.props

        // Must return an array with indexes for the number of groups to be shown
        return data[0].data.map((_, index) => index)
    }

    private getSeries() {
        const {
            data,
            keys,
            offset = shape.stackOffsetNone,
            order = shape.stackOrderNone,
            valueAccessor = ({ item, key }) => item[key],
        } = this.props

        return data.map((obj, index) =>
            shape
                .stack()
                .keys(keys[index])
                .value((item, key) => valueAccessor({ item, key }))
                .order(order)
                .offset(offset)(obj.data)
        )
    }

    render() {
        const { data, animate, animationDuration, style, numberOfTicks = 10, children, horizontal } = this.props

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

        const stacks = this.calcAreas(x, y, series)

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
                            {stacks.map((areas, indexStack) => {
                                const areaIndex = indexStack % data.length

                                return areas.map((bar, indexArea) => {
                                    const keyIndex = indexArea % data[areaIndex].data.length
                                    const key = `${areaIndex}-${keyIndex}-${bar.key}`

                                    const { svg } = data[areaIndex].data[keyIndex][bar.key] as { svg?: object }

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
                                })
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

export default StackedBarGrouped

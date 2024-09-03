import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import * as shape from 'd3-shape'
import Path from './animated-path'
import Svg, { G } from 'react-native-svg'

interface ProgressCircleProps {
    progress: number
    style?: ViewStyle
    progressColor?: string
    backgroundColor?: string
    strokeWidth?: number
    startAngle?: number
    endAngle?: number
    animate?: boolean
    animateDuration?: number
    cornerRadius?: number
    children?: React.ReactNode
}

interface ProgressCircleState {
    height: number
    width: number
}

class ProgressCircle extends PureComponent<ProgressCircleProps, ProgressCircleState> {
    state: ProgressCircleState = {
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
            style,
            progressColor,
            backgroundColor,
            strokeWidth,
            startAngle,
            endAngle,
            animate,
            animateDuration,
            children,
            cornerRadius,
        } = this.props

        let { progress } = this.props

        const { height, width } = this.state

        const outerDiameter = Math.min(width, height)

        if (!isFinite(progress) || isNaN(progress)) {
            progress = 0
        }

        const data = [
            {
                key: 'rest',
                value: 1 - progress,
                color: backgroundColor,
            },
            {
                key: 'progress',
                value: progress,
                color: progressColor,
            },
        ]

        const pieSlices = shape
            .pie()
            .value((d) => d.value)
            .sort((a) => (a.key === 'rest' ? 1 : -1))
            .startAngle(startAngle!)
            .endAngle(endAngle!)(data)

        const arcs = pieSlices.map((slice, index) => ({
            ...data[index],
            ...slice,
            path: shape
                .arc()
                .outerRadius(outerDiameter / 2)
                .innerRadius(outerDiameter / 2 - strokeWidth!)
                .startAngle(index === 0 ? startAngle! : slice.startAngle)
                .endAngle(index === 0 ? endAngle! : slice.endAngle)
                .cornerRadius(cornerRadius!)(),
        }))

        const extraProps = {
            width,
            height,
        }

        return (
            <View style={style} onLayout={this._onLayout}>
                {height > 0 && width > 0 && (
                    <Svg style={{ height, width }}>
                        <G x={width / 2} y={height / 2}>
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child) && child.props.belowChart) {
                                    return React.cloneElement(child, extraProps)
                                }
                                return null
                            })}
                            {arcs.map((shape, index) => (
                                <Path
                                    key={index}
                                    fill={shape.color}
                                    d={shape.path}
                                    animate={animate}
                                    animationDuration={animateDuration}
                                />
                            ))}
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
        )
    }
}

export default ProgressCircle

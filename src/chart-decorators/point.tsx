import React from 'react'
import { Circle } from 'react-native-svg'

interface PointProps {
    x: (index: number) => number
    y: (value: number) => number
    value: number
    index: number
    radius?: number
    color?: string
}

const Point: React.FC<PointProps> = ({ x, y, value, index, radius = 4, color = 'black' }) => {
    if (isNaN(value)) {
        return <Circle />
    }

    return <Circle cx={x(index)} cy={y(value)} r={radius} stroke={color} fill={'white'} />
}

export default Point

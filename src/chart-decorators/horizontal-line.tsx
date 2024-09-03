import React from 'react'
import { Line } from 'react-native-svg'

interface HorizontalLineProps {
    y: (value: number) => number
    value: number
    stroke?: string
    [key: string]: any
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({ y, value, stroke = 'black', ...other }) => {
    return <Line x1={'0%'} x2={'100%'} y1={y(value)} y2={y(value)} stroke={stroke} {...other} />
}

export default HorizontalLine

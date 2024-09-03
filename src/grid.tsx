import React from 'react'
import { G, Line } from 'react-native-svg'

interface GridProps {
    ticks?: number[]
    x?: (value: number) => number
    y?: (value: number) => number
    svg?: React.SVGProps<SVGLineElement>
    direction?: 'VERTICAL' | 'HORIZONTAL' | 'BOTH'
    belowChart?: boolean
}

const Horizontal: React.FC<GridProps> = ({ ticks = [], y = (v) => v, svg = {} }) => {
    return (
        <G>
            {ticks.map((tick) => (
                <Line
                    key={tick}
                    x1={'0%'}
                    x2={'100%'}
                    y1={y(tick)}
                    y2={y(tick)}
                    strokeWidth={1}
                    stroke={'rgba(0,0,0,0.2)'}
                    {...svg}
                />
            ))}
        </G>
    )
}

const Vertical: React.FC<GridProps> = ({ ticks = [], x = (v) => v, svg = {} }) => {
    return (
        <G>
            {ticks.map((tick, index) => (
                <Line
                    key={index}
                    y1={'0%'}
                    y2={'100%'}
                    x1={x(tick)}
                    x2={x(tick)}
                    strokeWidth={1}
                    stroke={'rgba(0,0,0,0.2)'}
                    {...svg}
                />
            ))}
        </G>
    )
}

const Both: React.FC<GridProps> = (props) => {
    return (
        <G>
            <Horizontal {...props} />
            <Vertical {...props} />
        </G>
    )
}

const Direction = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL',
    BOTH: 'BOTH',
} as const

type DirectionType = (typeof Direction)[keyof typeof Direction]

const Grid: React.FC<GridProps> = ({ direction = Direction.HORIZONTAL, ...props }) => {
    switch (direction) {
        case Direction.VERTICAL:
            return <Vertical {...props} />
        case Direction.HORIZONTAL:
            return <Horizontal {...props} />
        case Direction.BOTH:
            return <Both {...props} />
        default:
            return null
    }
}

Grid.Direction = Direction

export default Grid

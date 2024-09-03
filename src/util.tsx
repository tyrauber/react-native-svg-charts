import { ViewStyle } from 'react-native'

const util = {
    sortDescending<T>(_array: T[]): T[] {
        const array = [..._array]
        return array.sort((a, b) => {
            if (a > b) {
                return -1
            }
            if (b > a) {
                return 1
            }
            return 0
        })
    },
}

export const Constants = {
    gridStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.2)',
    } as ViewStyle,
    commonProps: {
        svg: {} as object,
        shadowSvg: {} as object,
        shadowWidth: 0 as number,
        shadowOffset: 0 as number,
        style: {} as ViewStyle,
        animate: false as boolean,
        animationDuration: 0 as number,
        curve: (() => {}) as Function,
        contentInset: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        numberOfTicks: 0 as number,
        renderGradient: (() => {}) as Function,
        gridMin: 0 as number,
        gridMax: 0 as number,
        showGrid: false as boolean,
        gridProps: {} as object,
    },
    commonDefaultProps: {
        strokeColor: '#22B6B0',
        strokeWidth: 2,
        contentInset: {},
        numberOfTicks: 10,
        showGrid: true,
        gridMin: 0,
        gridMax: 0,
        gridStroke: 'rgba(0,0,0,0.2)',
        gridWidth: 0.5,
    },
}

export default util

import React, { Component } from 'react'
import { InteractionManager } from 'react-native'
import { Path, PathProps } from 'react-native-svg'
import * as interpolate from 'd3-interpolate-path'

interface AnimatedPathProps extends PathProps {
    animate?: boolean
    animationDuration?: number
    renderPlaceholder?: () => React.ReactNode
}

interface AnimatedPathState {
    d: string
}

class AnimatedPath extends Component<AnimatedPathProps, AnimatedPathState> {
    private newD: string
    private interpolator: (t: number) => string
    private animation: number
    private handle: number | null
    private component: Path | null

    constructor(props: AnimatedPathProps) {
        super(props)
        this.state = { d: props.d || '' }
        this.newD = ''
        this.interpolator = () => ''
        this.animation = 0
        this.handle = null
        this.component = null
    }

    componentDidUpdate(prevProps: AnimatedPathProps) {
        const { d: newD, animate } = this.props
        const { d: oldD } = prevProps

        if (newD === oldD || !animate || newD === null || oldD === null) {
            return
        }

        this.newD = newD
        this.interpolator = interpolate.interpolatePath(oldD, newD)
        this._animate()
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.animation)
        this._clearInteraction()
    }

    _animate = (start?: number) => {
        cancelAnimationFrame(this.animation)
        this.animation = requestAnimationFrame((timestamp) => {
            if (!start) {
                this._clearInteraction()
                this.handle = InteractionManager.createInteractionHandle()
                start = timestamp
            }

            const delta = (timestamp - start) / (this.props.animationDuration || 300)

            if (delta > 1) {
                this.component?.setNativeProps({ d: this.newD })
                this._clearInteraction()
                return
            }

            const d = this.interpolator(delta)
            this.component?.setNativeProps({ d })

            this.setState(this.state, () => {
                this._animate(start)
            })
        })
    }

    _clearInteraction = () => {
        if (this.handle) {
            InteractionManager.clearInteractionHandle(this.handle)
            this.handle = null
        }
    }

    render() {
        const { animate, d, ...rest } = this.props
        return (
            <Path
                ref={(ref) => (this.component = ref)}
                {...rest}
                d={animate ? this.state.d : d}
            />
        )
    }
}

export default AnimatedPath

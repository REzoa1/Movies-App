import { Result } from 'antd'
import React, { Component, ReactNode } from 'react'
import './NoNetwork.scss'

type Props = {
  children: ReactNode
}

type State = {
  isOnline: boolean
}

class NoNetwork extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isOnline: true,
    }
  }

  componentDidMount() {
    window.addEventListener('online', this.setOnline)
    window.addEventListener('offline', this.setOffline)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOnline)
    window.removeEventListener('offline', this.setOffline)
  }

  setOnline = () => {
    this.setState({ isOnline: true })
  }

  setOffline = () => {
    this.setState({ isOnline: false })
  }

  render() {
    const { isOnline } = this.state
    const { children } = this.props

    return isOnline ? (
      children
    ) : (
      <Result className="no-network" status="warning" title="No Internet Connection. Please try again later." />
    )
  }
}

export default NoNetwork

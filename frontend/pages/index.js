
import { Component } from 'react'
import io from 'socket.io-client'

class Index extends Component {
  state = {
    message: ''
  }
  componentDidMount() {
    this.socket = io('localhost:3001/spotify')
    this.socket.on('connection', console.log('connection established'))
    this.socket.on('message', (msg) => {
      this.setState({
      message: msg
    })
    console.log(msg)
  })
}
  render() {
    return (
      <div>
        <h1>chaosprinz's mediabox</h1>
        <p>{this.state.message}</p>
      </div>
    )
  }
}
 export default Index

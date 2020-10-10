import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

/* class Square extends React.Component {
  render () {
    return (
      <button
        className="square"
        onClick={() => this.props.onLuozi()}>
        {this.props.value}
      </button>
    )
  }
}
 */

// 网格-函数式组件-只有render&&无state
function Square (props) {
  return (
    <button
      className="square"
      onClick={props.onLuozi}>
      {props.value}
    </button>
  )
}


/* class Board extends React.Component {
  renderSquare (i) {
    return <Square
      value={this.props.squares[i]}
      onLuozi={() => this.props.onLuozi(i)}
    />
  }
  render () {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}
 */

// 棋盘-由网格组成-Props由棋盘传递给网格
function Board (props) {
  let lines = []
  for (let i = 0; i < 9; i += 3) {
    let line = []
    for (let j = 0; j < 3; j++) {
      line.push(
        <Square
          key={'block-' + (i + j)}
          value={props.squares[i + j]}
          onLuozi={() => props.onLuozi(i + j)}
        />
      )
    }
    line = (<div key={'line-' + (i + 1)} className="board-row">{line}</div>)
    lines.push(line)
  }
  return (
    <div>{lines}</div>
  )
}

// 游戏-全局对象-管理全局state&&处理全局事件-将state通过prop传递给棋盘
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [Array(9).fill(null)], //落子记录
      head: 0, //当前棋盘索引
      first: 'X', //先手玩家
      now: 'X' //当前落子玩家
    }
  }

  // 处理落子事件
  handleLuoZi (i) {
    // 舍弃可能存在的被覆盖落子记录
    let history = this.state.history.slice(0, this.state.head + 1)
    let squares = history[history.length - 1].slice()

    if (this.judge(squares)) {
      // 已结束重新开局-清空落子记录&&重置棋盘索引&&切换先手
      this.setState({
        history: [Array(9).fill(null)],
        head: 0,
        first: this.state.first === 'X' ? 'O' : 'X',
        now: this.state.first === 'X' ? 'O' : 'X',
      })
    } else {
      // 所点网格为空则落子
      if (!squares[i]) {
        squares[i] = this.state.now
        history.push(squares)
        this.setState({
          ...this.state,
          history,
          head: this.state.head + 1,
          now: this.state.now === 'X' ? 'O' : 'X'
        })
      }
    }
  }

  // 判胜
  judge (squares) {
    const winResult = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let r = 0; r < winResult.length; r++) {
      const [i, j, k] = winResult[r]
      if (squares[i] && squares[i] === squares[j] && squares[j] === squares[k])
        return squares[i]
    }

    for (let q = 0; q < squares.length; q++) {
      if (!squares[q]) return false
    }
    return 'drawn game'
  }

  // 跳转历史落子记录
  goTo (index) {
    this.setState({
      ...this.state,
      head: index
    })
  }

  // 获取落子记录-返回React元素数组
  getHistoryElement (history) {
    // Array.prototype.map(squares,index) 使用展开运算符+解构赋值避免引入多余参数(squares)
    return history.map((...[, index]) => {
      const tip = index === 0 ? 'Go to start' : 'Go to #' + index
      return (
        <li key={'step' + index}>
          <button onClick={() => this.goTo(index)}>{tip}</button>
        </li>
      )
    })
  }

  render () {
    const history = this.state.history.slice(0, this.state.head + 1)
    const squares = history[history.length - 1]
    const winner = this.judge(squares)
    let status
    if (winner) {
      if (winner.length === 1) status = 'Winner: ' + winner
      else status = winner
    }
    else status = 'Next player: ' + this.state.now

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onLuozi={(i) => this.handleLuoZi(i)}
          />
        </div>
        <div className="game-info">
          <div>First player: {this.state.first} | {status}</div>
          <ol>{this.getHistoryElement(this.state.history)}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
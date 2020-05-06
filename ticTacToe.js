function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button> 
  );
}

class Board extends React.Component {  
  renderSquare(i, win) {
    if (win){
      return(
      <Square 
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
         key={i}
         style={{backgroundColor: "lightgreen"}}
       />);
    } else {
      return(
      <Square 
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
         key={i}
         style={{backgroundColor: "white"}}
       />);
    } 
  }

  render() {
    const board = [];
    for (let i = 0; i <= 6; i+=3) {
      const children = [];
      for (let j = 0; j <= 2; j++) {
        if (this.props.winners) {
          if (this.props.winners.includes(i+j)){
            children.push(this.renderSquare(i+j, true));
          } else {
          children.push(this.renderSquare(i+j, false));
          }
        }
        else{
          children.push(this.renderSquare(i+j, false));
        }     
      }
      const row = (<div key={i/3} className="board-row"> {children} </div>);
      board.push(row);
    }
    return (<div> {board} </div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      reverse: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
  reverseList() {
    this.setState({
      reverse: !this.state.reverse,
    });
  }
  
  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    console.log(stepNumber);
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    const rev = this.state.reverse;
    
    let moves = history.map((step, move) => {
      const desc = move != 0 ? 
            'Go to move #' + move :
            'Go to game start';
      const loc = step.col ? 'At: Col:' + step.col + ', Row:' + step.row : '';
      return (
        <li key={move}>
          <button 
            style={ stepNumber == move  ? {fontWeight: 'bold'} : {fontWeight: 'normal'}} 
            onClick={() => this.jumpTo(move)}
           >
              {desc}
          </button>
          {loc}
        </li>
      );
    });
    moves = rev ? moves.reverse() : moves;
    
    let status, winSquares;
    if (winner) {
      status = 'Winner: ' + Object.keys(winner)[0];
      winSquares = Object.values(winner)[0]; 
    } else if (stepNumber == 9) {
      status = 'Draw';
      winSquares = null;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      winSquares = null;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winners = {winSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{moves}</ul>
        </div>
        <button className="toggle" onClick={() => this.reverseList()}>
          Reverse List
        </button>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner = {};
      winner[squares[a]] = lines[i];
      return winner;
    }
  }
  return null;
}

import React, { Component } from "react";
import BallClass from "./BallClass";

const getNumbers = () => {
  console.log("getWinNumbers");
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);

  const shuffle = [];

  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
  }

  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
  return [...winNumbers, bonusNumber];
};

class LottoClass extends Component {
  state = {
    winNumbers: getNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  };

  timeouts = [];

  runTimeouts = () => {
    console.log("runTimeouts");
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]],
          };
        });
      }, (i + 1) * 1000);
    }

    this.timeouts[6] = setTimeout(() => {
      this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  };

  componentDidMount() {
    console.log("didMount");
    this.runTimeouts();
    console.log("로또 숫자를 생성합니다.");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("didUpdate");
    if (this.state.winBalls.length === 0) {
      this.runTimeouts();
    }
    if (prevState.winNumbers !== this.state.winNumbers) {
      console.log("로또 숫자를 생성합니다.");
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  onClickRedo = () => {
    console.log("onClickRedo");
    this.setState({
      winNumbers: getNumbers(), // 당첨 숫자들
      winBalls: [],
      bonus: null, // 보너스 공
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <main>
        <h1>당첨 숫자</h1>
        <div id="result">
          {winBalls.map((ball) => (
            <BallClass key={ball} number={ball} />
          ))}
        </div>
        <h2>보너스 숫자</h2>
        {bonus && (
          <div id="bonus">
            <BallClass number={bonus} />
          </div>
        )}
        {redo && <button onClick={this.onClickRedo}>다시 뽑기!</button>}
      </main>
    );
  }
}

export default LottoClass;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import words from './words.json'
//import App from './App';

const ROW_COUNT = 6;
const LETTER_COUNT = 5;




class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRow: 0,
			currentSquare: 0,
			letters: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill(' '))
		}
	}

	handleKeyPress(i) {
		const letters = this.state.letters.slice();
		var currentRow = this.state.currentRow;
		var currentSquare = this.state.currentSquare;

		if (i === 'backspace') {
			if (this.state.currentSquare > 0) {
				letters[this.state.currentRow][this.state.currentSquare - 1] = ' ';
			}

			currentSquare = Math.max(this.state.currentSquare - 1, 0);
		}
		else if (i === 'enter') {
			if (currentSquare === LETTER_COUNT && letters[this.state.currentRow][this.state.currentSquare] !== ' ') {
				let word = '';
				letters[this.state.currentRow].forEach(element => {
					word += element
				});

				if (this.checkWord(word)) {
					currentRow = Math.min(currentRow + 1, ROW_COUNT);
				}
			}
		}
		else {
			if (this.state.currentRow < ROW_COUNT && this.state.currentSquare < LETTER_COUNT && letters[this.state.currentRow][this.state.currentSquare] === ' ') {
				letters[this.state.currentRow][this.state.currentSquare] = i;
			}

			currentSquare = Math.min(this.state.currentSquare + 1, LETTER_COUNT);
		}

		this.setState({
			currentRow: currentRow,
			currentSquare: currentSquare,
			letters: letters
		});
	}

	checkWord(word) {
		for (let index = 0; index < words.length; index++) {
			if (word.toLowerCase() === words[index]) {
				console.log('found word!');

				return true;
			}
		}

		console.log('no such word');
		return false;
	}

	render() {
		return (
			<div className='game'>
				<div className='letter-board'>
					<Board 
						writeRow={this.state.writeRow}
						writeSquare={this.state.writeSquare}
						writeKey={this.state.writeKey}
						letters={this.state.letters}
					/>
				</div>
				<div className='keyboard-container'>
					<Keyboard 
						onClick={(i) => this.handleKeyPress(i)}
					/>
				</div>
			</div>
		);
	}
}

class Board extends React.Component {
	renderRow(row) {
		
		return (
			<div className='letter-row'>
				{this.renderSquare(row, 0)}
				{this.renderSquare(row, 1)}
				{this.renderSquare(row, 2)}
				{this.renderSquare(row, 3)}
				{this.renderSquare(row, 4)}
			</div>
		);
	}

	renderSquare(row, i) {
		return (
			<Square 
				letter={this.props.letters[row][i]}
			/>
		);
	}

	render() {
		return(
			<div>
				{this.renderRow(0)}
				{this.renderRow(1)}
				{this.renderRow(2)}
				{this.renderRow(3)}
				{this.renderRow(4)}
				{this.renderRow(5)}
			</div>
		);
	}
}

function Square(props) {
	return (
		<button className='square'>
			{props.letter}
		</button>
	);
}

class Keyboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keysTop: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
			keysMid: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
			keysBot: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
		}
	}

	render() {
		return(
			<div className='keyboard'> 
				<div className='keyboard-row'>
					{this.state.keysTop.map(key => <KeyboardButton key={key} letter={key} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
					<KeyboardButton key='backspace' letter='<-' onClick={i => this.props.onClick('backspace')}></KeyboardButton>
				</div>
				<div className='keyboard-row'>
					{this.state.keysMid.map(key => <KeyboardButton key={key} letter={key} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
					<KeyboardButton key='enter' letter='ENTER' onClick={i => this.props.onClick('enter')}></KeyboardButton>
				</div>
				<div className='keyboard-row'>
					{this.state.keysBot.map(key => <KeyboardButton key={key} letter={key} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
				</div>
			</div>
		);
	}
}

function KeyboardButton(props) {
	return (
		<button className='keyboard-button' onClick={props.onClick}>
			{props.letter}
		</button>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>,
	document.getElementById('root')
);
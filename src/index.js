import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import words from './words.json';

const ROW_COUNT = 6;
const LETTER_COUNT = 5;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRow: 0,
			currentSquare: 0,
			letters: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill(' ')),
			letterStatus: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill('unguessed')),
			keyWord: this.getKeyWord()
		}
	}

	getKeyWord() {
		let rnd = Math.floor(Math.random() * words.length);
		//return words[rnd];
		return 'koira';
	}

	handleKeyPress(i) {
		const letters = this.state.letters.slice();
		var currentRow = this.state.currentRow;
		var currentSquare = this.state.currentSquare;
		const letterStatus = this.state.letterStatus.slice();

		if (i === 'backspace') {
			if (this.state.currentSquare > 0) {
				letters[this.state.currentRow][this.state.currentSquare - 1] = ' ';
			}

			currentSquare = Math.max(this.state.currentSquare - 1, 0);
		}
		else if (i === 'enter') {
			if (currentSquare === LETTER_COUNT && letters[this.state.currentRow][this.state.currentSquare] !== ' ') {
				let word = '';
				letters[currentRow].forEach(element => {
					word += element
				});

				if (this.checkWord(word)) {
					for (let index = 0; index < letters[currentRow].length; index++) {
						letterStatus[currentRow][index] = this.checkLetter(letters[currentRow][index], index);
					}

					currentRow = Math.min(currentRow + 1, ROW_COUNT);
					currentSquare = 0;
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
			letters: letters,
			letterStatus: letterStatus,
			keyWord: this.state.keyWord
		});
	}

	checkWord(word) {
		for (let index = 0; index < words.length; index++) {
			if (word.toLowerCase() === words[index]) {
				return true;
			}
		}

		return false;
	}

	checkLetter(letter, pos) {
		let status = 'none';

		if (this.state.keyWord.includes(letter.toLowerCase())) {
			status = 'includes';

			if (this.state.keyWord[pos] === letter.toLowerCase()) {
				status = 'right';
			}
		}

		console.log(letter +" is " +status);

		return status;
	}

	render() {
		return (
			<div className='game'>
				<div className='letter-board-container'>
					<Board
						letters={this.state.letters}
						letterstatus={this.state.letterStatus}
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
				letterstatus={this.props.letterstatus[row][i]}
			/>
		);
	}

	render() {
		return(
			<div className='letter-board'>
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
		<button className='square' letterstatus={props.letterstatus}>
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
					<KeyboardButton key='backspace' letter='backspace' onClick={i => this.props.onClick('backspace')}></KeyboardButton>
				</div>
				<div className='keyboard-row'>
					{this.state.keysMid.map(key => <KeyboardButton key={key} letter={key} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
					<KeyboardButton key='enter' letter='enter' onClick={i => this.props.onClick('enter')}></KeyboardButton>
				</div>
				<div className='keyboard-row'>
					{this.state.keysBot.map(key => <KeyboardButton key={key} letter={key} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
				</div>
			</div>
		);
	}
}

function KeyboardButton(props) {
	if (props.letter === 'backspace') {
		return (
			<button className='keyboard-button-backspace' onClick={props.onClick}>
			</button>
		);
	}
	else if (props.letter === 'enter') {
		return (
			<button className='keyboard-button-enter' onClick={props.onClick}>
			</button>
		);
	}
	else {
		return (
			<button className='keyboard-button' onClick={props.onClick}>
				{props.letter}
			</button>
		);
	}
}

ReactDOM.render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>,
	document.getElementById('root')
);
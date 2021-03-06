import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import words from './words.json';
import useWindowDimensions from './windowDimensions';

const ROW_COUNT = 6;
const LETTER_COUNT = 5;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRow: 0,
			currentSquare: 0,
			letters: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill(' ')),
			squareStatus: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill('unguessed')),
			keyWord: this.getKeyWord(),
			animating: Array(LETTER_COUNT).fill(false),
			animationStart: Array(ROW_COUNT).fill(0).map(row => new Array(LETTER_COUNT).fill(false)),
			wrongGuess: false,
			letterStatus: { }
		}
	}

	getKeyWord() {
		let rnd = Math.floor(Math.random() * words.length);
		return words[rnd];
	}

	handleKeyPress(i) {
		if (this.state.animating.every(Boolean)) return;

		const letters = this.state.letters.slice();
		var currentRow = this.state.currentRow;
		var currentSquare = this.state.currentSquare;
		const squareStatus = this.state.squareStatus.slice();
		let animating = this.state.animating.slice();
		let animationStart = this.state.animationStart.slice();
		let wrongGuess = false;
		let letterStatus = Object.assign({}, this.state.letterStatus);

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

				// Sana löytyy sanalistasta, joten tarkistetaan kirjaimet
				if (this.checkWord(word)) {
					squareStatus[currentRow] = this.checkGuess(letters[currentRow]);

					console.log(letterStatus);

					for (let i = 0; i < letters[currentRow].length; i++) {
						// Jos on löydytetty oikean paikan kirjain, niin aina näppäimistössä vihreänä
						if (squareStatus[currentRow][i] === 'right') {
							letterStatus[letters[currentRow][i]] = squareStatus[currentRow][i];
						}
						// Jos ei ole asetettu näppäintä vihreäksi ja nyt saatiin sille keltainen status, niin päivitetään
						else if (letterStatus[letters[currentRow][i]] !== 'right' && squareStatus[currentRow][i] === 'includes') {
							letterStatus[letters[currentRow][i]] = squareStatus[currentRow][i];
						}
						// Jos näppäin ei ole vihreä eikä keltainen, niin päivitetään eli käytännössä harmaaksi
						else if (letterStatus[letters[currentRow][i]] !== 'right' && letterStatus[letters[currentRow][i]] !== 'includes') {
							letterStatus[letters[currentRow][i]] = squareStatus[currentRow][i];
						}
					}

					console.log(letterStatus);

					// Käynnistetään animaatiot
					animating = Array(LETTER_COUNT).fill(true);
					animationStart[currentRow][0] = true;

					currentRow = Math.min(currentRow + 1, ROW_COUNT);
					currentSquare = 0;
				}
				// Sana ei löydy sanalistasta, joten kerrotaan käyttäjälle siitä
				else {
					animating = Array(LETTER_COUNT).fill(true);
					for (let index = 0; index < animationStart[currentRow].length; index++) {
						animationStart[currentRow][index] = true;
					}
					
					wrongGuess = true;
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
			squareStatus: squareStatus,
			animating: animating,
			animationStart: animationStart,
			wrongGuess: wrongGuess,
			letterStatus: letterStatus
		});
	}

	checkWord(word) {
		for (let index = 0; index < words.length; index++) {
			if (word === words[index]) {
				return true;
			}
		}

		return false;
	}

	checkGuess(guess) {
		let statusArr = Array(LETTER_COUNT).fill('none')
		let keywordArr = this.state.keyWord.split('');

		// Ensin tarkistetaan onko kirjaimet oikeilla paikoilla
		for (let index = 0; index < keywordArr.length; index++) {
			if (keywordArr[index].match(guess[index])) {
				statusArr[index] = 'right';
				keywordArr[index] = ' ';
			}
		}

		// Sitten tarkistetaan jäljelle jääneistä kirjaimista esiintyykö niitä arvauksessa
		for (let index = 0; index < keywordArr.length; index++) {
			if (keywordArr[index] !== ' ') {
				for (let j = 0; j < guess.length; j++) {
					if (keywordArr[index].match(guess[j]) && statusArr[j] !== 'right') {
						statusArr[j] = 'includes';
						break;
					}
				}
			}
		}

		return statusArr;
	}

	onAnimationEnd(i) {
		let animating = this.state.animating.slice();
		let animationStart = this.state.animationStart.slice();
		let wrongGuess = this.state.wrongGuess;

		// Animointi johtuu väärän sanan lähetyksestä
		if (wrongGuess) {
			animating[i] = false;
			animationStart[this.state.currentRow][i] = false;

			let isFalse = (value) => value === false;

			if (animating.every(isFalse)) wrongGuess = false;
		}
		// Animointi johtuu oikean sanan lähetyksestä
		else {
			animating[i] = false;

			// Vielä animoidaan
			if (i < LETTER_COUNT - 1) {
				animationStart[this.state.currentRow-1][i+1] = true;
			}
		}

		this.setState({
			animating: animating,
			animationStart: animationStart,
			wrongGuess: wrongGuess
		});
	}

	render() {
		return (
			<div className='game'>
				<div className='letter-board-container'>
					<Board
						letters={this.state.letters}
						squarestatus={this.state.squareStatus}
						onAnimationEnd={(i) => this.onAnimationEnd(i)}
						animationStart={this.state.animationStart}
					/>
				</div>
				<div className='keyboard-container'>
					<Keyboard 
						onClick={i => this.handleKeyPress(i)}
						letterstatus={this.state.letterStatus}
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
				squarestatus={this.props.squarestatus[row][i]}
				onAnimationEnd={a => this.props.onAnimationEnd(i)}
				animationStart={this.props.animationStart[row][i]}
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
	let cName = 'square';
	//console.log(props.squarestatus);
	if (props.animationStart && props.squarestatus !== 'unguessed') cName = 'square animation-square';
	else if (props.animationStart) cName = 'square animation-square-wrong';

	return (
		<button 
			className={cName}
			squarestatus={props.squarestatus}
			onAnimationEnd={props.onAnimationEnd}
		>
				{props.letter}
		</button>
	);
}

class Keyboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keysTop: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
			keysMid: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
			keysBot: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
		}
	}

	render() {
		return(
			<div className='keyboard'> 
				<div className='keyboard-row'>
					<div className='spacer'></div>
					{this.state.keysTop.map(key => 
						<KeyboardButton key={key} letter={key} letterstatus={this.props.letterstatus[key]} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
					<div className='spacer'></div>
				</div>
				<div className='keyboard-row'>
					{this.state.keysMid.map(key => 
						<KeyboardButton key={key} letter={key} letterstatus={this.props.letterstatus[key]} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
				</div>
				<div className='keyboard-row'>
					<div className='spacer'></div>
					<KeyboardButton key='backspace' letter='backspace' onClick={i => this.props.onClick('backspace')}></KeyboardButton>
					{this.state.keysBot.map(key => 
						<KeyboardButton key={key} letter={key} letterstatus={this.props.letterstatus[key]} onClick={i => this.props.onClick(key)}></KeyboardButton>)}
					<KeyboardButton key='enter' letter='enter' onClick={i => this.props.onClick('enter')}></KeyboardButton>
					<div className='spacer'></div>
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
			<button className='keyboard-button' letterstatus={props.letterstatus} onClick={props.onClick}>
				{props.letter}
			</button>
		);
	}
}

function WindowDimension() {
	const { height } = useWindowDimensions();
	const root = document.documentElement;

	let h = height;
	root.style.setProperty('--board-height', "".concat(h, "px"));

	return(
		<div className='dummy'/>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Game />
		<WindowDimension />
	</React.StrictMode>,
	document.getElementById('root')
);
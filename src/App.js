import './App.css';
import { Button } from "./components/Button";
const keysTop = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const keysMid = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'];
const keysBot = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

function handleKeyPress(i) {
	console.log('key pressed: ' +i);
}


function App() {
	return (
		<div className="App">
			<div className="Game">
				<div className="Board-container">
					<div className="Board">
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
						<div className="Board-row">
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
							<div className="Board-tile"></div>
						</div>
					</div>
				</div>

				<div className="Keyboard-container">
					<div className="Keyboard">
						<div className="Keyboard-row">
							{keysTop.map(key => <Button key={key} children={key} onClick={i => handleKeyPress(key)}></Button>)}
							<Button key='askelpalautin' children='<=' onClick={i => handleKeyPress('askelpalautin')}></Button>
						</div>
						<div className="Keyboard-row">
							{keysMid.map(key => <Button key={key} children={key} onClick={i => handleKeyPress(key)}></Button>)}
							<Button key='enter' children='Enter' onClick={i => handleKeyPress('enter')}></Button>
						</div>
						<div className="Keyboard-row">
							{keysBot.map(key => <Button key={key} children={key} onClick={i => handleKeyPress(key)}></Button>)}
						</div>
						<div className="Keyboard-row"></div>
						<div className="Keyboard-row"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;

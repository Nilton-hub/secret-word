import React, { useCallback, useState, useEffect } from 'react';
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game'
import GameOver from './components/GameOver';

// css
import './App.css';

const stages = [
    {id: 1, name: "start"},
    {id: 2, name: "game"},
    {id: 3, name: "end"}
];

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);

    const [pickedWord, setPickedWord] = useState("");
    const [pickedCategory, setPickedCategory] = useState("");
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(5);
    const [score, setScore] = useState(0);

    const pickWordAndCategory = useCallback(() => {
        const categories = Object.keys(words);
        const category = categories[Math.floor(Math.random() * categories.length)];

        const word = words[category][Math.floor(Math.random() * words[category].length)]; 
        return {word, category};
    }, [words]);

    // Starts Secret Words
    const startGame = useCallback(() => {
        clearLetterStates();
        // pick word and pick category
        const {word, category} = pickWordAndCategory();
        let wordLetters = word.toLowerCase().split("");
        setPickedWord(word);
        setPickedCategory(category);
        setLetters(wordLetters);
        setGameStage(stages[1].name);
    }, [pickWordAndCategory]);

    // process the letter input
    const verifyLetter = (letter) => {
        if (typeof(letter) != 'string') {
            return;
        }
        const normalizedLetter = letter.toLowerCase();
        // check if letter has already been utilized
        if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
            return;
        }
        // push guessed letter or remove a guess
        if (letters.includes(normalizedLetter)) {
            setGuessedLetters(actualGuessedLetters => [...actualGuessedLetters, normalizedLetter]); 
        } else {
            setWrongLetters(actualWrongLetters => [...actualWrongLetters, normalizedLetter]);
            setGuesses((actual) => actual - 1);
        }
    };

    const clearLetterStates = () => {
        setGuessedLetters([]);
        setWrongLetters([]);
    };

    // check guessed ended
    useEffect(() => {
        if (guesses <= 0) {
            clearLetterStates();
            setGameStage(stages[2].name)
        }
    }, [guesses]);

    // check win condition
    useEffect(() => {
        const uniqueLetters = [...new Set(letters)];
        if (guessedLetters.length === uniqueLetters.length) {
            setScore(score => score += 100);
            startGame();
        }
    }, [guessedLetters, letters, startGame]);

    const retry = () => {
        setGameStage(stages[0].name);
        
        setGuesses(5);
        setScore(0);
    };

    return (
        <main className="App">
            {gameStage === 'start' && <StartScreen startGame={startGame} />}
            {gameStage === 'game' && <Game
                verifyLetter={verifyLetter}
                pickedWord={pickedWord}
                pickedCategory={pickedCategory}
                letters={letters}
                guessedLetters={guessedLetters}
                wrongLetters={wrongLetters}
                guesses={guesses}
                score={score}
            />}
            {gameStage === 'end' && <GameOver retry={retry} score={score} />}
        </main>
    )
}

export default App

import React, { useState } from "react";
import './Game.css';

const Game = ({ verifyLetter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score }) => {
    const [letter, settLetter] = useState("");
    const letterInputRef = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyLetter(letter);
        settLetter("");
        letterInputRef.current.focus();
    };

    return (
        <div className="game">
            <p className="points">
                <span>Pontuação: {score}</span>
            </p>
            <h1>Adivinhe a palavra</h1>
            <h3 className="tip">Dica sobre a palavra: <span>{pickedCategory}</span></h3>
            <p>Você ainda tem {guesses} tentativa(s).</p>
            <button onClick={verifyLetter}>Finalizar o Jogo</button>
            <div className="wordContainer">
                {letters.map((letter, i) => (
                    guessedLetters.includes(letter) ?
                    <span key={i} className="letter">{letter}</span> :
                    <span key={i} className="blankSquare"></span>
                ))}
            </div>
            <div className="letterContainer">
                <p>Tente adivinhar uma letra da palava.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="letter"
                        maxLength={1}
                        onChange={({ target }) => settLetter(target.value)}
                        value={letter}
                        required
                        ref={letterInputRef}
                    />
                    <button type="submit">Jogar!</button>
                </form>
            </div>
            <div className="wrongLettersContainer">
                <p>Letras já utilizadas:</p>
                {wrongLetters.map((letter, i, arr) => (
                    <span key={i}>{letter}, </span>
                ))}
                
            </div>
        </div>
    );
};

export default Game;

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

function ChessApp() {
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState("white");

  useEffect(() => {
    const fenInput = document.getElementById("fen");
    if (fenInput) fenInput.value = game.fen();

    const flipBtn = document.getElementById("button-flip");
    const setPosBtn = document.getElementById("setpos");
    const resetBtn = document.getElementById("reset");

    const flipHandler = () =>
      setOrientation((o) => (o === "white" ? "black" : "white"));

    const setPosHandler = () => {
      if (!fenInput) return;
      const text = fenInput.value.trim();
      const tmp = new Chess(text);
      if (tmp.fen() === text || tmp.load(text)) {
        game.load(text);
        setFen(game.fen());
      }
    };

    const resetHandler = () => {
      game.reset();
      setFen(game.fen());
      if (fenInput) fenInput.value = game.fen();
    };

    flipBtn && flipBtn.addEventListener("click", flipHandler);
    setPosBtn && setPosBtn.addEventListener("click", setPosHandler);
    resetBtn && resetBtn.addEventListener("click", resetHandler);

    return () => {
      flipBtn && flipBtn.removeEventListener("click", flipHandler);
      setPosBtn && setPosBtn.removeEventListener("click", setPosHandler);
      resetBtn && resetBtn.removeEventListener("click", resetHandler);
    };
  }, [game]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move) {
      setFen(game.fen());
      const fenInput = document.getElementById("fen");
      if (fenInput) fenInput.value = game.fen();
    }
  };

  return React.createElement(Chessboard, {
    position: fen,
    orientation,
    width: 512,
    onDrop,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("chessground-board");
  if (container) {
    ReactDOM.render(React.createElement(ChessApp), container);
  }
});

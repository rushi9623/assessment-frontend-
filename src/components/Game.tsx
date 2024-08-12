import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../app/store";
import { drawCard, gameOver, getLeaderboard, restartGame, revealCard, updateScore, getScore, setUsername } from "../app/gameSlice";
import { cn } from "../utils/utils";
import SidebarComponent from "./SidebarComponent";
import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function Game() {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state: RootState) => state.gameReducer);

  const revealCardLocal = (index: number) => {
    dispatch(revealCard({ index: index }));

    setTimeout(() => {
      dispatch(drawCard({ cardType: game.deck[index], index: index }));
    }, 800);

    if (game.gameOver) {
      dispatch(gameOver());
    }
  };

  useEffect(() => {
    if (game.gameWon) {
      const user = { username: game.username, score: game.score };
      store.dispatch(updateScore(user));
      store.dispatch(getLeaderboard());
    }
  }, [game.gameWon]);

  const handleRestartGame = () => {
    dispatch(restartGame());
  };

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (game.username === "") {
      setOpenModal(true);
    } else {
      const user = { username: game.username, score: game.score };
      store.dispatch(getLeaderboard());
      store.dispatch(getScore(user));
    }
  }, [openModal]);

  function onCloseModal() {
    if (game.username !== "") {
      setOpenModal(false);
    }
  }

  const onChange = (text: string) => {
    dispatch(setUsername({ name: text }));
  };

  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className={`flex lg:flex-row flex-col ${game.username ? 'bg-green-100' : 'bg-blue-200'} min-h-screen`}>
      <div className="flex flex-col items-center justify-center content-center">
        <Modal
          show={openModal}
          size="md"
          onClose={onCloseModal}
          popup
          className="backdrop-blur-lg bg-zinc-400 bg-opacity-40 text-black"
        >
          <Modal.Body>
            <div className="flex flex-col items-center justify-center content-center gap-5 m-auto">
              <input
                className="lg:w-1/6 w-1/2 p-4 m-auto text-xl rounded-2xl"
                placeholder="Enter your name"
                type="text"
                value={game.username}
                onChange={(event) => onChange(event.target.value)}
                required
              />
              <button
                className="py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg"
                onClick={onCloseModal}
              >
                Start Game
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div className="lg:w-3/4 w-full h-full flex flex-col items-center content-center gap-5 p-5">
        <h1 className="lg:text-4xl md:text-4xl text-2xl font-bold p-5">Exploding Kittens Game</h1>

        <div className="flex flex-row flex-wrap justify-center gap-4">
          {game.deck &&
            game.deck.map((card, index) => (
              <div
                className={cn(
                  "group lg:h-40 lg:w-40 w-28 h-28 [perspective:1000px] transition-transform duration-300",
                  game.gameOver || game.gameWon ? "pointer-events-none" : "pointer-events-auto"
                )}
                key={index}
                onClick={() => revealCardLocal(index)}
              >
                <div
                  className={cn(
                    "relative h-full w-full shadow-xl transition-all rounded-xl duration-500 [transform-style:preserve-3d] cursor-pointer",
                    game.deckRevealed[index] === true
                      ? "[transform:rotateY(180deg)]"
                      : "",
                    "transform hover:scale-105",
                    game.deckRevealed[index] ? "bg-red-500" : "bg-zinc-600"
                  )}
                >
                  <div
                    className="absolute inset-0 lg:p-8 p-4 rounded-xl"
                  >
                    <p className="text-6xl text-center text-white">
                      {game.deckRevealed[index] ? card : ""}
                    </p>
                  </div>
                  <div className="absolute inset-0 h-full w-full cursor-grab rounded-xl bg-red-500 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex flex-col justify-between h-full items-center content-center">
                      <p className="text-white m-auto text-6xl font-light leading-5">
                        {game.deckRevealed[index] ? card : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          className="py-4 px-3 bg-blue-600 text-white font-semibold rounded-lg"
          onClick={handleRestartGame}
        >
          {game.deck.length === 5 && !game.gameOver
            ? "Start clicking cards!"
            : "Restart Game"}
        </button>

        {game.diffuserDiscovered && (
          <p className="font-semibold text-2xl">You found a bomb diffuser! 🙅‍♂️</p>
        )}

        {game.gameOver && <p className="font-bold text-3xl">Game Over!</p>}

        {game.gameWon && <p className="font-bold text-3xl">You Won!</p>}

        <div className="flex content-center flex-col">
          <p className="text-center bg-gray-200 rounded-lg p-3 select-none w-fit self-center drop-shadow-xl" onClick={() => setShowHowTo(!showHowTo)}>
            How to Play!
          </p>
          <ul className={cn("border p-4 rounded-lg m-4", showHowTo ? "visible" : "hidden")}>
            <li>Click on any of the cards to reveal it</li>
            <li>If the card is:</li>
            <li>😼 It will be removed from the deck</li>
            <li>💣 You lose, and the game restarts</li>
            <li>🙅‍♂️ If found before the bomb, you win</li>
            <li>🔀 Resets the game</li>
          </ul>
        </div>
      </div>
      <SidebarComponent />
    </div>
  );
}

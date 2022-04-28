import { View, SafeAreaView, Dimensions } from 'react-native'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from "./single-player-game.styles";
import { GradientBackground, Board, Text, Button } from '@components';
import { 
  BoardState, 
  isEmpty, 
  isTerminal, 
  getBestMove,
  Cell,
  useSounds
} from '@utils';

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function Game(): ReactElement {
  const [state, setState] = useState<BoardState>(
    [
      null, null, null,
      null, null, null,
      null, null, null
    ]);

  const [turn, setTurn] = useState<"HUMAN" | "BOT">(Math.random() < 0.5 ? "HUMAN" : "BOT");
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);

  const [gamesCount, setGamesCount] = useState({
    wins: 0,
    losses: 0,
    draws: 0
  });

  const playSound = useSounds();
  const gameResult = isTerminal(state);
  const insertCell = (cell: number, symbol: "x" | "o"): void => {
    const stateCopy: BoardState = [...state];
    if(stateCopy[cell] || isTerminal(stateCopy)) return;
    stateCopy[cell] = symbol;
    setState(stateCopy);

    try {
      symbol === "x" ? playSound("pop1") : playSound("pop2");
    } catch(error) {
      console.log(error);
    }
  }
  const handleOnCellPressed = (cell: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(cell, isHumanMaximizing ? "x" : "o");
    setTurn("BOT");
  };

  const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
    if(winnerSymbol === "x") {
      return isHumanMaximizing ? "HUMAN" : "BOT";
    }
    if(winnerSymbol === "o") {
      return isHumanMaximizing ? "BOT" : "HUMAN";
    }
    return "DRAW";
  }

  const newGame = () => {
    setState([null, null, null, null, null, null, null, null, null]);
    setTurn(Math.random() < 0.5 ? "HUMAN" : "BOT");
  }

  useEffect(() => {
    if(gameResult) {
      const winner = getWinner(gameResult.winner);
      switch (winner) {
        case "HUMAN":
          playSound("win");
          setGamesCount({...gamesCount, wins: gamesCount.wins + 1});
          return;
        case "BOT":
          playSound("loss");
          setGamesCount({...gamesCount, losses: gamesCount.losses + 1});
          return;
        case "DRAW":
          playSound("draw");
          setGamesCount({...gamesCount, draws: gamesCount.draws + 1});
          return;
        default:
          return;
      }
    } else {
      if(turn === "BOT")
      {
        if (isEmpty(state))
        {
          const centerAndCorners = [0,2,4,6,8];
          const firstMove = centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
          insertCell(firstMove, "x");
          setIsHumanMaximizing(false);
          setTurn("HUMAN");
        } else {
          const best = getBestMove(state, !isHumanMaximizing, 0, 1);
          insertCell(best, isHumanMaximizing ?  "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn])

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.difficulty}>Difficulty: Hard</Text>
          <View style={styles.results}>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Win</Text>
              <Text style={styles.resultsCount}>{gamesCount.wins}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Draws</Text>
              <Text style={styles.resultsCount}>{gamesCount.draws}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Losses</Text>
              <Text style={styles.resultsCount}>{gamesCount.losses}</Text>
            </View>
          </View>
        </View>
        <Board 
          disabled={Boolean(isTerminal(state)) || turn !== "HUMAN"}
          onCellPressed={(cell) => {
            handleOnCellPressed(cell)
          }}
          state={state}
          gameResult={gameResult}
          size={SCREEN_WIDTH - 60}
        />
        {gameResult && (
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            {getWinner(gameResult.winner) === "HUMAN" && "You Won"}
            {getWinner(gameResult.winner) === "BOT" && "You Lost"}
            {getWinner(gameResult.winner) === "DRAW" && "It's a Draw"}
          </Text>
          <Button 
            onPress={() => {
              newGame();
            }} 
            title='Play Again' />
        </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  )
}
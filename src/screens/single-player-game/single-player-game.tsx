import { SafeAreaView } from 'react-native'
import React, { ReactElement, useEffect, useState, useRef } from 'react'
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from '@components';
import { 
  BoardState, 
  isEmpty, 
  isTerminal, 
  getBestMove } from '@utils';
import { Audio } from 'expo-av';
import { loadAsync } from 'expo-font';
import * as Haptics from 'expo-haptics';

export default function Game(): ReactElement {
  const [state, setState] = useState<BoardState>(
    [
      null, null, null,
      null, null, null,
      null, null, null
    ]);

  const [turn, setTurn] = useState<"HUMAN" | "BOT">(Math.random() < 0.5 ? "HUMAN" : "BOT");
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);
  const popSoundRef = useRef<Audio.Sound | null>(null);
  const pop2SoundRef = useRef<Audio.Sound | null>(null);
  const gameResult = isTerminal(state);
  const insertCell = (cell: number, symbol: "x" | "o"): void => {
    const stateCopy: BoardState = [...state];
    if(stateCopy[cell] || isTerminal(stateCopy)) return;
    stateCopy[cell] = symbol;
    setState(stateCopy);

    try {
      symbol === "x" ? popSoundRef.current?.replayAsync() : pop2SoundRef.current?.replayAsync();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch(error) {
      console.log(error);
    }
  }
  const handleOnCellPressed = (cell: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(cell, isHumanMaximizing ? "x" : "o");
    setTurn("BOT");
  };
  useEffect(() => {
    if(gameResult) {
      alert("Done");
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
          const best = getBestMove(state, !isHumanMaximizing, 0, -1);
          insertCell(best, isHumanMaximizing ?  "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn])

  useEffect(() => {
    //load sounds
    const popSoundObject = new Audio.Sound();
    const pop2SoundObject = new Audio.Sound();
    const loadSounds = async () => {
      await popSoundObject.loadAsync(require("@assets/pop_1.wav"));
      popSoundRef.current = popSoundObject;
      await pop2SoundObject.loadAsync(require("@assets/pop_2.wav"));
      pop2SoundRef.current = pop2SoundObject;
    }
    loadSounds();
    return () => {
      //unload sounds
      popSoundObject && popSoundObject.unloadAsync();
      pop2SoundObject && pop2SoundObject.unloadAsync();
    }
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
          <Board 
            disabled={Boolean(isTerminal(state)) || turn !== "HUMAN"}
            onCellPressed={(cell) => {
              handleOnCellPressed(cell)
            }}
            state={state}
            size={300}
            ></Board>
      </SafeAreaView>
    </GradientBackground>
  )
}
import React, { useEffect } from "react";
import { View, FlatList, Text, Button } from "react-native";
import { useTimerContext } from "../context/TimerContext";
import styles from "../utils/styles";

export function TimerList(): JSX.Element {
  const { timers, startTimer, pauseTimer, resetTimer, decrementTime } =
    useTimerContext();

  useEffect(() => {
    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [decrementTime]);

  return (
    <FlatList
      data={timers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.timerItem}>
          <Text>Category: {item.category}</Text>
          <Text>Remaining: {item.remaining}s</Text>
          <Text>Status: {item.status}</Text>
          <View style={styles.timerActions}>
            <Button title="Start" onPress={() => startTimer(item.id)} />
            <Button title="Pause" onPress={() => pauseTimer(item.id)} />
            <Button title="Reset" onPress={() => resetTimer(item.id)} />
          </View>
        </View>
      )}
    />
  );
}

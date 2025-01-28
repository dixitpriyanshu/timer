import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../utils/styles";

export default function HistoryScreen(): JSX.Element {
  const [history, setHistory] = useState<
    { category: string; completionTime: string }[]
  >([]);

  useEffect(() => {
    const loadHistory = async () => {
      const savedHistory = await AsyncStorage.getItem("timerHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    };

    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>Category: {item.category}</Text>
            <Text>Completed at: {item.completionTime}</Text>
          </View>
        )}
      />
    </View>
  );
}

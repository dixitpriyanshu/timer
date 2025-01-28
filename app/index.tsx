import React, { useState } from "react";
import { View, Button, Modal } from "react-native";
import { TimerList } from "../components/TimerList";
import { TimerForm } from "../components/TimerForm";
import styles from "../utils/styles";
import { router } from "expo-router";

export default function HomeScreen(): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Add Timer" onPress={() => setModalVisible(true)} />
      <TimerList />
      <Modal visible={modalVisible} animationType="slide">
        <TimerForm closeModal={() => setModalVisible(false)} />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </Modal>
      <Button title="History" onPress={() => router.push("/history")} />
    </View>
  );
}

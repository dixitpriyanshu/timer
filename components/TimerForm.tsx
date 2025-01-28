import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { useTimerContext } from "../context/TimerContext";
import styles from "../utils/styles";
import { Picker } from "@react-native-picker/picker";

interface TimerFormProps {
  closeModal: () => void;
}

export function TimerForm({ closeModal }: TimerFormProps): JSX.Element {
  const { addTimer } = useTimerContext();
  const [formData, setFormData] = useState({
    duration: "",
    category: "normal",
  });

  const handleSave = (): void => {
    addTimer(formData);
    closeModal();
  };

  return (
    <View style={styles.modalContent}>
      <TextInput
        placeholder="Duration (seconds)"
        keyboardType="numeric"
        value={formData.duration}
        onChangeText={(text) => setFormData({ ...formData, duration: text })}
        style={styles.input}
      />
      <Picker
        selectedValue={formData.category}
        onValueChange={(itemValue) =>
          setFormData({ ...formData, category: itemValue })
        }
        style={styles.input}
      >
        <Picker.Item label="Normal" value="normal" />
        <Picker.Item label="Workout" value="workout" />
        <Picker.Item label="Sports" value="sports" />
        <Picker.Item label="Running" value="running" />
      </Picker>
      <Button title="Save Timer" onPress={handleSave} />
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}

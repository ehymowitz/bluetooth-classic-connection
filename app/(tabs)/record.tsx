import { Button, StyleSheet, Text } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function TabTwoScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        console.log("Starting recording...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
        console.log("Recording started");
      } else {
        console.log("Permission to record audio not granted");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    console.log("Stopping recording...");
    setIsRecording(false);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    const { sound } = await recording.createNewLoadedSoundAsync();
    setSound(sound);
    setRecording(null);
  };

  const playSound = async () => {
    if (!sound) return;

    console.log("Playing sound...");
    await sound.replayAsync();
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {sound && <Button title="Play Sound" onPress={playSound} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

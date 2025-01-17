import { Button, FlatList, StyleSheet, Text, Platform } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import {
  requestAccessFineLocationPermissionAsync,
  requestBlueToothConnectPermissionAsync,
} from "@/lib/androidPermissions";
import { useState } from "react";
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";

// Example repo
// https://github.com/kenjdavidson/react-native-bluetooth-classic-apps/blob/main/BluetoothClassicExample/src/connection/ConnectionScreen.js

// DOCS
// https://kenjdavidson.com/react-native-bluetooth-classic/android/

export default function HomeScreen() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const fetchBondedDevices = async () => {
    try {
      if (Platform.OS === "android") {
        await requestAccessFineLocationPermissionAsync();
        await requestBlueToothConnectPermissionAsync();
      }

      const bondedDevices = await RNBluetoothClassic.getBondedDevices();
      console.log(JSON.stringify(bondedDevices, undefined, 2));
      setDevices(bondedDevices);
    } catch (error) {
      console.error("Error fetching bonded devices:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Pair Devices</Text>
      <Button title="Fetch Bonded Devices" onPress={fetchBondedDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.name} - {item.address}
          </Text>
        )}
      />
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
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

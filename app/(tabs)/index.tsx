import { Button, FlatList, StyleSheet, Text } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";

// Example repo
// https://github.com/kenjdavidson/react-native-bluetooth-classic-apps/blob/main/BluetoothClassicExample/src/connection/ConnectionScreen.js

export default function HomeScreen() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const fetchBondedDevices = async () => {
    try {
      const isAvail = await RNBluetoothClassic.isBluetoothAvailable();
      console.log(isAvail);
      // const bondedDevices = await RNBluetoothClassic.getBondedDevices();
      // console.log(bondedDevices);
      // setDevices(bondedDevices);
    } catch (error) {
      console.error("Error fetching bonded devices:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Pair Devices</Text>
      <Button title="Fetch Bonded Devices" onPress={fetchBondedDevices} />
      {/* <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.name} - {item.address}
          </Text>
        )}
      /> */}
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

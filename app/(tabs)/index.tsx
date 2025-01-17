import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import {
  requestAccessFineLocationPermissionAsync,
  requestBlueToothConnectPermissionAsync,
} from "@/lib/androidPermissions";
import React, { useState } from "react";
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";

// Example repo
// https://github.com/kenjdavidson/react-native-bluetooth-classic-apps/blob/main/BluetoothClassicExample/src/connection/ConnectionScreen.js

// DOCS
// https://kenjdavidson.com/react-native-bluetooth-classic/react-native/rn-bluetooth-device/

export default function HomeScreen() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] =
    useState<BluetoothDevice | null>(null);
  // const [receivedData, setReceivedData] = useState<string[]>([]);
  // const [isListening, setIsListening] = useState(false);

  const fetchBondedDevices = async () => {
    try {
      if (Platform.OS === "android") {
        await requestAccessFineLocationPermissionAsync();
        await requestBlueToothConnectPermissionAsync();
      }

      const bondedDevices = await RNBluetoothClassic.getBondedDevices();
      setDevices(bondedDevices);
    } catch (error) {
      console.error("Error fetching bonded devices:", error);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      console.log(`Attempting to connect to device ${device.name}...`);
      const isConnected = await device.connect();
      if (isConnected) {
        setConnectedDevice(device);
        console.log("Connected", `Connected to ${device.name}`);
      } else {
        console.error(
          "Connection Failed",
          `Could not connect to ${device.name}`
        );
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.disconnect();
        setConnectedDevice(null);
        console.log(`Disconnected from ${connectedDevice.name}`);
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  };

  // useEffect(() => {
  //   // Clean up listener on component unmount
  //   return () => {
  //     stopListening();
  //   };
  // }, []);

  // const startListening = () => {
  //   if (connectedDevice) {
  //     try {
  //       connectedDevice.onDataReceived(({ data }) => {
  //         console.log("Received data:", data);
  //         setReceivedData((prevData) => [...prevData, data]);
  //       });
  //       setIsListening(true);
  //       console.log("Listening", "Started listening for incoming data.");
  //     } catch (error) {
  //       console.error("Error starting data listener:", error);
  //       console.log("Error", "Could not start listening for data.");
  //     }
  //   } else {
  //     console.log("No Device", "Please connect to a device first.");
  //   }
  // };

  // const stopListening = () => {
  //   if (connectedDevice) {
  //     try {
  //       connectedDevice.onDataReceived(() => {
  //         setIsListening(false);
  //         console.log("Stopped", "Stopped listening for incoming data.");
  //       });
  //     } catch (error) {
  //       console.error("Error stopping data listener:", error);
  //     }
  //   }
  // };

  return (
    <ThemedView style={styles.container}>
      {connectedDevice ? (
        <View style={styles.connectedDevice}>
          <Text style={styles.connectedText}>
            Connected to: {connectedDevice.name}
          </Text>
          {/* <TouchableOpacity
            style={styles.listenButton}
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.buttonText}>
              {isListening ? "Stop Listening" : "Start Listening"}
            </Text>
          </TouchableOpacity> */}
          {/* <FlatList
            data={receivedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{item}</Text>
              </View>
            )}
            ListHeaderComponent={
              <Text style={styles.listHeader}>Received Data:</Text>
            }
          /> */}
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={disconnectFromDevice}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Button title="Fetch Bonded Devices" onPress={fetchBondedDevices} />

          <FlatList
            data={devices}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <Text style={styles.text} onPress={() => connectToDevice(item)}>
                {item.name} - {item.address}
              </Text>
            )}
          />
        </>
      )}
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
  connectedDevice: {
    alignItems: "center",
    marginBottom: 20,
  },
  connectedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  listenButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataItem: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  dataText: {
    fontSize: 14,
    color: "#333",
  },
});

import { PermissionsAndroid } from "react-native";

const requestAccessFineLocationPermissionAsync = async () => {
  const fineLocationGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Access fine location required for discovery",
      message:
        "In order to perform discovery, you must enable/allow " +
        "fine location access.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );
  return fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED;
};

const requestBlueToothConnectPermissionAsync = async () => {
  const bluetoothConnectGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    {
      title: "Access bluetooth connection",
      message:
        "In order to perform discovery, you must enable/allow " +
        "bluetooth connection.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );
  return bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED;
};

export {
  requestAccessFineLocationPermissionAsync,
  requestBlueToothConnectPermissionAsync,
};

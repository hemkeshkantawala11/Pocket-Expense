import { View, Text, Modal, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff, Wifi } from "lucide-react-native";
import { Colors } from "../themes/colors";
import { syncExpenses } from "../utils/sync";

export default function NetworkMonitor() {
  const [isConnected, setIsConnected] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // If we were offline and now we are online -> Sync
      if (!isConnected && state.isConnected) {
        setShowRestored(true);
        syncExpenses();
        setTimeout(() => setShowRestored(false), 3000); // Hide "Restored" msg after 3s
      }
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);

  if (!isConnected) {
    return (
      <View style={styles.offlineBanner}>
        <WifiOff color="white" size={20} />
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );
  }

  if (showRestored) {
    return (
      <View style={styles.onlineBanner}>
        <Wifi color="white" size={20} />
        <Text style={styles.text}>Internet Restored. Syncing...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  offlineBanner: {
    position: 'absolute', top: 50, left: 20, right: 20,
    backgroundColor: Colors.danger, padding: 15, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    zIndex: 9999, elevation: 5
  },
  onlineBanner: {
    position: 'absolute', top: 50, left: 20, right: 20,
    backgroundColor: Colors.success, padding: 15, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    zIndex: 9999, elevation: 5
  },
  text: { color: 'white', fontWeight: 'bold' }
});
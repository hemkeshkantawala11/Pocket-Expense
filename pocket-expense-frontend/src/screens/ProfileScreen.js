import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import Cache
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../themes/colors";
import { Settings, LogOut, Key } from "lucide-react-native";
import api from "../services/api";

export default function ProfileScreen({ navigation }) {
  const { logout, userToken } = useContext(AuthContext);
  const [name, setName] = useState("User");

  // --- 1. Cache-First Profile Fetching ---
  useEffect(() => {
    const loadProfile = async () => {
      // Load Cache First
      try {
        const cachedName = await AsyncStorage.getItem("user_name_cache");
        if (cachedName) setName(cachedName);
      } catch (e) {
        console.log("Cache load error", e);
      }

      // Fetch Network Data
      if (userToken) {
        try {
          const response = await api.get("auth/profile");
          if (response.data.user) {
            const serverName = response.data.user.name;
            setName(serverName);
            // Save to Cache
            await AsyncStorage.setItem("user_name_cache", serverName);
          }
        } catch (error) {
          console.log("Error fetching profile (using cache):", error);
        }
      }
    };

    loadProfile();
  }, [userToken]);

  // --- 2. Enhanced Logout (Clears Cache) ---
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          try {
            // Remove the cached name so next user doesn't see it
            await AsyncStorage.removeItem("user_name_cache");
            // Also good practice to clear other user-specific keys if you have them
            await AsyncStorage.removeItem("user_options_cache"); 
            logout();
          } catch (e) {
            console.log("Logout cleanup error", e);
            logout(); // Force logout anyway
          }
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {/* Display first initial of name if available */}
          <Text style={{fontSize: 40}}>{name ? name[0].toUpperCase() : "👤"}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("ChangePassword")}>
        <Key color={Colors.primary} size={20} />
        <Text style={styles.tileText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tile, {marginTop: 10}]} onPress={handleLogout}>
        <LogOut color={Colors.danger} size={20} />
        <Text style={[styles.tileText, {color: Colors.danger}]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  header: { alignItems: 'center', marginVertical: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  name: { color: Colors.text, fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  tile: { flexDirection: 'row', backgroundColor: Colors.card, padding: 18, borderRadius: 15, alignItems: 'center' },
  tileText: { color: Colors.text, marginLeft: 15, fontSize: 16 }
});
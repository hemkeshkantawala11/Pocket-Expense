import { NavigationContainer } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";

export default function RootNavigator() {
  const { userToken, loading } = useContext(AuthContext);

  // Global Internet Listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log("🔌 Internet Restored: Syncing offline expenses...");
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // or <ActivityIndicator />
  }

  return (
    <NavigationContainer>
      {userToken ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
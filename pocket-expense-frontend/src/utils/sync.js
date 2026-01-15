import API from "../services/api";
import { getOfflineExpenses, clearOfflineExpenses } from "./offlineQueue";
import { Alert } from "react-native";

export const syncExpenses = async () => {
  try {
    const offlineExpenses = await getOfflineExpenses();
    if (offlineExpenses.length === 0) return;

    console.log(`[Sync] Found ${offlineExpenses.length} items to sync...`);

    // Process all expenses
    const promises = offlineExpenses.map(item => {
      // Ensure data types are correct before sending
      const payload = {
        ...item,
        amount: Number(item.amount), // Force Number
        date: item.date // Should already be ISO string
      };
      return API.post("/expenses", payload);
    });

    await Promise.all(promises); // Wait for all to finish
    
    await clearOfflineExpenses();
    Alert.alert("Sync Complete", "Offline expenses have been added to the database.");
  } catch (error) {
    console.log("Sync failed:", error);
  }
};
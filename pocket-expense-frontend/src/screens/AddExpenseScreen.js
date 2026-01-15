import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetInfo from "@react-native-community/netinfo";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ensure this library is installed
import API from "../services/api";
import { Colors } from "../themes/colors";
import { saveOfflineExpense } from "../utils/offlineQueue";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health"];
const DEFAULT_PAYMENT_METHODS = ["Cash", "Card", "UPI", "Net Banking"];

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);


  // Load options every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOptions();
    }, [])
  );

  const initializeOptions = async () => {
    setOptionsLoading(true);
    
    // Step A: Load from Cache immediately (Fast & Offline friendly)
    const cachedData = await loadFromCache();
    if (cachedData) {
      setDropdowns(cachedData.categories, cachedData.paymentMethods);
    }

    // Step B: Try to fetch fresh data from API
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      await fetchFromApi(); 
    } else if (!cachedData) {
      // Step C: If Offline AND No Cache -> Use Defaults
      console.log("Offline & No Cache: Using Defaults");
      setDropdowns(DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS);
    }
    
    setOptionsLoading(false);
  };

  const loadFromCache = async () => {
    try {
      const stored = await AsyncStorage.getItem("user_options_cache");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.log("Cache Read Error:", e);
      return null;
    }
  };

  const fetchFromApi = async () => {
    try {
      const response = await API.get("/user/options");
      const { categories: serverCats, paymentMethods: serverMethods } = response.data;

      // Update State
      setDropdowns(serverCats, serverMethods);

      // Save to Cache for next time
      await AsyncStorage.setItem("user_options_cache", JSON.stringify({
        categories: serverCats,
        paymentMethods: serverMethods
      }));
    } catch (err) {
      console.log("API Fetch Error (using cache if available):", err);
    }
  };

  // Helper to format and set state
  const setDropdowns = (cats, methods) => {
    // Ensure we handle potential undefined/null inputs
    const safeCats = cats || DEFAULT_CATEGORIES;
    const safeMethods = methods || DEFAULT_PAYMENT_METHODS;

    const formattedCats = safeCats.map(c => ({ label: c, value: c }));
    const formattedMethods = safeMethods.map(p => ({ label: p, value: p }));

    setCategories(formattedCats);
    setPaymentMethods(formattedMethods);

    // Auto-select defaults only if user hasn't selected anything yet
    setCategory(prev => prev || (formattedCats[0]?.value));
    setPaymentMethod(prev => prev || (formattedMethods[0]?.value));
  };

  const handleAdd = async () => {
    if (loading) return;
    
    if (!amount || !category || !paymentMethod) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const expenseData = { 
      amount: Number(amount), 
      category, 
      paymentMethod, 
      date: date.toISOString() 
    };

    const state = await NetInfo.fetch();

    // 1. Offline Mode Logic
    if (!state.isConnected) {
      await saveOfflineExpense(expenseData);
      Alert.alert("Offline Mode", "Expense saved locally. It will sync once you are back online.");
      resetForm();
      navigation.goBack();
      return;
    }

    // 2. Online Mode Logic
    setLoading(true);
    try {
      const response = await API.post("/expenses", expenseData);
      if (response.status === 201) {
        Alert.alert("Success", "Expense added successfully!");
        resetForm();
        // Option A: Go back to Home
        navigation.navigate("Home"); 
        // Option B: Stay here to add another? (If so, remove the line above)
      }
    } catch (e) { 
      console.error(e);
      Alert.alert("Error", "Failed to add expense"); 
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setDate(new Date());
    // Keep category/payment method selected for faster entry of multiple expenses
  };

  if (optionsLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header with Manage Button */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>New Expense</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate("ManageOptions")}
          style={styles.manageBtn}
        >
          <Ionicons name="settings-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Amount Input */}
      <TextInput
        placeholder="0.00"
        placeholderTextColor={Colors.mutedText}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.amountInput}
      />

      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <Dropdown
        style={styles.dropdown}
        data={categories}
        labelField="label"
        valueField="value"
        value={category}
        onChange={item => setCategory(item.value)}
        placeholder="Select Category"
        placeholderStyle={{color: Colors.mutedText}}
        selectedTextStyle={{color: Colors.text}}
        containerStyle={{backgroundColor: Colors.card, borderColor: Colors.border}}
        itemTextStyle={{color: Colors.text}}
        activeColor={Colors.background}
      />

      {/* Payment Method Dropdown */}
      <Text style={styles.label}>Payment Method</Text>
      <Dropdown
        style={styles.dropdown}
        data={paymentMethods}
        labelField="label"
        valueField="value"
        value={paymentMethod}
        onChange={item => setPaymentMethod(item.value)}
        placeholder="Select Payment Method"
        placeholderStyle={{color: Colors.mutedText}}
        selectedTextStyle={{color: Colors.text}}
        containerStyle={{backgroundColor: Colors.card, borderColor: Colors.border}}
        itemTextStyle={{color: Colors.text}}
        activeColor={Colors.background}
      />

      {/* Date Picker */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.dateBox} onPress={() => setShowDate(true)}>
        <Text style={{ color: Colors.text, fontSize: 16 }}>{date.toDateString()}</Text>
        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDate}
        mode="date"
        onConfirm={(d) => { setDate(d); setShowDate(false); }}
        onCancel={() => setShowDate(false)}
      />

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.btn, loading && { opacity: 0.7 }]} 
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.btnText}>Save Expense</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, paddingTop: 60 },
  
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { color: Colors.text, fontSize: 28, fontWeight: 'bold' },
  manageBtn: { padding: 8, backgroundColor: Colors.card, borderRadius: 8 },

  amountInput: { 
    color: Colors.primary, 
    fontSize: 48, 
    textAlign: 'center', 
    marginBottom: 30, 
    fontWeight: 'bold' 
  },
  
  label: { color: Colors.mutedText, marginBottom: 8, marginLeft: 4, fontSize: 12, fontWeight: '600' },
  
  dropdown: { 
    backgroundColor: Colors.card, 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent' // or Colors.border if you want outlines
  },
  
  dateBox: { 
    backgroundColor: Colors.card, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 40, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  btn: { 
    backgroundColor: Colors.primary, 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  
  btnText: { color: Colors.background, fontWeight: 'bold', fontSize: 16 }
});
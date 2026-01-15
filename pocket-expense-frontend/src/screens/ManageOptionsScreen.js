import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../themes/colors"; // <--- Import Colors

export default function ManageOptionsScreen() {
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await API.get("/user/options");
      setCategories(res.data.categories);
      setPaymentMethods(res.data.paymentMethods);
    } catch (err) {
      console.log("Error fetching options:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC FOR CATEGORIES ---
  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    setActionLoading(true);
    try {
      const res = await API.post("/user/categories", { category: newCat.trim() });
      setCategories(res.data);
      setNewCat("");
    } catch (err) {
      Alert.alert("Error", "Could not add category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    Alert.alert("Delete Category", `Are you sure you want to remove "${category}"?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            const res = await API.delete(`/user/categories/${encodeURIComponent(category)}`);
            setCategories(res.data);
          } catch (err) {
            Alert.alert("Error", "Could not delete category");
          }
        }
      }
    ]);
  };

  // --- LOGIC FOR PAYMENT METHODS ---
  const handleAddPaymentMethod = async () => {
    if (!newMethod.trim()) return;
    setActionLoading(true);
    try {
      const res = await API.post("/user/payment-methods", { method: newMethod.trim() });
      setPaymentMethods(res.data);
      setNewMethod("");
    } catch (err) {
      Alert.alert("Error", "Could not add payment method");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (method) => {
    Alert.alert("Delete Method", `Remove "${method}"?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            const res = await API.delete(`/user/payment-methods/${encodeURIComponent(method)}`);
            setPaymentMethods(res.data);
          } catch (err) {
            Alert.alert("Error", "Could not delete payment method");
          }
        }
      }
    ]);
  };

  // Render Item for Lists
  const renderItem = ({ item, onDelete }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item}</Text>
      <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} style={styles.center} />;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: Colors.background }} // Background set here
    >
      <FlatList
        contentContainerStyle={styles.container}
        data={[{ key: 'content' }]}
        renderItem={() => (
          <>
            {/* --- CATEGORIES SECTION --- */}
            <View style={styles.section}>
              <Text style={styles.header}>Manage Categories</Text>
              
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="New Category (e.g. Gym)"
                  placeholderTextColor={Colors.mutedText} // Visible placeholder
                  value={newCat}
                  onChangeText={setNewCat}
                />
                <TouchableOpacity 
                  style={[styles.addButton, actionLoading && styles.disabledBtn]} 
                  onPress={handleAddCategory}
                  disabled={actionLoading}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.listContainer}>
                {categories.map((cat, index) => (
                  <View key={`cat-${index}`}>
                    {renderItem({ item: cat, onDelete: handleDeleteCategory })}
                  </View>
                ))}
              </View>
            </View>

            {/* --- PAYMENT METHODS SECTION --- */}
            <View style={styles.section}>
              <Text style={styles.header}>Manage Payment Methods</Text>
              
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="New Method (e.g. Crypto)"
                  placeholderTextColor={Colors.mutedText}
                  value={newMethod}
                  onChangeText={setNewMethod}
                />
                <TouchableOpacity 
                  style={[styles.addButton, actionLoading && styles.disabledBtn]} 
                  onPress={handleAddPaymentMethod}
                  disabled={actionLoading}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.listContainer}>
                {paymentMethods.map((pm, index) => (
                  <View key={`pm-${index}`}>
                    {renderItem({ item: pm, onDelete: handleDeletePaymentMethod })}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 50, backgroundColor: Colors.background }, // Use theme background
  section: { marginBottom: 30 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: Colors.text }, // Theme text color
  
  inputRow: { 
    flexDirection: "row", 
    marginBottom: 15, 
    alignItems: 'center' 
  },
  input: { 
    flex: 1, 
    backgroundColor: Colors.card, // Card background for input
    borderWidth: 1, 
    borderColor: Colors.border, // Theme border
    borderRadius: 12, 
    padding: 12, 
    fontSize: 16,
    color: Colors.text, // Theme text color for typing
    marginRight: 10,
  },
  addButton: { 
    backgroundColor: Colors.primary, 
    borderRadius: 12, 
    width: 48, 
    height: 48, 
    justifyContent: "center", 
    alignItems: "center",
    elevation: 2
  },
  disabledBtn: { opacity: 0.6 },
  
  listContainer: {
    backgroundColor: Colors.card, // Card background for list
    borderRadius: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border // Theme separator line
  },
  itemText: { fontSize: 16, color: Colors.text, fontWeight: "500" }, // Theme text color
  deleteButton: { padding: 5 }
});
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown'; // Ensure this is installed
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Trash2, Save } from "lucide-react-native";
import API from "../services/api";
import { Colors } from "../themes/colors";

const categories = [ { label: 'Food', value: 'Food' }, { label: 'Transport', value: 'Transport' }, { label: 'Shopping', value: 'Shopping' } ];
const methods = [ { label: 'UPI', value: 'UPI' }, { label: 'Cash', value: 'Cash' }, { label: 'Card', value: 'Card' } ];

export default function EditExpenseScreen({ route, navigation }) {
  const { expense } = route.params;

  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [paymentMethod, setPaymentMethod] = useState(expense.paymentMethod);
  const [date, setDate] = useState(new Date(expense.date));
  const [showDate, setShowDate] = useState(false);

  const handleUpdate = async () => {
    try {
      await API.put(`/expenses/${expense._id}`, {
        amount: Number(amount), category, paymentMethod, date: date.toISOString()
      });
      Alert.alert("Updated", "Expense updated successfully");
      navigation.goBack();
    } catch (err) { Alert.alert("Error", "Failed to update"); }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try { await API.delete(`/expenses/${expense._id}`); navigation.goBack(); } 
          catch { Alert.alert("Error", "Failed to delete"); }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.amountInput} value={amount} onChangeText={setAmount} keyboardType="numeric" />

      <Text style={styles.label}>Category</Text>
      <Dropdown style={styles.dropdown} data={categories} labelField="label" valueField="value" value={category} onChange={item => setCategory(item.value)} placeholderStyle={{color: Colors.mutedText}} selectedTextStyle={{color: Colors.text}} containerStyle={{backgroundColor: Colors.card}} />

      <Text style={styles.label}>Payment Method</Text>
      <Dropdown style={styles.dropdown} data={methods} labelField="label" valueField="value" value={paymentMethod} onChange={item => setPaymentMethod(item.value)} selectedTextStyle={{color: Colors.text}} containerStyle={{backgroundColor: Colors.card}} />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.dateBox} onPress={() => setShowDate(true)}>
        <Text style={{ color: Colors.text }}>{date.toDateString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal isVisible={showDate} mode="date" onConfirm={(d) => { setDate(d); setShowDate(false); }} onCancel={() => setShowDate(false)} />

      <View style={{ flexDirection: 'row', gap: 15, marginTop: 20 }}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.card, flex: 1 }]} onPress={handleDelete}>
          <Trash2 color={Colors.danger} size={20} />
          <Text style={{ color: Colors.danger, fontWeight: 'bold', marginLeft: 8 }}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.primary, flex: 2 }]} onPress={handleUpdate}>
          <Save color={Colors.background} size={20} />
          <Text style={{ color: Colors.background, fontWeight: 'bold', marginLeft: 8 }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center' },
  label: { color: Colors.mutedText, marginBottom: 8, fontSize: 12, textTransform: 'uppercase' },
  amountInput: { color: Colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 20, borderBottomWidth: 1, borderColor: Colors.border },
  dropdown: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, marginBottom: 20 },
  dateBox: { backgroundColor: Colors.card, padding: 16, borderRadius: 12, marginBottom: 20 },
  btn: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
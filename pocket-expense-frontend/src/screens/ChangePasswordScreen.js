import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Lock, Eye, EyeOff, ChevronLeft } from "lucide-react-native";
import API from "../services/api";
import { Colors } from "../themes/colors";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [secure, setSecure] = useState(true);

  const handleChange = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return Alert.alert("Error", "Please fill all fields");
    }
    if (newPass !== confirmPass) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      await API.post("/auth/change-password", {
        oldPassword: oldPass,
        newPassword: newPass
      });
      Alert.alert("Success", "Password updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ChevronLeft color={Colors.text} size={28} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Update Password</Text>
        <Text style={styles.subtitle}>Ensure your account stays secure</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Lock color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput
            placeholder="Current Password"
            placeholderTextColor={Colors.mutedText}
            secureTextEntry={secure}
            style={styles.input}
            onChangeText={setOldPass}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput
            placeholder="New Password"
            placeholderTextColor={Colors.mutedText}
            secureTextEntry={secure}
            style={styles.input}
            onChangeText={setNewPass}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor={Colors.mutedText}
            secureTextEntry={secure}
            style={styles.input}
            onChangeText={setConfirmPass}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? <EyeOff color={Colors.mutedText} size={20} /> : <Eye color={Colors.mutedText} size={20} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleChange}>
          <Text style={styles.submitText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 20 },
  header: { marginBottom: 40 },
  title: { color: Colors.text, fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: Colors.mutedText, fontSize: 16, marginTop: 5 },
  form: { gap: 20 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    borderRadius: 15, 
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: Colors.text, fontSize: 16 },
  submitBtn: { 
    backgroundColor: Colors.primary, 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },
  submitText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});
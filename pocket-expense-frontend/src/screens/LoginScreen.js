import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useContext, useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react-native";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../themes/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "All fields required");
    try {
      const res = await API.post("/auth/login", { email, password });
      await login(res.data.token);
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.message || "Check your credentials");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.inputContainer}>
        <Mail color={Colors.mutedText} size={20} style={{ marginRight: 10 }} />
        <TextInput 
          placeholder="Email" placeholderTextColor={Colors.mutedText} 
          style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Lock color={Colors.mutedText} size={20} style={{ marginRight: 10 }} />
        <TextInput 
          placeholder="Password" placeholderTextColor={Colors.mutedText} 
          style={styles.input} value={password} onChangeText={setPassword} secureTextEntry 
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
        <LogIn color={Colors.background} size={20} style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.mutedText }}>Don't have an account? <Text style={{ color: Colors.primary }}>Sign Up</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { color: Colors.text, fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: Colors.mutedText, fontSize: 16, marginTop: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 12, padding: 15, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, color: Colors.text, fontSize: 16 },
  btn: { backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnText: { color: Colors.background, fontWeight: 'bold', fontSize: 18 }
});
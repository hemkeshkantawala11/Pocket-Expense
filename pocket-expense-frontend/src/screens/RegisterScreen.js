import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react-native";
import API from "../services/api";
import { Colors } from "../themes/colors";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Missing Details", "Please fill in all fields to create an account.");
    }

    try {
      setLoading(true);
      await API.post("/auth/register", { name, email, password });
      Alert.alert("Success", "Account created successfully! Please login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and start tracking your wealth</Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <User color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput 
            placeholder="Full Name" 
            placeholderTextColor={Colors.mutedText} 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Mail color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput 
            placeholder="Email Address" 
            placeholderTextColor={Colors.mutedText} 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Lock color={Colors.mutedText} size={20} style={styles.icon} />
          <TextInput 
            placeholder="Password" 
            placeholderTextColor={Colors.mutedText} 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.btn, loading && { opacity: 0.7 }]} 
          onPress={handleRegister} 
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Creating..." : "Sign Up"}</Text>
          {!loading && <ArrowRight color={Colors.background} size={20} style={{ marginLeft: 10 }} />}
        </TouchableOpacity>

        {/* Footer Link */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.footer}>
          <Text style={{ color: Colors.mutedText }}>Already have an account? <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Login</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  
  header: { marginBottom: 40 },
  title: { color: Colors.text, fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: Colors.mutedText, fontSize: 16, marginTop: 8 },

  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  icon: { marginRight: 12 },
  input: { flex: 1, color: Colors.text, fontSize: 16 },

  btn: { 
    backgroundColor: Colors.primary, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { color: Colors.background, fontWeight: 'bold', fontSize: 18 },

  footer: { marginTop: 25, alignItems: 'center' }
});
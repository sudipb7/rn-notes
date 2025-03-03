import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { useAuth } from "@/contexts/authContext";

export default function AuthScreen() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAuth() {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    let response;

    if (isRegistering) {
      response = await register(email, password);
    } else {
      response = await login(email, password);
    }

    if ("error" in response) {
      Alert.alert("Error", response.error);
      return;
    }

    router.replace("/notes");
  }

  return (
    <View className="flex-1 items-center justify-center p-5 bg-[#f8f9fa]">
      <Text className="text-3xl font-bold mb-5 text-[#333]">
        {isRegistering ? "Sign Up" : "Login"}
      </Text>

      {error ? (
        <Text className="text-red-500 mb-3 text-base">{error}</Text>
      ) : null}

      <TextInput
        className="w-full p-3 border border-[#ddd] rounded-lg mb-3 bg-white text-base"
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="w-full p-3 border border-[#ddd] rounded-lg mb-3 bg-white text-base"
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="none"
      />
      {isRegistering && (
        <TextInput
          className="w-full p-3 border border-[#ddd] rounded-lg mb-3 bg-white text-base"
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="none"
        />
      )}

      <TouchableOpacity
        onPress={handleAuth}
        className="bg-[#007bff] py-3 rounded-lg w-full items-center mt-2.5"
      >
        <Text className="text-white text-lg font-bold">
          {isRegistering ? "Sign Up" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering((prev) => !prev)}>
        <Text className="mt-2.5 text-[#007bff] text-base">
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

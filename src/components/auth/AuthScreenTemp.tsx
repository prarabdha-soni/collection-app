import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AuthScreenTempProps {
  onLogin: () => void;
}

export default function AuthScreenTemp({ onLogin }: AuthScreenTempProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FOS Field Hero</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          {/* Email input would go here in a real implementation */}
          <Text style={styles.inputLabel}>Email</Text>
        </View>
        
        <View style={styles.inputContainer}>
          {/* Password input would go here in a real implementation */}
          <Text style={styles.inputLabel}>Password</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
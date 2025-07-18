import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PatientDetailsScreen() {
  const router = useRouter();
  const { token} = useAuth();
  const { setToken } = useAuth();
  const [form, setForm] = useState({
    nickname: '',
    DateOfBirth: '',
    Address: '',
    Interests: '',
    caregiverName: '',
    caregiverPhone: '',
    caregiverEmail: ''
  });

  const handleSubmit = async () => {
    try {
        // Get basic signup info
        const pendingSignup = await AsyncStorage.getItem('pendingSignup');
        if (!pendingSignup) {
        Alert.alert('Error', 'Signup info missing. Please start again.');
        router.replace('/signup');
        return;
        }
        const signupData = JSON.parse(pendingSignup);

        // Merge with details form
        const payload = {
        ...signupData,
        ...form,
        interests: form.Interests ? form.Interests.split(',').map(i => i.trim()) : [],
        caregiver: {
            name: form.caregiverName,
            email: form.caregiverEmail
        }
        };

        const res = await fetch('http://192.168.56.1:3000/auth/patient-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
        await AsyncStorage.removeItem('pendingSignup');
        await setToken(data.token, data.user);
        Alert.alert('Details Saved', 'Your profile has been created.');
        router.replace('/(tabs-patient)');
        } else {
        Alert.alert('Error', data.message || 'Could not save details');
        }
    } catch (err) {
        console.log(err);
        Alert.alert('Error', 'Could not connect to server');
    }
    };

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Complete Your Profile</Text>
      <TextInput placeholder="Nickname" value={form.nickname} onChangeText={v => setForm(f => ({ ...f, nickname: v }))} style={{ marginBottom: 12 }} />
      <TextInput placeholder="Date of Birth" value={form.DateOfBirth} onChangeText={v => setForm(f => ({ ...f, DateOfBirth: v }))} style={{ marginBottom: 12 }} />
      <TextInput placeholder="Address" value={form.Address} onChangeText={v => setForm(f => ({ ...f, Address: v }))} style={{ marginBottom: 12 }} />
      <TextInput placeholder="Interests (comma separated)" value={form.Interests} onChangeText={v => setForm(f => ({ ...f, Interests: v }))} style={{ marginBottom: 12 }} />
      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Caregiver Information</Text>
      <TextInput placeholder="Caregiver Name" value={form.caregiverName} onChangeText={v => setForm(f => ({ ...f, caregiverName: v }))} style={{ marginBottom: 12 }} />
      <TextInput placeholder="Caregiver Phone" value={form.caregiverPhone} onChangeText={v => setForm(f => ({ ...f, caregiverPhone: v }))} style={{ marginBottom: 12 }} />
      <TextInput placeholder="Caregiver Email" value={form.caregiverEmail} onChangeText={v => setForm(f => ({ ...f, caregiverEmail: v }))} style={{ marginBottom: 12 }} />
      <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#8B5A9F', padding: 16, borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
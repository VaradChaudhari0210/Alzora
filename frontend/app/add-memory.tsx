import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@hooks/useAuth';

export default function AddMemoryScreen() {
  const [type, setType] = useState<'image' | 'audio' | 'video' | 'text'>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuth();

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: type === 'image'
        ? 'image/*'
        : type === 'audio'
        ? 'audio/*'
        : type === 'video'
        ? 'video/*'
        : '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;
    setFile(result.assets[0]);
  };
  console.log(file);

  const handleSubmit = async () => {
    if (!title || !description || (type !== 'text' && !file)) {
      Alert.alert('Please fill all fields and select a file.');
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('description', description);

      if (type !== 'text' && file) {
        formData.append('file', {
          uri: file.uri,
          name: file.name || `memory.${type}`,
          type: file.mimeType,
        } as any);
      }

      await fetch('http://192.168.56.1:3000/memory/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // DO NOT set Content-Type
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Memory uploaded successfully!');
        setTitle('');
        setDescription('');
        setFile(null);
        router.back();
      } else {
        Alert.alert('Upload Failed', data.message || 'Could not upload memory');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Add New Memory</Text>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          {['image', 'audio', 'video', 'text'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => {
                setType(t as any);
                setFile(null);
              }}
            >
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Memory Title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Describe this memory"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {type !== 'text' && (
          <>
            <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Text style={styles.uploadButtonText}>
                {file ? 'Change File' : `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </Text>
            </TouchableOpacity>
            {file && (
              <View style={{ marginBottom: 16 }}>
                {type === 'image' ? (
                  <Image source={{ uri: file.uri }} style={{ width: 120, height: 120, borderRadius: 8 }} />
                ) : (
                  <Text style={{ color: '#8B5A9F' }}>{file.name}</Text>
                )}
              </View>
            )}
          </>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Memory</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 24 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#8B5A9F' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#111827' },
  typeRow: { flexDirection: 'row', marginBottom: 16 },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#8B5A9F',
    borderColor: '#8B5A9F',
  },
  typeButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  uploadButton: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#8B5A9F',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8B5A9F',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function NewNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const contentInputRef = useRef<TextInput>(null);

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      const storedNotes = await AsyncStorage.getItem("@notes_data");
      const currentNotes = storedNotes ? JSON.parse(storedNotes) : [];

      const newNote = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        creation_date: new Date().toISOString(),
      };

      const updatedNotes = [newNote, ...currentNotes];
      await AsyncStorage.setItem("@notes_data", JSON.stringify(updatedNotes));

      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9DF]">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#EBE8C4]">
        <Button
          variant="ghost"
          size="sm"
          className="flex-row items-center gap-1 active:bg-[#EBE8C4]/60"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#E89951" />
          <Text className="text-[#E89951] font-semibold text-base">Cancel</Text>
        </Button>
        
        <Text className="text-slate-800 font-bold text-lg">New Note</Text>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={!title.trim() || isSaving}
          className="active:bg-[#EBE8C4]/60"
          onPress={handleSave}
        >
          <Text
            className={`font-semibold text-base ${
              title.trim() ? "text-[#E89951]" : "text-slate-400"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Button>
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
          <TextInput
            placeholder="Title"
            placeholderTextColor="#C6C09D"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            returnKeyType="next"
            onSubmitEditing={() => contentInputRef.current?.focus()}
            className="text-2xl font-bold text-slate-800 mb-4 p-0"
            autoFocus
          />
          
          <TextInput
            ref={contentInputRef}
            placeholder="Start typing your note here..."
            placeholderTextColor="#D2CCAA"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            className="text-base text-slate-700 min-h-[300px] p-0 leading-6"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

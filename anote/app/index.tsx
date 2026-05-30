import "@styles/global.css";
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Alert
} from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus, Trash2, Pencil, Search, FileText, X } from "lucide-react-native";
import { Button } from "@components/ui/button";
import { Text } from "@components/ui/text";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  creation_date: Date;
  title: string;
  content: string;
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNoteIds, setExpandedNoteIds] = useState<Record<string, boolean>>({});

  // Load notes whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const storedNotes = await AsyncStorage.getItem("@notes_data");
          if (storedNotes) {
            const parsed = JSON.parse(storedNotes).map((note: any) => ({
              ...note,
              creation_date: new Date(note.creation_date),
            }));
            setNotes(parsed);
          } else {
            setNotes([]);
          }
        } catch (error) {
          console.error("Error loading notes:", error);
        }
      };

      loadNotes();
    }, [])
  );

  const toggleExpand = (id: string) => {
    setExpandedNoteIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to permanently delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedNotes = notes.filter((note) => note.id !== id);
              setNotes(updatedNotes);
              await AsyncStorage.setItem("@notes_data", JSON.stringify(updatedNotes));
            } catch (error) {
              console.error("Error deleting note:", error);
            }
          },
        },
      ]
    );
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderNoteItem = ({ item }: { item: Note }) => {
    const isExpanded = !!expandedNoteIds[item.id];

    return (
      <Pressable onPress={() => toggleExpand(item.id)} className="active:opacity-95">
        <Card className="bg-[#A5CF83] border-0 mb-4 rounded-2xl shadow-md">
          <CardHeader className="pb-2">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <CardTitle className="text-slate-800 text-lg font-bold leading-tight">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-[#4E5B3D] text-xs mt-1">
                  {item.creation_date.toLocaleDateString()}
                </CardDescription>
              </View>
              
              <View className="flex-row items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full active:bg-[#91B872] items-center justify-center mr-1"
                  onPress={(e) => {
                    e.stopPropagation(); // Avoid triggering card toggle
                    router.push(`/edit/${item.id}`);
                  }}
                >
                  <Pencil size={16} color="#3E4A2B" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full active:bg-[#91B872] items-center justify-center"
                  onPress={(e) => {
                    e.stopPropagation(); // Avoid triggering card toggle
                    handleDelete(item.id);
                  }}
                >
                  <Trash2 size={16} color="#3E4A2B" />
                </Button>
              </View>
            </View>
          </CardHeader>
          
          {item.content ? (
            <CardContent className="pb-5 pt-1">
              <Text
                numberOfLines={isExpanded ? undefined : 2}
                className="text-slate-700 text-sm leading-relaxed"
              >
                {item.content}
              </Text>
            </CardContent>
          ) : null}
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF9DF]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Main Container */}
      <View className="flex-1 px-6 pt-4">
        
        {/* Elegant Header */}
        <View className="flex-row justify-between items-baseline mb-6">
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">notas</Text>
          <Text className="text-sm font-bold text-[#E89951]">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-[#F3F0CE] rounded-xl px-3 py-2 mb-6">
          <Search size={18} color="#E89951" className="mr-2" />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#C1BA93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-slate-800 text-base p-0"
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <X size={18} color="#E89951" />
            </Pressable>
          ) : null}
        </View>

        {/* List or Empty State */}
        {filteredNotes.length > 0 ? (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center pb-24">
            <FileText size={64} color="#DCD7B1" className="mb-4" />
            <Text className="text-[#A29A72] font-bold text-lg text-center">
              {notes.length === 0 ? "No notes yet" : "No results found"}
            </Text>
            <Text className="text-[#BCB693] text-sm text-center mt-2 max-w-[240px]">
              {notes.length === 0
                ? "Tap the plus button below to create your very first note."
                : "Try searching for a different keyword or phrase."}
            </Text>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <View className="absolute bottom-8 right-6">
        <Button
          className="bg-[#E89951] active:bg-[#D5843C] h-16 w-16 rounded-full shadow-lg shadow-[#E89951]/20 items-center justify-center"
          onPress={() => router.push("/new")}
        >
          <Plus size={28} color="#f8fafc" />
        </Button>
      </View>
    </SafeAreaView>
  );
}

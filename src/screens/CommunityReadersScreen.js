import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/Feather";

const Tab = createMaterialTopTabNavigator();

// Dummy Data
const discussions = [
  {
    id: "1",
    username: "FaithfulOne",
    time: "2h ago",
    text: "Today’s devotion really blessed me!",
  },
  {
    id: "2",
    username: "PrayerWarrior",
    time: "5h ago",
    text: "Let’s pray for the youth of this generation.",
  },
];

const testimonies = [
  {
    id: "1",
    username: "BlessedSis",
    time: "1d ago",
    type: "text",
    content: "God healed me completely!",
  },
  {
    id: "2",
    username: "BrotherPaul",
    time: "3d ago",
    type: "video",
    content: "video_url_placeholder",
  },
];

// Comment & Discuss Tab
function CommentDiscuss() {
  const [input, setInput] = useState("");

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.username} • {item.time}
      </Text>
      <Text style={styles.cardText}>{item.text}</Text>
      <View style={styles.cardActions}>
        <Icon name="heart" size={18} />
        <Icon name="message-circle" size={18} style={styles.iconSpacing} />
        <Icon name="share" size={18} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What’s on your heart today?"
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.postText}>Post</Text>
      </TouchableOpacity>

      <FlatList
        data={discussions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

// Testify Jesus Tab
function TestifyJesus() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.username} • {item.time}
      </Text>
      {item.type === "text" ? (
        <Text style={styles.cardText}>{item.content}</Text>
      ) : (
        <Text style={styles.cardText}>🎥 Video testimony: {item.content}</Text>
      )}
      <View style={styles.cardActions}>
        <Icon name="heart" size={18} />
        <Icon name="message-circle" size={18} style={styles.iconSpacing} />
        <Icon name="share" size={18} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.testifyButtons}>
        <TouchableOpacity style={styles.testifyBtn}>
          <Text style={styles.testifyText}>📤 Upload Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testifyBtn}>
          <Text style={styles.testifyText}>🎥 Record Yourself</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testifyBtn}>
          <Text style={styles.testifyText}>✍️ Share Written</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={testimonies}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

// Main Screen with Tabs
export default function CommunityReadersScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Comment & Discuss" component={CommentDiscuss} />
      <Tab.Screen name="Testify Jesus" component={TestifyJesus} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F3F9FF",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: "#007bff",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  postText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 15,
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: "row",
    gap: 15,
  },
  iconSpacing: {
    marginHorizontal: 15,
  },
  testifyButtons: {
    marginBottom: 10,
  },
  testifyBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  testifyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

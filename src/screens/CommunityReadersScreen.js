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
  Dimensions,
  StatusBar,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/Feather";
import BackgroundCard from "../component/BackgroundCards";
import { imageStore } from "../imageStore/allImages";
import BackButton from "../component/backButton";

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
    <View style={styles.container}>
      <FlatList
        data={discussions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="What’s on your heart today?"
              value={input}
              multiline
              textAlignVertical="top"
              onChangeText={setInput}
            />
            <TouchableOpacity style={styles.postButton}>
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
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
    <View style={styles.container}>
      <FlatList
        data={testimonies}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.introContainer}>
              <Text style={styles.headerText}>
                "And they overcame him by the blood of the Lamb, and by the word
                of their testimony."
              </Text>
              <Text style={styles.subHeaderText}>— Revelation 12:11</Text>
              <Text style={styles.promptText}>
                What has the Lord done for you that can encourage someone today?
              </Text>
              <Text style={styles.callToActionText}>
                Share your testimony and inspire others to believe!
              </Text>
            </View>

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
          </>
        }
      />
    </View>
  );
}

// Main Screen with Tabs
export default function CommunityReadersScreen() {
  return (
    <View style={styles.MainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <BackgroundCard
        source={imageStore.CommunityHeaderImage}
        style={styles.imG}
      >
        <BackButton />
      </BackgroundCard>
      <View style={{ flex: 1 }}>
        <Tab.Navigator>
          <Tab.Screen name="Discussion" component={CommentDiscuss} />
          <Tab.Screen name="Testify Jesus" component={TestifyJesus} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 16,
  },

  MainContainer: {
    flex: 1,
    backgroundColor: "#F3F9FF",
  },
  imG: {
    height: height * 0.17,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minHeight: height * 0.1,
    maxHeight: height * 0.4,
    width: width * 0.7,
    textAlignVertical: "top", // makes text start from the top
  },
  introContainer: {
    marginVertical: 10,
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

  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ff008c",
    textAlign: "justify",
    marginBottom: 5,
    lineHeight: 24,
  },
  subHeaderText: {
    fontSize: 14,
    color: "#888",
    textAlign: "left",
    marginBottom: 20,
  },
  promptText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
    fontStyle: "italic",
  },
  callToActionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginVertical: 15,
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

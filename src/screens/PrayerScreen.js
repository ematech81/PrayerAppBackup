import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  useColorScheme,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import DummyPrayer from "../constant/DummyPrayer";
import { imageStore } from "../imageStore/allImages";
import BackgroundCard from "../component/BackgroundCards";
import BackButton from "../component/backButton";

const PrayerScreen = () => {
  const categories = [...new Set(DummyPrayer.map((item) => item.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const isDark = useColorScheme() === "dark";

  const topics = DummyPrayer.filter(
    (item) =>
      item.category === selectedCategory &&
      item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load favorites from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("favorites").then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const handleFavorite = async (topicId) => {
    const updated = favorites.includes(topicId)
      ? favorites.filter((id) => id !== topicId)
      : [...favorites, topicId];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryItem,
        selectedCategory === category && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderTopicItem = ({ item, index }) => {
    const backgroundColor = topicColors[index % topicColors.length]; // Cycle through colors
    return (
      <TouchableOpacity
        style={[
          styles.topicItem,
          { backgroundColor },
          isDark && { backgroundColor: "#333" }, // override if dark mode
        ]}
        onPress={() => navigation.navigate("GeneratedScreen", { topic: item })}
      >
        <Text style={[styles.topicText, isDark && { color: "#fff" }]}>
          {item.topic}
        </Text>
      </TouchableOpacity>
    );
  };

  const topicColors = [
    "#1e2572",
    "#321033",
    "#004d40",
    "#5d1049",
    "#3e2723",
    "#1565c0",
    "#4527a0",
    "#004d40",
    "#03c988",
    "#3dc1ee",
    // "#ee6a3d",
  ];

  const navigation = useNavigation();

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#000" }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <BackgroundCard source={imageStore.PrayerPointHeaderImage}>
        <BackButton />
      </BackgroundCard>
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={renderTopicItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.topicList}
        ListHeaderComponent={
          <>
            <Text style={[styles.title, isDark && { color: "#fff" }]}>
              Get personalized prayer point for any life situation
            </Text>

            <TextInput
              placeholder="Search topic..."
              placeholderTextColor={isDark ? "#888" : "#666"}
              style={[
                styles.searchBar,
                isDark && { backgroundColor: "#f3f3f3", color: "#f3f3f3" },
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.categSubHeading}>
              <Text style={styles.categSubHeadingText}>Select Category</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
            >
              {categories.map(renderCategoryItem)}
            </ScrollView>

            <Text
              style={{ paddingLeft: 10, marginBottom: 10, fontWeight: 600 }}
            >
              Search By Topics
            </Text>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#6f7688",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#f1f1f1",
    // elevation: 3,
  },

  categoryList: {
    marginBottom: 24,
    paddingVertical: 6, // Add padding for better spacing
    // backgroundColor: "",
    height: 100, // Increased height for better visibility
  },
  categSubHeading: {
    marginVertical: 8,
    padding: 10,
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "red",
  },
  categSubHeadingText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
    color: "#1e2572",
  },
  categoryItem: {
    paddingVertical: 1, // Increased for touch-friendly size
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#eee",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 50,
  },
  selectedCategory: {
    color: "#1e2572",
  },
  categoryText: {
    color: "#1e2572",
    fontWeight: "bold",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#ff008c",
    fontWeight: "bold",
    fontSize: 14,
  },
  topicList: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },

  topicText: {
    fontSize: 14,
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
  },

  topicItem: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    flexWrap: "wrap",
  },
});

export default PrayerScreen;

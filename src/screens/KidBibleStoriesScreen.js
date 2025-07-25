import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BibleStoriesDB } from "../ChildrenBibleDatabase/bibleSToriesData";
import BackButton from "../component/backButton";
import BackgroundCard from "../component/BackgroundCards";
import { imageStore } from "../imageStore/allImages";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function KidBibleStoriesScreen() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <TouchableOpacity
        style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 40 }}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={30} color="#ff008c" />
      </TouchableOpacity>
      <ScrollView style={styles.srollViewcontainer}>
        <View
          style={{
            width: SCREEN_WIDTH,
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <Text style={styles.title}>Bible Stories</Text>
        </View>

        {BibleStoriesDB.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.card}
            onPress={() => navigation.navigate("StoryDetailsScreen", { story })}
          >
            <Image source={story.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{story.title}</Text>
              <Text style={styles.cardDescription}>
                {story.shortDescription}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (isDarkMode) => {
  const backgroundColor = isDarkMode ? "#121212" : "#FFF8F0";
  const textColor = isDarkMode ? "#ffffff" : "#333333";
  const cardBg = isDarkMode ? "#1E1E1E" : "#FFF";
  const baseFontSize = Platform.OS === "ios" ? 16 : 15;
  const cardWidth = SCREEN_WIDTH - 32;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    srollViewcontainer: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 16,
      color: textColor,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      width: cardWidth,
      alignSelf: "center",
    },
    image: {
      width: "100%",
      height: SCREEN_WIDTH * 0.7,
    },
    cardContent: {
      padding: 12,
    },
    cardTitle: {
      fontSize: baseFontSize + 4,
      fontWeight: "700",
      marginBottom: 4,
      color: textColor,
    },
    cardDescription: {
      fontSize: baseFontSize,
      color: textColor,
    },
  });
};

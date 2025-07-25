import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { BibleFactDB } from "../ChildrenBibleDatabase/BibleFactDB";
import BackButton2 from "../component/BackButton2";

const { width } = Dimensions.get("window");

// Sample BibleFactDB (replace with your actual import)

const BibleFactScreen = () => {
  const renderFactCard = ({ item }) => (
    <View style={styles.card}>
      {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.fact}>{item.fact}</Text>
    </View>
  );

  return (
    <View contentContainerStyle={styles.container}>
      <BackButton2 />
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <Text style={styles.header}>📖 Fun Bible Facts for Kids!</Text>
      <FlatList
        data={BibleFactDB}
        renderItem={renderFactCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
        // ListEmptyComponent={}
      />
    </View>
  );
};

export default BibleFactScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8b9e6ff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#FF7A00",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: width - 64,
    height: 200,
    resizeMode: "contain",
    borderRadius: 12,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
    marginTop: 10,
    textAlign: "center",
  },
  fact: {
    fontSize: 17,
    color: "#ff008c",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 10,
    fontWeight: "600",
  },
});

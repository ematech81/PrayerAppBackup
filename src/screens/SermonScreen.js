import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const dummySermons = [
  {
    id: "1",
    title: "The Power of Prayer",
    preacher: "Pastor John Smith",
    //     thumbnail: require("../assets/sermon1.jpg"),
    videoId: "dQw4w9WgXcQ", // Replace with real YouTube ID
  },
  {
    id: "2",
    title: "Faith Over Fear",
    preacher: "Rev. Jane Doe",
    //     thumbnail: require("../assets/sermon2.jpg"),
    videoId: "C0DPdy98e4c",
  },
];

const SermonScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSermons, setFilteredSermons] = useState(dummySermons);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = dummySermons.filter((sermon) =>
      sermon.preacher.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSermons(filtered);
  };

  const openSermon = (sermon) => {
    setSelectedSermon(sermon);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sermons</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Search by preacher"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredSermons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sermonList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sermonCard}
            onPress={() => openSermon(item)}
          >
            {/* <Image source={item.thumbnail} style={styles.thumbnail} /> */}
            <View style={styles.sermonInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.preacher}>{item.preacher}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Sermon */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>

          {selectedSermon && (
            <>
              <Text style={styles.modalTitle}>{selectedSermon.title}</Text>
              <YoutubePlayer
                height={220}
                play={true}
                videoId={selectedSermon.videoId}
              />
              <Text style={styles.modalPreacher}>
                by {selectedSermon.preacher}
              </Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SermonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  sermonList: {
    paddingBottom: 80,
  },
  sermonCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  sermonInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  preacher: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalPreacher: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  closeBtn: {
    alignSelf: "flex-end",
  },
});

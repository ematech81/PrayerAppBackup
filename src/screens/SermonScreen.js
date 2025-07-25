import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";
import BackButton2 from "../component/BackButton2";
import StatusBarComponent from "../component/StatusBarComponent";
import he from "he";
import { fetchDefaultSermons, searchSermons } from "../utils/apiService";

const API_KEY = "AIzaSyBnFFG6FByM4wgmUx7ZscbezehgvbDFYPU"; // Replace with your real key
const SERMON_QUERY = "gospel sermons"; // Customize as needed

const SermonScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sermons, setSermons] = useState([]);
  const [filteredSermons, setFilteredSermons] = useState([]);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Initial fetch
  useEffect(() => {
    const loadSermons = async () => {
      try {
        const data = await fetchDefaultSermons();

        const formatted = data.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          preacher: item.snippet.channelTitle,
          videoId: item.id.videoId,
        }));

        setSermons(formatted);
        setFilteredSermons(formatted);
      } catch (error) {
        console.error("Error loading sermons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSermons();
  }, []);

  // ✅ Live search with external API
  const handleSearch = async (text) => {
    setSearchQuery(text);

    if (!text.trim()) {
      setFilteredSermons(sermons); // Reset to default list
      return;
    }

    try {
      const results = await searchSermons(text);

      const formatted = results.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        preacher: item.snippet.channelTitle,
        videoId: item.id.videoId,
      }));

      setFilteredSermons(formatted);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const openSermon = (sermon) => {
    setSelectedSermon(sermon);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBarComponent />
      <BackButton2 style={{ color: "#000" }} />
      <View style={{ padding: 16 }}>
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
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredSermons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sermonList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openSermon(item)}>
              <View style={styles.sermonCardRow}>
                <Image
                  source={{
                    uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
                  }}
                  style={styles.thumbnail}
                />
                <View style={styles.sermonInfo}>
                  <Text style={styles.title}>{he.decode(item.title)}</Text>
                  <Text style={styles.preacher}>{item.preacher}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for Sermon */}
      <Modal visible={modalVisible} animationType="fade">
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>

          {selectedSermon && (
            <>
              <Text style={styles.modalTitle}>
                {he.decode(selectedSermon.title)}
              </Text>
              <View>
                <YoutubePlayer
                  height={220}
                  width={width}
                  play={true}
                  videoId={selectedSermon.videoId}
                />
                <Text style={styles.modalPreacher}>
                  by {selectedSermon.preacher}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SermonScreen;

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#ff008c",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  sermonCardRow: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 10,
    marginBottom: 6,
    minHeight: height * 0.15,
    padding: 8,
    backgroundColor: "#f5daeeff",
  },

  thumbnail: {
    width: width * 0.37,
    minHeight: height * 0.15,
  },

  modalThumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },

  sermonInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  preacher: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  modalContent: {
    flex: 1,
    paddingTop: 50,
    // backgroundColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    paddingLeft: 16,
  },
  modalPreacher: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    paddingLeft: 16,
  },
  closeBtn: {
    alignSelf: "flex-end",
    paddingRight: 16,
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBible } from "../contex/BibleContext";

const palette = [
  { backgroundColor: "#2e02f6ff" },
  { backgroundColor: "#08e00fff" },
  { backgroundColor: "#09a0e0ff" },
  { backgroundColor: "#d50694ff" },
];
// palette[i % palette.length];

const PrayerPoint = () => {
  const navigation = useNavigation();
  const { getDailyTopics } = useBible();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setTopics(getDailyTopics());
  }, [getDailyTopics]);

  const openPrayerScreen = (id, name) => {
    navigation.navigate("Prayer", { topicId: id, topicName: name });
  };

  return (
    <View style={styles.prayerContainer}>
      {/* heading */}
      <View style={styles.containerWrapper}>
        <View style={styles.prayerPointContainer}>
          <View style={styles.bullet} />
          <Text style={styles.prayerPointHeading}>Prayer Point</Text>
        </View>

        <Pressable onPress={() => navigation.navigate("PrayerGenerator")}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <Text style={styles.textInstruction}>
        Select any topic to generate Prayer Points
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.row}>
          {topics.map((t, i) => (
            <Pressable
              key={t._id}
              onPress={() => openPrayerScreen(t._id, t.topic)}
            >
              <View style={[styles.box]}>
                <Text style={styles.text}>{t.topic}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  prayerContainer: {
    marginBottom: 24,
    borderTopWidth: 2,
    borderStyle: "dotted",
    borderColor: "#ccc",
  },
  containerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerPointContainer: { flexDirection: "row", alignItems: "center" },
  bullet: {
    width: 10,
    height: 10,
    backgroundColor: "#3edc65",
    borderRadius: 100,
    marginRight: 6,
  },
  prayerPointHeading: { fontSize: 22, fontWeight: "700", color: "#fff" },
  seeAll: { color: "#ccc", fontSize: 14, paddingRight: 10 },
  textInstruction: { marginVertical: 8, color: "#fff" },
  scrollContainer: { paddingVertical: 4 },
  row: { flexDirection: "row", gap: 8 },
  box: {
    Width: "45%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    minHeight: 150,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  text: { fontSize: 14, fontWeight: "bold", color: "#ccc" },
});

export default PrayerPoint;

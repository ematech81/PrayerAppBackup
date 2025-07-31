import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const NEW_TESTAMENT_BOOKS = new Set([
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
]);

// Very small HTML decoder for common entities used by the API.
const decodeHTMLEntities = (str = "") =>
  str
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

// Parse the API's verse HTML which looks like: "... <span class=\"highlight\">love</span> ..."
const renderHighlightedVerse = (html) => {
  if (!html) return null;
  // Split on opening/closing highlight tags, preserve delimiters
  const tokens = html.split(/(<span class="highlight">|<\/span>)/g);
  let inHighlight = false;
  const pieces = [];

  tokens.forEach((tok, idx) => {
    if (tok === '<span class="highlight">') {
      inHighlight = true;
      return;
    }
    if (tok === "</span>") {
      inHighlight = false;
      return;
    }
    if (tok) {
      const text = decodeHTMLEntities(tok);
      pieces.push(
        <Text
          key={idx}
          style={inHighlight ? styles.highlight : styles.verseChunk}
        >
          {text}
        </Text>
      );
    }
  });

  return <Text style={styles.verseText}>{pieces}</Text>;
};

const getBookName = (bookObj = {}) => {
  // Try common fields that might exist on the API's book object
  return (
    bookObj.name ||
    bookObj.bookName ||
    bookObj.title ||
    bookObj.book ||
    bookObj.shortName ||
    bookObj.abbr ||
    "Unknown"
  );
};

const BibleSearchScreen = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ntCount, setNtCount] = useState(0);
  const [otCount, setOtCount] = useState(0);
  const [error, setError] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState({
    id: 2,
    abbreviation: "ASV",
    version: "American Standard Version",
  });

  const navigation = useNavigation();

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setItems([]);
    setNtCount(0);
    setOtCount(0);

    try {
      const res = await fetch(
        `https://bible-go-api.rkeplin.com/v1/search?query=${encodeURIComponent(
          q
        )}`
      );
      const data = await res.json();

      const newItems = Array.isArray(data?.items) ? data.items : [];
      setItems(newItems);

      // Count NT vs OT by book name
      let nt = 0,
        ot = 0;
      newItems.forEach((it) => {
        const name = getBookName(it.book);
        if (NEW_TESTAMENT_BOOKS.has(name)) nt++;
        else ot++;
      });
      setNtCount(nt);
      setOtCount(ot);
    } catch (e) {
      console.log("Search failed", e);
      setError("Unable to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePressResult = (item) => {
    const bookName = getBookName(item.book);
    const chapter = item.chapterId; // from API
    const verseNum = item.verseId; // from API

    navigation.navigate("VerseScreen", {
      selectedBook: bookName,
      selectedChapter: chapter,
      verses: [], // let VerseScreen fetch
      fromDailyReading: false,
      currentTranslation, // IMPORTANT: your VerseScreen requires this
      initialVerse: verseNum, // optional helper to scroll/highlight
      // You can pass more if your VerseScreen uses it
    });
  };

  const renderItem = ({ item }) => {
    const bookName = getBookName(item.book);
    const chapter = item.chapterId;
    const verseNum = item.verseId;

    return (
      <Pressable
        onPress={() => handlePressResult(item)}
        android_ripple={{ borderless: false }}
        style={({ pressed }) => [
          styles.resultItem,
          pressed && { opacity: 0.8 },
        ]}
        hitSlop={8}
      >
        <Text style={styles.verseReference}>
          {bookName} {chapter}:{verseNum}
        </Text>
        {renderHighlightedVerse(item.verse)}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bible Search</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter keyword (e.g., love, faith)"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : null}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {items.length > 0 && !loading && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Results found</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryChip}>New Testament {ntCount}</Text>
            <Text style={styles.summaryChip}>Old Testament {otCount}</Text>
            <Text style={styles.total}>Total {items.length}</Text>
          </View>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(it, idx) =>
          String(
            it.id ??
              `${getBookName(it.book)}-${it.chapterId}-${it.verseId}-${idx}`
          )
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  error: { color: "#b00020", marginTop: 12 },
  summaryBox: { marginTop: 12, marginBottom: 8 },
  summaryTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryChip: {
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 14,
  },
  total: { marginLeft: 8, fontSize: 14, color: "#333" },

  resultItem: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  verseReference: { fontWeight: "700", color: "#555", marginBottom: 6 },
  verseText: { fontSize: 15, lineHeight: 22, color: "#222", flexWrap: "wrap" },
  verseChunk: { fontSize: 15, lineHeight: 22 },
  highlight: {
    backgroundColor: "yellow",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 22,
  },
});

export default BibleSearchScreen;

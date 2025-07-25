import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { StoryQuizDB } from "../ChildrenBibleDatabase/BibleStoryQuizDB";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";

const StoryDetailScreen = () => {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showQuiz, setShowQuiz] = useState(false);
  //   const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});

  const route = useRoute();

  const { story } = route.params; // story = { title, image, fullText, keyVerse, lesson, quiz }

  const handleTakeQuiz = () => {
    // Filter quiz by the quizIds from the current story
    const filteredQuizzes = StoryQuizDB.filter((quiz) =>
      story.quizIds.includes(quiz.quizId)
    );
    setQuizList(filteredQuizzes);
    setShowQuiz(true);
  };

  const handleAnswer = (quizId, option) => {
    const quiz = quizList.find((q) => q.quizId === quizId);
    const isCorrect = option === quiz.answer;

    setSelectedAnswers((prev) => ({ ...prev, [quizId]: option }));
    setResults((prev) => ({ ...prev, [quizId]: isCorrect }));
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#fce2e2ff" }}
    >
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

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#121212" : "#fce2e2ff" },
        ]}
      >
        <Text style={[styles.title, { color: isDark ? "#fff" : "#222" }]}>
          {story.shortDescription}
        </Text>

        <Image source={story.image} style={styles.image} resizeMode="cover" />

        <Text
          style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
        >
          Full Story
        </Text>
        <Text style={[styles.text, { color: isDark ? "#ccc" : "#f880a9" }]}>
          {story.fullText}
        </Text>

        <Text
          style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
        >
          📖 Key Verse
        </Text>
        <Text
          style={[styles.verseText, { color: isDark ? "#b3e5fc" : "#0077b6" }]}
        >
          "{story.keyVerse}"
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#fff" : "#21069bff" },
          ]}
        >
          🧠 Lesson from the Story
        </Text>
        <Text style={[styles.text, { color: isDark ? "#ccc" : "#444" }]}>
          {story.lesson}
        </Text>

        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => {
            if (!showQuiz) {
              const filteredQuizzes = StoryQuizDB.filter((quiz) =>
                story.quizIds.includes(quiz.quizId)
              );
              setQuizList(filteredQuizzes);
            }
            setShowQuiz(!showQuiz);
          }}
        >
          <Text style={styles.quizButtonText}>
            {showQuiz ? "Hide Quiz" : "Take a Quiz"}
          </Text>
        </TouchableOpacity>
        {showQuiz && (
          <View style={{ marginTop: 20 }}>
            {quizList.map((quiz) => (
              <View key={quiz.quizId} style={{ marginBottom: 25 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {quiz.question}
                </Text>
                {quiz.options.map((option, index) => {
                  const isSelected = selectedAnswers[quiz.quizId] === option;
                  const isCorrect = results[quiz.quizId];
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleAnswer(quiz.quizId, option)}
                      disabled={!!selectedAnswers[quiz.quizId]}
                      style={{
                        padding: 10,
                        marginVertical: 5,
                        backgroundColor: isSelected
                          ? isCorrect
                            ? "#d4edda" // green
                            : "#f8d7da" // red
                          : "#f1f1f1",
                        borderRadius: 8,
                      }}
                    >
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
                {selectedAnswers[quiz.quizId] && (
                  <Text style={{ marginTop: 5 }}>
                    {results[quiz.quizId]
                      ? "🎉 Correct!"
                      : "❌ Oops, try again next time!"}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setShowQuiz(false)}
              style={{
                backgroundColor: "#ccc",
                padding: 12,
                borderRadius: 8,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <Text>Close Quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 26 : 24,
    fontWeight: "bold",
    marginVertical: 30,
    // textAlign: "justify",
  },
  image: {
    width: "100%",
    height: Platform.OS === "ios" ? 250 : 200,
    borderRadius: 12,
    marginBottom: 16,
    height: screenWidth * 0.8,
  },
  sectionTitle: {
    fontSize: Platform.OS === "ios" ? 22 : 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  text: {
    fontSize: 24,
    lineHeight: 33,
    fontStyle: "justify",
    color: "#f880a9",
    fontWeight: "bold",
  },
  verseText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  quizButton: {
    marginVertical: 20,
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  quizButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quizCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  answerOption: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  answerText: {
    fontSize: 16,
  },
  feedbackMessage: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    color: "#ff9800",
  },
  closeQuiz: {
    marginTop: 10,
    color: "#d32f2f",
    textAlign: "center",
    fontWeight: "600",
  },
  backButton: {
    width: screenWidth - 32,
    padding: 16,
    backgroundColor: "#555",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default StoryDetailScreen;

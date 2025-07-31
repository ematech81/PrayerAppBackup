// import { StyleSheet, Text, View, ImageBackground } from "react-native";
// import React from "react";
// import Foundation from "@expo/vector-icons/Foundation";
// import Entypo from "@expo/vector-icons/Entypo";
// import { LinearGradient } from "expo-linear-gradient";
// import { MotiView } from "moti";
// import { dailyVerses } from "../Database/DailyVerseDatabase";
// import { getTodayDayIndex } from "../utils/dateHelper";

// const DailyVerse = () => {
//   const todayIndex = getTodayDayIndex();
//   const todayVerse = dailyVerses.find((v) => v.day === todayIndex);
//   console.log("daily info", todayIndex, todayVerse);

//   if (!todayVerse) {
//     return (
//       <View style={styles.dailyVerseContainer}>
//         <Text style={styles.textHeading}>Daily Verse</Text>
//         <Text style={styles.verseText}>
//           Today's Verse is not available yet.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         borderWidth: 0.5,
//         padding: 10,
//         borderColor: "#ccc",
//         marginTop: 10,
//       }}
//     >
//       {/* // <LinearGradient
//     //   colors={["#FFDEE9", "#B5FFFC"]}
//     //   style={styles.dailyVerseContainer}
//     //   start={{ x: 0, y: 0 }}
//     //   end={{ x: 1, y: 1 }}
//     // > */}
//       {/* <ImageBackground source={require("../assets/verseHeader.jpg")}> */}
//       <View style={styles.innerContainer}>
//         {/* <View style={styles.verseDesign}></View> */}

//         <View style={styles.verseContent}>
//           <View style={styles.verseContainer}>
//             <Text style={styles.textHeading}>Daily Verse</Text>
//             <Text style={styles.bookText}>{todayVerse.reference}</Text>
//           </View>

//           {/* 🎉 Animated Verse Text */}
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: "timing", duration: 700 }}
//           >
//             <Text style={styles.verseText}>
//               "{todayVerse.verse.toUpperCase()}"
//             </Text>
//           </MotiView>

//           <View style={styles.shareContainer}>
//             <Foundation name="like" size={22} color="#fff" />
//             <Entypo name="share" size={22} color="#ccc" />
//           </View>
//         </View>
//       </View>
//       {/* </ImageBackground> */}
//       {/* // </LinearGradient> */}
//     </View>
//   );
// };

import { StyleSheet, Text, View, TouchableOpacity, Share } from "react-native";
import React, { useEffect, useMemo } from "react";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { MotiView } from "moti";

import { dailyVerses } from "../Database/DailyVerseDatabase";
import { getTodayDayIndex } from "../utils/dateHelper";
import { useBible } from "../contex/BibleContext";

const DailyVerse = () => {
  const todayIndex = getTodayDayIndex();
  const todayVerse = dailyVerses.find((v) => v.day === todayIndex);

  const {
    userId,
    getVerseMetrics,
    prefetchLikeCount,
    toggleLike,
    recordShare,
  } = useBible();

  // Use the verse reference as the verseId (or use todayVerse.id if you have it)
  const verseId = useMemo(
    () => (todayVerse ? todayVerse.reference : null),
    [todayVerse]
  );

  // In DailyVerse.js
  useEffect(() => {
    console.log(
      "[DailyVerse] todayIndex:",
      todayIndex,
      "todayVerse:",
      todayVerse
    );
  }, [todayIndex, todayVerse]);

  useEffect(() => {
    console.log("[DailyVerse] verseId:", verseId);
    if (verseId) prefetchLikeCount(verseId);
  }, [verseId]);

  // Prefetch like count on mount / when verseId changes
  useEffect(() => {
    if (verseId) prefetchLikeCount(verseId);
  }, [verseId]);

  if (!todayVerse) {
    return (
      <View style={styles.dailyVerseContainer}>
        <Text style={styles.textHeading}>Daily Verse</Text>
        <Text style={styles.verseText}>
          Today's Verse is not available yet.
        </Text>
      </View>
    );
  }

  const metrics = getVerseMetrics(verseId);
  console.log("[DailyVerse] metrics:", verseId, metrics);
  const liked = metrics.liked || false;
  const likes = metrics.likes ?? 0;
  const shares = metrics.shares ?? 0;

  const onLikePress = () => {
    console.log("[UI] Like pressed", { verseId });
    if (!userId) return; // optional guard until userId loads
    toggleLike(verseId);
  };

  const onSharePress = async () => {
    console.log("[UI] Share pressed", { verseId });
    try {
      const message = `${todayVerse.verse}\n— ${todayVerse.reference}`;
      const result = await Share.share({ message });
      if (result.action === Share.sharedAction) {
        // Count only successful shares
        recordShare(verseId, "system");
      }
    } catch (e) {
      // ignore for UX
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerContainer}>
        <View style={styles.verseContent}>
          <View style={styles.verseContainer}>
            <Text style={styles.textHeading}>Daily Verse</Text>
            <Text style={styles.bookText}>{todayVerse.reference}</Text>
          </View>

          {/* 🎉 Animated Verse Text */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 700 }}
          >
            <Text style={styles.verseText}>
              "{todayVerse.verse.toUpperCase()}"
            </Text>
          </MotiView>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onLikePress}
              style={styles.actionBtn}
              disabled={!userId}
            >
              <Foundation
                name="like"
                size={22}
                color={liked ? "#ff3366" : "#fff"}
              />
              <Text style={styles.actionText}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSharePress} style={styles.actionBtn}>
              <Entypo name="share" size={22} color="#ccc" />
              <Text style={styles.actionText}>{shares}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DailyVerse;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 0.5,
    padding: 10,
    borderColor: "#ccc",
    marginTop: 10,
  },
  dailyVerseContainer: {
    borderRadius: 10,
    marginHorizontal: 2,
    marginTop: 10,
    padding: 10,
    elevation: 3,
    minHeight: 150,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // minHeight: 150,
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2 )",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
  },
  verseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  bookText: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "bold",
    fontStyle: "italic",
    lineHeight: 22,
    marginRight: 10,
  },
  verseDesign: {
    width: 4,
    minHeight: 150,
    backgroundColor: "#3edc65",
    borderRadius: 3,
    marginRight: 12,
    marginVertical: "auto",
  },
  verseContent: {
    flex: 1,
  },
  textHeading: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#14314f",
    color: "#FF5722",
    marginBottom: 6,
  },
  verseText: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 25,
    textAlign: "justify",
    fontWeight: "bold",
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 50,
  },
});

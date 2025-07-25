import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const BackButton2 = ({ style }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="arrowleft" size={30} color="#ff008c" />
    </TouchableOpacity>
  );
};

export default BackButton2;

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 40,
  },
});

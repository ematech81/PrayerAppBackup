import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.arrowBack}
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="arrowleft" size={30} color="#ff008c" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  arrowBack: {
    //     marginTop: 30,
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

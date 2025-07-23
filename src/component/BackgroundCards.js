import React from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";

const BackgroundCard = ({ source, children, style, imageStyle }) => {
  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={[styles.image, style]}
      imageStyle={imageStyle}
    >
      {children}
    </ImageBackground>
  );
};

// const {width: SCREEN_WIDTH} = Dimensions.get("window");
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: height * 0.3,
    marginBottom: 20,
    justifyContent: "center",
  },
});

export default BackgroundCard;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  useColorScheme,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ApostlesDB } from "../ChildrenBibleDatabase/12ApostlesDB";
import BackgroundCard from "../component/BackgroundCards";
import { imageStore } from "../imageStore/allImages";
import BackButton from "../component/backButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ApostlesScreen() {
  const [modalVissible, setModalVisible] = React.useState(false);
  // const [selectedApostle, setSelectedApostle] = useState(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  const renderItem = ({ item }) => (
    // <TouchableOpacity
    //   key={item.id}
    //   style={styles.card}
    //   onPress={() => console.log(`Selected Apostle: ${item.name}`)}
    // >
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {/* <Text style={styles.symbol}>Symbol: {item.symbol}</Text> */}
    </View>
    // </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <BackgroundCard source={imageStore.ApostleHeaderImage}>
        <BackButton />
      </BackgroundCard>

      <FlatList
        data={ApostlesDB}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const getStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#ffffff" : "#333";
  const bgColor = isDarkMode ? "#121212" : "#FFF8F0";
  const cardBg = isDarkMode ? "#1e1e1e" : "#ffffff";
  const fontSize = Platform.OS === "ios" ? 16 : 15;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bgColor,
    },
    IMG: {
      width: "100%",
      height: SCREEN_WIDTH * 0.5,
      marginBottom: 16,
      marginTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: textColor,
      textAlign: "center",
    },
    list: {
      paddingBottom: 32,
      paddingTop: 16,
      paddingHorizontal: 2,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 12,
      padding: 10,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: "100%",
      height: SCREEN_WIDTH * 0.7,
      borderRadius: 12,
      marginBottom: 10,
      // resizeMode: "cover",
    },
    name: {
      fontSize: fontSize + 2,
      fontWeight: "bold",
      color: textColor,
    },
    description: {
      fontSize: fontSize,
      textAlign: "center",
      color: textColor,
      marginVertical: 6,
    },
    symbol: {
      fontSize: fontSize - 1,
      fontStyle: "italic",
      color: isDarkMode ? "#aaa" : "#555",
    },
  });
};

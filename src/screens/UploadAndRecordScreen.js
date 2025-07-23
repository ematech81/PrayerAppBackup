import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Video,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import { Video as ExpoVideo } from "expo-av";

export default function UploadAndRecordScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(
        cameraStatus.status === "granted" && mediaStatus.status === "granted"
      );
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      try {
        const videoRecordPromise = cameraRef.current.recordAsync({
          maxDuration: 300, // 5 minutes in seconds
          quality: Camera.Constants.VideoQuality["480p"],
        });

        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          setVideoUri(data.uri);
        }
      } catch (error) {
        console.warn(error);
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets[0]) {
      const { uri } = result.assets[0];
      setVideoUri(uri);
    }
  };

  const handlePost = () => {
    // Placeholder for posting logic
    Alert.alert("Testimony Posted", "Your video testimony has been submitted!");
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <ActivityIndicator />;
  }

  if (!hasPermission) {
    return <Text>No access to camera or media library</Text>;
  }

  return (
    <View style={styles.container}>
      {videoUri ? (
        <View style={styles.previewContainer}>
          <Text style={styles.heading}>Preview Testimony</Text>
          <ExpoVideo
            source={{ uri: videoUri }}
            rate={1.0}
            volume={1.0}
            resizeMode="cover"
            shouldPlay
            useNativeControls
            style={styles.video}
          />
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postText}>Post Testimony</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVideoUri(null)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Camera
            style={styles.camera}
            ref={cameraRef}
            type={Camera.Constants.Type.front}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.btn} onPress={pickVideo}>
              <Text style={styles.btnText}>📤 Upload Video</Text>
            </TouchableOpacity>
            {isRecording ? (
              <TouchableOpacity
                style={[styles.btn, styles.stopBtn]}
                onPress={stopRecording}
              >
                <Text style={styles.btnText}>⏹ Stop</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={startRecording}>
                <Text style={styles.btnText}>🎥 Start Recording</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "50%",
    marginTop: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  stopBtn: {
    backgroundColor: "#dc3545",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  video: {
    width: 300,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  postButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  postText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: 15,
    color: "#777",
    textDecorationLine: "underline",
  },
});

// const API = axios.create({
//   baseURL: "http://192.168.1.23:5000", // <- change this
//   timeout: 10000,
// });

// // Optional: simple interceptor logging (helps debugging)
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response) {
//       console.log("API error:", err.response.status, err.response.data);
//     } else {
//       console.log("API error:", err.message);
//     }
//     return Promise.reject(err);
//   }
// );

// src/api/client.js
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// CHANGE THIS to your computer's LAN IP if testing on a physical device:
const LAN_IP = "http://192.168.43.99:5000";

// Pick base URL per environment
const devBaseURL =
  Platform.select({
    ios: "http://localhost:5000",
    android: "http://10.0.2.2:5000",
  }) || LAN_IP;

// If you’re on a real device in dev, devBaseURL should be LAN_IP instead.
const BASE_URL = __DEV__ ? LAN_IP : "https://YOUR-RENDER-URL";

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add logging to see failures
API.interceptors.request.use((config) => {
  console.log(
    "[API] →",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data || ""
  );
  return config;
});
API.interceptors.response.use(
  (res) => {
    console.log("[API] ←", res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    if (err.response) {
      console.log(
        "[API] ✖",
        err.response.status,
        err.config?.url,
        err.response.data
      );
    } else {
      console.log("[API] ✖", err.message);
    }
    return Promise.reject(err);
  }
);

// verse liking and sharing logic

export const toggleLikeApi = (verseId, userId) =>
  API.post(`/api/verses/${encodeURIComponent(verseId)}/likes/toggle`, {
    userId,
  }).then((r) => r.data);

export const getLikeCountApi = (verseId) =>
  API.get(`/api/verses/${encodeURIComponent(verseId)}/likes/count`).then(
    (r) => r.data
  );

export const recordShareApi = (verseId, { channel, userId }) =>
  API.post(`/api/verses/${encodeURIComponent(verseId)}/shares`, {
    channel,
    userId,
  }).then((r) => r.data);

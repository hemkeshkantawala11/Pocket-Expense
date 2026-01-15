import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API = axios.create({
  baseURL: "http://10.51.1.45:5000/api"
})

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token")
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token")
    }
    return Promise.reject(error)
  }
)

export default API

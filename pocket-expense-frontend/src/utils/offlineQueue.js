import AsyncStorage from "@react-native-async-storage/async-storage"

const QUEUE_KEY = "offline_expenses"

export const saveOfflineExpense = async (expense) => {
  const existing = await AsyncStorage.getItem(QUEUE_KEY)
  const queue = existing ? JSON.parse(existing) : []
  queue.push(expense)
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export const getOfflineExpenses = async () => {
  const data = await AsyncStorage.getItem(QUEUE_KEY)
  return data ? JSON.parse(data) : []
}

export const clearOfflineExpenses = async () => {
  await AsyncStorage.removeItem(QUEUE_KEY)
}

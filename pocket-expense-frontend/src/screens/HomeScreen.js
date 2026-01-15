import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, RefreshControl } from "react-native";
import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { Calendar } from "react-native-calendars";
import { X, Filter, Calendar as CalIcon, Search } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import Cache
import API from "../services/api";
import { Colors } from "../themes/colors";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);
  const { logout, userToken } = useContext(AuthContext);
  const [name, setName] = useState("User"); // Default fallback

  // --- 1. Cache-First Profile Fetching ---
  useEffect(() => {
    const loadProfile = async () => {
      // Step A: Load from Cache immediately
      try {
        const cachedName = await AsyncStorage.getItem("user_name_cache");
        if (cachedName) {
          setName(cachedName);
        }
      } catch (e) {
        console.log("Cache load error:", e);
      }

      // Step B: Fetch fresh data from API
      if (userToken) {
        try {
          const response = await API.get("auth/profile");
          if (response.data.user) {
            const serverName = response.data.user.name;
            setName(serverName);
            // Step C: Update Cache
            await AsyncStorage.setItem("user_name_cache", serverName);
          }
        } catch (error) {
          console.log("Profile sync failed (offline?), using cache.");
        }
      }
    };

    loadProfile();
  }, [userToken]);
  
  // Date Range State
  const [range, setRange] = useState({ start: null, end: null });
  const [markedDates, setMarkedDates] = useState({});

  const fetchExpenses = async (start = range.start, end = range.end) => {
    try {
      let url = "/expenses";
      if (start && end) url = `/expenses/filter/date?startDate=${start}&endDate=${end}`;
      
      const res = await API.get(url);
      setExpenses(res.data);
    } catch (e) { console.log(e); }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [range]);

  useEffect(() => { 
    fetchExpenses();
    
    // Set up auto-refresh every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchExpenses();
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Handle Date Range Selection
  const onDayPress = (day) => {
    if (!range.start || (range.start && range.end)) {
      // Start a new range
      setRange({ start: day.dateString, end: null });
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: Colors.primary, textColor: 'white' }
      });
    } else {
      // Complete the range
      const end = day.dateString;
      const start = range.start;
      // Simple swap if user picked earlier date second
      const finalStart = start > end ? end : start;
      const finalEnd = start > end ? start : end;

      setRange({ start: finalStart, end: finalEnd });
      
      // Mark the range visually
      let dates = {};
      dates[finalStart] = { startingDay: true, color: Colors.primary, textColor: 'white' };
      dates[finalEnd] = { endingDay: true, color: Colors.primary, textColor: 'white' };
      
      setMarkedDates(dates); // (In a real app, you'd loop to mark middle days too)
      
      fetchExpenses(finalStart, finalEnd);
      setTimeout(() => setShowCalendar(false), 500); // Close after brief delay
    }
  };

  const clearFilter = () => {
    setRange({ start: null, end: null });
    setMarkedDates({});
    fetchExpenses(null, null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* HEADER */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: Colors.card }}>
        <Text style={{ color: Colors.mutedText, fontSize: 14 }}>Welcome Back,</Text>
        {/* Name updates instantly from cache now */}
        <Text style={{ color: Colors.text, fontSize: 24, fontWeight: 'bold' }}>{name}</Text>
      </View>

      {/* Search & Filter */}
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginRight: 10 }}>
          <Search color={Colors.mutedText} size={20} />
          <TextInput
            placeholder="Search category..."
            placeholderTextColor={Colors.mutedText}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: Colors.text, padding: 12 }}
          />
        </View>
        <TouchableOpacity onPress={() => setShowCalendar(true)} style={{ backgroundColor: Colors.card, padding: 12, borderRadius: 12 }}>
          <CalIcon color={Colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chip */}
      {range.start && range.end && (
        <View style={{ flexDirection: 'row', marginLeft: 15, marginBottom: 10 }}>
          <View style={{ backgroundColor: Colors.primary, flexDirection: 'row', padding: 8, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.background, fontSize: 12, fontWeight: 'bold' }}>
              {range.start} to {range.end}
            </Text>
            <TouchableOpacity onPress={clearFilter} style={{ marginLeft: 8 }}>
              <X color={Colors.background} size={14} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={expenses.filter(e => e.category.toLowerCase().includes(search.toLowerCase()))}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ backgroundColor: Colors.card, marginHorizontal: 15, marginVertical: 6, padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: Colors.secondary }}
            onPress={() => navigation.navigate("EditExpense", { expense: item })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '700' }}>₹{item.amount}</Text>
              <Text style={{ color: Colors.mutedText, fontSize: 12 }}>{new Date(item.date).toDateString()}</Text>
            </View>
            <Text style={{ color: Colors.textSecondary, marginTop: 4 }}>{item.category} • {item.paymentMethod}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20 }}>
          <View style={{ backgroundColor: Colors.card, borderRadius: 20, overflow: 'hidden' }}>
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={{
                calendarBackground: Colors.card,
                dayTextColor: Colors.text,
                monthTextColor: Colors.primary,
                textDisabledColor: '#444'
              }}
            />
            <TouchableOpacity onPress={() => setShowCalendar(false)} style={{ padding: 15, alignItems: 'center', borderTopWidth: 1, borderColor: Colors.border }}>
              <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
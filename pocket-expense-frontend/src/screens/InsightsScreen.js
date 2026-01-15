import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"; // IMPORT THIS
import { PieChart } from "react-native-gifted-charts"; // NEW LIBRARY
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react-native";
import API from "../services/api";
import { Colors } from "../themes/colors";

export default function InsightsScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ monthlyTotal: 0, avgDaily: 0, categories: [] });

  // useFocusEffect runs every time the tab becomes active
  useFocusEffect(
    useCallback(() => {
      fetchAdvancedInsights();
    }, [])
  );

  const fetchAdvancedInsights = async () => {
    try {
      // Don't set loading(true) here to avoid flickering on every tab switch, 
      // or use a separate 'refreshing' state if you prefer.
      const now = new Date();
      
      const [currRes, catRes, avgRes] = await Promise.all([
        API.get(`/expenses/analytics/monthly?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
        API.get(`/expenses/analytics/category`),
        API.get(`/expenses/analytics/average-daily?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      ]);

      setData({
        monthlyTotal: Number(currRes.data?.total || currRes.data || 0),
        avgDaily: Number(avgRes.data?.average || 0),
        categories: catRes.data || [],
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Format data for Gifted Charts
  const pieData = data.categories.map((c, i) => ({
    value: Number(c.total),
    color: [Colors.primary, Colors.secondary, '#FFD700', '#FF6B6B', '#4CAF50'][i % 5],
    text: `${Math.round(Number(c.total))}`, // Show value on chart
    shiftTextX: -10,
    shiftTextY: -5,
  }));

  if (loading) return <View style={styles.loader}><ActivityIndicator color={Colors.primary} /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Financial Insights</Text>

      {/* Cards */}
      <View style={styles.row}>
        <View style={styles.cardHalf}>
          <DollarSign color={Colors.primary} size={20} />
          <Text style={styles.cardLabel}>Avg. Daily</Text>
          <Text style={styles.cardValue}>₹{data.avgDaily.toFixed(0)}</Text>
        </View>
        <View style={styles.cardHalf}>
          <Text style={styles.cardLabel}>Total Month</Text>
          <Text style={[styles.cardValue, { color: Colors.secondary }]}>₹{data.monthlyTotal}</Text>
        </View>
      </View>

      {/* CHART SECTION */}
      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>Category Breakdown</Text>
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={50}
              centerLabelComponent={() => (
                <Text style={{ color: Colors.text, fontSize: 16 }}>Total</Text>
              )}
            />
          ) : (
            <Text style={{color: Colors.mutedText}}>No data available</Text>
          )}
        </View>
        
        {/* Manual Legend */}
        <View style={styles.legendGrid}>
          {data.categories.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: pieData[index]?.color }]} />
              <Text style={styles.legendText}>{item._id} (₹{item.total})</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: -50, marginBottom: 40, backgroundColor: Colors.card, padding: 20, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: Colors.secondary }}>
        <Text style={{ color: Colors.secondary, fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>🤖 AI Smart Tip</Text>
        <Text style={{ color: Colors.text, lineHeight: 22 }}>
          {data.categories.length > 0 
            ? `You spent ₹${data.categories[0].total} on ${data.categories[0]._id} this month. If you cut this by 15%, you could save ₹${(data.categories[0].total * 0.15).toFixed(0)} for your next goal!`
            : "Start tracking your expenses to unlock personalized savings advice here."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 60 },
  headerTitle: { color: Colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardHalf: { backgroundColor: Colors.card, width: '48%', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  cardLabel: { color: Colors.mutedText, fontSize: 12, marginTop: 8 },
  cardValue: { color: Colors.text, fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  mainCard: { backgroundColor: Colors.card, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, marginBottom: 100 },
  cardTitle: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', margin: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: Colors.mutedText, fontSize: 12 },
});
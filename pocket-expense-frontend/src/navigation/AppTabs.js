import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../themes/colors";
import { Home, PlusCircle, PieChart, User } from "lucide-react-native";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack"; // New Stack
// import AddExpenseScreen from "../screens/AddExpenseScreen";
import InsightsScreen from "../screens/InsightsScreen";
import AddExpenseStack from "./AddExpenseStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.card, borderTopColor: Colors.border, height: 65, paddingBottom: 10 },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedText,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") return <Home color={color} size={size} />;
          if (route.name === "Add") return <PlusCircle color={color} size={size} />;
          if (route.name === "Insights") return <PieChart color={color} size={size} />;
          if (route.name === "Profile") return <User color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Add" component={AddExpenseStack} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
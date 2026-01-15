import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import ManageOptionsScreen from "../screens/ManageOptionsScreen";
import { Colors } from "../themes/colors"; // Optional: for styling headers

const Stack = createNativeStackNavigator();

export default function AddExpenseStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true, // We want headers here to show the "Back" button
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="AddExpenseMain" 
        component={AddExpenseScreen} 
        options={{ title: 'Add New Expense', headerShown: false }} // Hide header on main add page if you prefer custom UI
      />
      <Stack.Screen 
        name="ManageOptions" 
        component={ManageOptionsScreen} 
        options={{ title: 'Manage Options' }} 
      />
    </Stack.Navigator>
  );
}
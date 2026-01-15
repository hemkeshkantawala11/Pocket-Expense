import AuthProvider from "./src/context/AuthContext"
import RootNavigator from "./src/navigation/RootNavigator"
import NetworkMonitor from "./src/components/NetworkMonitor"; // Import it

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <NetworkMonitor />
    </AuthProvider>
  )
}

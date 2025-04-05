import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";

// Layout components
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

// Pages
import Home from "./pages/home";
import Cars from "./pages/cars";
import CarDetails from "./pages/car-details";
import Drivers from "./pages/drivers";
import DriverDetails from "./pages/driver-details";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/not-found";

// Types for user context
type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
};

// Create a context for the user
import { createContext } from "react";
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cars" component={Cars} />
      <Route path="/cars/:id" component={CarDetails} />
      <Route path="/drivers" component={Drivers} />
      <Route path="/drivers/:id" component={DriverDetails} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Check for user data in local storage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("zoroUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user data to local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("zoroUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("zoroUser");
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
        <div className="flex flex-col min-h-screen font-poppins" data-theme="zoroTheme">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;

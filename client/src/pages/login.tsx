import { useState, useEffect, useContext } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { UserContext } from "../App";

const Login = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { setUser } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Login | Zoro Cars";
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/login", formData);
      const data = await response.json();
      
      // Set user data in context
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
      
      setErrors({
        auth: "Invalid username or password"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-neutral-50 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto backdrop-blur-md bg-white/70 p-8 rounded-xl shadow-xl border border-white/30 relative overflow-hidden transition-all hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-primary font-heading text-center mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Sign In to Your Account</h1>
          
          {errors.auth && (
            <div className="mb-4 p-3 bg-red-50/90 text-red-700 rounded-md text-sm font-medium border border-red-100">
              {errors.auth}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 rounded-lg ${errors.username ? 'border-red-400' : 'border-indigo-100'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
              />
              {errors.username && (
                <p className="mt-1.5 text-sm font-medium text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 rounded-lg ${errors.password ? 'border-red-400' : 'border-indigo-100'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm font-medium text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm font-medium text-indigo-800">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold underline-offset-2 hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 max-w-md mx-auto backdrop-blur-md bg-white/70 p-6 rounded-xl shadow-lg border border-white/30 relative overflow-hidden transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 z-0"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-primary mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Demo Account</h2>
          <p className="text-sm font-medium text-indigo-800 mb-4">
            For testing purposes, you can use these credentials:
          </p>
          <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/70 rounded-r-lg">
            <p className="font-medium text-indigo-900"><strong>Username:</strong> admin</p>
            <p className="font-medium text-indigo-900"><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

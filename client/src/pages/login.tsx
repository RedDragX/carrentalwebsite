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
    <div className="bg-neutral-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary font-heading text-center mb-6">Sign In to Your Account</h1>
        
        {errors.auth && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {errors.auth}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-md transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-accent hover:text-accent-dark font-medium">
            Create an account
          </Link>
        </p>
      </div>
      
      <div className="mt-8 max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-primary mb-2">Demo Account</h2>
        <p className="text-sm text-neutral-600 mb-4">
          For testing purposes, you can use these credentials:
        </p>
        <div className="border-l-4 border-accent pl-3 py-2">
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const Register = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Register | Zoro Cars";
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
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
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
      
      // Remove confirmPassword from the data sent to the API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await apiRequest("POST", "/api/register", registrationData);
      const data = await response.json();
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message.includes("Username already exists")) {
        setErrors(prev => ({ ...prev, username: "Username already exists" }));
        errorMessage = "Username already exists";
      } else if (error.message.includes("Email already exists")) {
        setErrors(prev => ({ ...prev, email: "Email already exists" }));
        errorMessage = "Email already exists";
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
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
          <h1 className="text-2xl font-bold text-primary font-heading text-center mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Create an Account</h1>
          
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
              <label htmlFor="email" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 rounded-lg ${errors.email ? 'border-red-400' : 'border-indigo-100'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm font-medium text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 rounded-lg ${errors.fullName ? 'border-red-400' : 'border-indigo-100'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm font-medium text-red-500">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Phone Number (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-indigo-800 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border-2 rounded-lg ${errors.confirmPassword ? 'border-red-400' : 'border-indigo-100'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm font-medium text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm font-medium text-indigo-800">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold underline-offset-2 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { carTypes } from "@/lib/utils";

const SearchSection = () => {
  const [, setLocation] = useLocation();
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    location: "",
    pickup: "",
    dropoff: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    setIsSearching(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (formData.location) params.append("location", formData.location);
    if (formData.pickup) params.append("pickup", formData.pickup);
    if (formData.dropoff) params.append("dropoff", formData.dropoff);
    if (formData.type && formData.type !== "All Types") params.append("type", formData.type);
    
    // Navigate to cars page with search parameters
    setTimeout(() => {
      setLocation(`/cars?${params.toString()}`);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="glass-card backdrop-blur-md -mt-16 relative z-20 max-w-6xl mx-auto overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/90 to-violet-600/90 p-4 px-6 relative">
        <h3 className="text-xl font-bold text-white font-space">Find Your Perfect Ride</h3>
        <p className="text-white/80 text-sm mt-1 font-poppins">
          Premium vehicles for any occasion
        </p>
        
        {/* Decorative elements */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Form section with glass effect */}
      <div className="px-6 py-6 bg-gray-900/70 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">
              Pickup Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                name="location" 
                id="location" 
                value={formData.location}
                onChange={handleChange}
                className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all" 
                placeholder="City or Airport"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">
              Pick-up Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                type="date" 
                name="pickup" 
                id="pickup" 
                value={formData.pickup}
                onChange={handleChange}
                className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">
              Drop-off Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                type="date" 
                name="dropoff" 
                id="dropoff" 
                value={formData.dropoff}
                onChange={handleChange}
                className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">
              Car Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a2 2 0 01-2 2H9m4-2V8m0 0V6a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-1" />
                </svg>
              </div>
              <select 
                id="type" 
                name="type" 
                value={formData.type}
                onChange={handleChange}
                className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
              >
                {carTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white py-2.5 px-4 rounded-lg font-medium transition-all shadow-lg font-space hover:shadow-primary/20 hover:shadow-xl disabled:opacity-80"
            >
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Find Cars
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;

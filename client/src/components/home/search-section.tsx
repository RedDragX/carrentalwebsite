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
    <div className="-mt-20 relative z-20 mx-auto max-w-6xl overflow-visible px-4">
      {/* Decorative blobs and effects */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-10 right-0 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
      
      {/* Main search card with floating effect */}
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-violet-900/20 border border-white/10 transform hover:-translate-y-1 transition duration-300">
        {/* Glass background */}
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"></div>
        
        {/* Floating animation elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full animate-pulse-slow opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-600/10 rounded-full animate-pulse-slow opacity-30 delay-700"></div>
        
        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          {/* Background gradient with animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                  Find Your Dream Ride
                </h3>
                <p className="text-indigo-200/90 text-sm mt-1 font-poppins">
                  Premium vehicles tailored to your journey
                </p>
              </div>
              
              {/* Animated icon */}
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form section with floating inputs */}
        <div className="relative px-8 py-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {/* Location field */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-gray-200 font-space flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500 mr-2"></span>
                Pickup Location
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-75"></div>
                <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-gray-800/50 border border-white/10 group-hover:border-violet-500/30 transition-colors duration-300"></div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-300 group-hover:bg-violet-900/50 group-hover:text-violet-300 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="w-full py-3 pl-12 pr-4 bg-transparent text-gray-100 font-outfit text-sm focus:outline-none focus:ring-0 transition-all" 
                    placeholder="City or Airport"
                  />
                </div>
              </div>
            </div>

            {/* Pickup date field */}
            <div className="space-y-2">
              <label htmlFor="pickup" className="text-sm font-medium text-gray-200 font-space flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                Pick-up Date
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-75"></div>
                <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-gray-800/50 border border-white/10 group-hover:border-indigo-500/30 transition-colors duration-300"></div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-300 group-hover:bg-indigo-900/50 group-hover:text-indigo-300 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date" 
                    name="pickup" 
                    id="pickup" 
                    value={formData.pickup}
                    onChange={handleChange}
                    className="w-full py-3 pl-12 pr-4 bg-transparent text-gray-100 font-outfit text-sm focus:outline-none focus:ring-0 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Dropoff date field */}
            <div className="space-y-2">
              <label htmlFor="dropoff" className="text-sm font-medium text-gray-200 font-space flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                Drop-off Date
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-75"></div>
                <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-gray-800/50 border border-white/10 group-hover:border-blue-500/30 transition-colors duration-300"></div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-300 group-hover:bg-blue-900/50 group-hover:text-blue-300 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="date" 
                    name="dropoff" 
                    id="dropoff" 
                    value={formData.dropoff}
                    onChange={handleChange}
                    className="w-full py-3 pl-12 pr-4 bg-transparent text-gray-100 font-outfit text-sm focus:outline-none focus:ring-0 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Car type select */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-200 font-space flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                Car Type
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur group-hover:blur-md transition-all duration-300 opacity-75"></div>
                <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-gray-800/50 border border-white/10 group-hover:border-purple-500/30 transition-colors duration-300"></div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-300 group-hover:bg-purple-900/50 group-hover:text-purple-300 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a2 2 0 01-2 2H9m4-2V8m0 0V6a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-1" />
                    </svg>
                  </div>
                  <select 
                    id="type" 
                    name="type" 
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full py-3 pl-12 pr-4 bg-transparent text-gray-100 font-outfit text-sm focus:outline-none focus:ring-0 transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%239ca3af%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    {carTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-900 text-gray-200">{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search button */}
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full relative overflow-hidden group"
              >
                {/* Button background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl group-hover:from-violet-500 group-hover:to-indigo-500 transition-all duration-500"></div>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent group-hover:blur-xl transition-all duration-500"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center py-3.5 px-4 font-space font-medium text-white shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      Find Your Ride
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;

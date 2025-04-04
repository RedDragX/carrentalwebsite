import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { carTypes } from "@/lib/utils";

const SearchSection = () => {
  const [, setLocation] = useLocation();

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
    
    // Build query parameters
    const params = new URLSearchParams();
    if (formData.location) params.append("location", formData.location);
    if (formData.pickup) params.append("pickup", formData.pickup);
    if (formData.dropoff) params.append("dropoff", formData.dropoff);
    if (formData.type && formData.type !== "All Types") params.append("type", formData.type);
    
    // Navigate to cars page with search parameters
    setLocation(`/cars?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg -mt-5 relative z-20 max-w-6xl mx-auto">
      <div className="px-6 py-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="text" 
                name="location" 
                id="location" 
                value={formData.location}
                onChange={handleChange}
                className="focus:ring-accent focus:border-accent block w-full pl-10 pr-3 py-2 sm:text-sm border-neutral-300 rounded-md" 
                placeholder="City or Airport"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-neutral-700">Pick-up Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="date" 
                name="pickup" 
                id="pickup" 
                value={formData.pickup}
                onChange={handleChange}
                className="focus:ring-accent focus:border-accent block w-full pl-10 pr-3 py-2 sm:text-sm border-neutral-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dropoff" className="block text-sm font-medium text-neutral-700">Drop-off Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="date" 
                name="dropoff" 
                id="dropoff" 
                value={formData.dropoff}
                onChange={handleChange}
                className="focus:ring-accent focus:border-accent block w-full pl-10 pr-3 py-2 sm:text-sm border-neutral-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700">Car Type</label>
            <select 
              id="type" 
              name="type" 
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
            >
              {carTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Search</label>
            <button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-md transition-all mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Find Cars
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;

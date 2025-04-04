import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DriverCard from "@/components/driver/driver-card";

const Drivers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Zoro Cars - Professional Drivers";
  }, []);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/drivers"],
    staleTime: 60000, // 1 minute
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredDrivers = data?.drivers.filter((driver: any) => {
    if (!searchQuery) return true;
    
    return (
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.specialties.some((specialty: string) => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      driver.languages.some((language: string) => 
        language.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  return (
    <div className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary font-heading">Our Professional Drivers</h1>
          <p className="mt-2 text-neutral-600">Experienced chauffeurs for your ultimate comfort and safety</p>
        </div>
        
        {/* Search */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, specialty, or language..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Driver Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md h-72 animate-pulse">
                <div className="h-56 w-full bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Error loading drivers. Please try again later.</p>
          </div>
        ) : filteredDrivers?.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-primary">No drivers found</h3>
            <p className="mt-2 text-neutral-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDrivers?.map((driver: any) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-primary font-heading mb-4">Why Choose Our Drivers</h2>
          <p className="text-neutral-600 mb-6">
            All our drivers are professionally trained and have extensive experience with luxury and sports vehicles.
            They undergo rigorous background checks and maintain the highest standards of service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4">
              <div className="mx-auto w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Safety First</h3>
              <p className="text-neutral-600 mt-2">Our drivers prioritize your safety with defensive driving techniques and thorough knowledge of all safety features.</p>
            </div>
            
            <div className="p-4">
              <div className="mx-auto w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Professional Service</h3>
              <p className="text-neutral-600 mt-2">Expect punctuality, courtesy, and discreet service from our professionally trained chauffeurs.</p>
            </div>
            
            <div className="p-4">
              <div className="mx-auto w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Local Knowledge</h3>
              <p className="text-neutral-600 mt-2">Benefit from our drivers' extensive knowledge of local routes, attractions, and establishments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;

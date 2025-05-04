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
    <div className="relative py-12">
      {/* Background gradient and pattern - Matches home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950">
        {/* Animated radial gradient spots */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 left-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-[40%] -right-20 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-40 left-[30%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px' 
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Our Professional Drivers</h1>
          <p className="mt-2 text-gray-200 font-medium">Experienced chauffeurs for your ultimate comfort and safety</p>
        </div>
        
        {/* Search */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, specialty, or language..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 shadow-sm"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary/60" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Driver Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-base-100 rounded-lg overflow-hidden shadow-md h-72 animate-pulse">
                <div className="h-56 w-full bg-base-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-base-300 rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-base-300 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-10 bg-red-50 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-red-600">Error Loading Drivers</h3>
            <p className="mt-2 text-red-700 font-medium">Please try again later.</p>
          </div>
        ) : filteredDrivers?.length === 0 ? (
          <div className="text-center p-12 bg-base-100 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-primary">No drivers found</h3>
            <p className="mt-2 text-gray-200 font-medium">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDrivers?.map((driver: any) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-16 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-primary rounded-xl"></div>
          
          <div className="relative rounded-xl shadow-lg overflow-hidden border border-primary/10 p-10 text-center">
            {/* Top badge */}
            <div className="inline-block px-4 py-1.5 rounded-md bg-white/20 text-white text-sm font-medium mb-6 shadow-md">
              <span className="inline-block mr-2 bg-white rounded-full h-2 w-2 animate-pulse"></span>
              Elite Drivers Team
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Drivers</h2>
            
            <p className="text-white/90 mb-8 max-w-3xl mx-auto">
              All our drivers are professionally trained and have extensive experience with luxury and sports vehicles.
              They undergo rigorous background checks and maintain the highest standards of service.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* Feature 1 */}
              <div className="group relative bg-white/10 rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-md bg-white flex items-center justify-center mb-5 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">Safety First</h3>
                
                <p className="text-white/80">
                  Our drivers prioritize your safety with defensive driving techniques and thorough knowledge of all vehicle safety features.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative bg-white/10 rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-md bg-white flex items-center justify-center mb-5 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">Professional Service</h3>
                
                <p className="text-white/80">
                  Expect punctuality, courtesy, and discreet service from our professionally trained chauffeurs available 24/7.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative bg-white/10 rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-md bg-white flex items-center justify-center mb-5 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">Local Expertise</h3>
                
                <p className="text-white/80">
                  Benefit from our drivers' extensive knowledge of local routes, attractions, and premium establishments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;

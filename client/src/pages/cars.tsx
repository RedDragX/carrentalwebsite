import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CarCard from "@/components/car/car-card";
import { carTypes } from "@/lib/utils";

const Cars = () => {
  const [location] = useLocation();
  const [activeType, setActiveType] = useState("All Cars");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Parse query parameters
  const params = new URLSearchParams(location.split("?")[1]);
  const typeFromUrl = params.get("type");
  const searchFromUrl = params.get("search");
  
  useEffect(() => {
    document.title = "Zoro Cars - Browse Our Fleet";
    
    // Set filters based on URL parameters
    if (typeFromUrl) {
      setActiveType(typeFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [typeFromUrl, searchFromUrl]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/cars"],
    staleTime: 60000, // 1 minute
  });
  
  const handleTypeChange = (type: string) => {
    setActiveType(type);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredCars = data?.cars.filter((car: any) => {
    // Filter by type
    const typeMatch = activeType === "All Cars" || car.type === activeType;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  return (
    <div className="bg-base-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Our Car Collection</h1>
          <p className="mt-2 text-neutral-700 font-medium">Browse our selection of premium vehicles</p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cars..."
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
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => handleTypeChange("All Cars")}
                className={`px-4 py-2 rounded-md ${activeType === "All Cars" ? "bg-primary text-white" : "bg-base-100 text-neutral-700 hover:bg-base-300"} font-medium text-sm shadow-sm transition-all`}
              >
                All Cars
              </button>
              
              {carTypes.slice(1).map((type) => (
                <button 
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-md ${activeType === type ? "bg-primary text-white" : "bg-base-100 text-neutral-700 hover:bg-base-300"} font-medium text-sm shadow-sm transition-all`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Car Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-base-100 rounded-lg overflow-hidden shadow-md h-72 animate-pulse">
                <div className="h-48 w-full bg-base-300"></div>
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
            <h3 className="mt-4 text-xl font-semibold text-red-600">Error Loading Cars</h3>
            <p className="mt-2 text-red-700 font-medium">Please try again later.</p>
          </div>
        ) : filteredCars?.length === 0 ? (
          <div className="text-center p-12 bg-base-100 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-primary">No cars found</h3>
            <p className="mt-2 text-neutral-600 font-medium">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars?.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CarCard from "../car/car-card";
import { carTypes } from "@/lib/utils";

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  type: string;
  seats: number;
  topSpeed: number;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  available: boolean;
}

interface CarsResponse {
  cars: Car[];
}

const FeaturedCars = () => {
  const [activeType, setActiveType] = useState("All Cars");
  
  const { data, isLoading, error } = useQuery<CarsResponse>({
    queryKey: ["/api/cars"],
    staleTime: 60000, // 1 minute
  });
  
  const filteredCars = data?.cars ? data.cars.filter((car: any) => {
    if (activeType === "All Cars") return true;
    return car.type === activeType;
  }).slice(0, 6) : [];
  
  const handleTypeChange = (type: string) => {
    setActiveType(type);
  };

  return (
    <section id="cars" className="py-16 relative" style={{ background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-14 relative">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 font-heading">Featured Luxury & Sport Cars</h2>
          <p className="mt-2 text-purple-900/70">Experience the thrill of driving our premium selection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            onClick={() => handleTypeChange("All Cars")}
            className={`px-5 py-2 rounded-md ${activeType === "All Cars" 
              ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20" 
              : "bg-white text-purple-800 hover:bg-purple-50 border border-purple-100"} 
              font-medium text-sm transition-all`}
          >
            All Cars
          </button>
          
          {carTypes.slice(1).map((type) => (
            <button 
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-5 py-2 rounded-md ${activeType === type 
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20" 
                : "bg-white text-purple-800 hover:bg-purple-50 border border-purple-100"} 
                font-medium text-sm transition-all`}
            >
              {type}
            </button>
          ))}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars?.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link 
            href="/cars"
            className="relative overflow-hidden group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-md transition-all shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/0 via-white/20 to-purple-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative flex items-center">
              View All Cars
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;

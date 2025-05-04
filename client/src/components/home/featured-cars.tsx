import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CarCard from "../car/car-card";
import { carTypes } from "@/lib/utils";

const FeaturedCars = () => {
  const [activeType, setActiveType] = useState("All Cars");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/cars"],
    staleTime: 60000, // 1 minute
  });
  
  const filteredCars = data?.cars.filter((car: any) => {
    if (activeType === "All Cars") return true;
    return car.type === activeType;
  }).slice(0, 6);
  
  const handleTypeChange = (type: string) => {
    setActiveType(type);
  };

  return (
    <section id="cars" className="py-12 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary font-heading">Featured Luxury & Sport Cars</h2>
          <p className="mt-2 text-neutral-600">Experience the thrill of driving our premium selection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
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

        {/* Car Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md h-72 animate-pulse">
                <div className="h-48 w-full bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Error loading cars. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars?.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link 
            href="/cars"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary bg-base-100 hover:bg-primary hover:text-white font-medium rounded-md transition-all shadow-sm"
          >
            View All Cars
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;

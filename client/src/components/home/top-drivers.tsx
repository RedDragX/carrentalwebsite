import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DriverCard from "../driver/driver-card";

const TopDrivers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/drivers"],
    staleTime: 60000, // 1 minute
  });

  return (
    <section id="drivers" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary font-heading">Our Professional Drivers</h2>
          <p className="mt-2 text-neutral-600">Experienced chauffeurs for your ultimate comfort and safety</p>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.drivers.slice(0, 4).map((driver: any) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link 
            href="/drivers"
            className="inline-flex items-center px-6 py-3 border border-accent text-accent bg-white hover:bg-accent hover:text-white font-medium rounded-md transition-all"
          >
            View All Drivers
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDrivers;

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DriverCard from "../driver/driver-card";

interface Driver {
  id: number;
  name: string;
  experience: number;
  image: string;
  description: string;
  quote: string;
  rating: number;
  tripCount: number;
  specialties?: string[];
  languages?: string[];
  available?: boolean;
}

interface DriversResponse {
  drivers: Driver[];
}

const TopDrivers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/drivers"],
    staleTime: 60000, // 1 minute
  });

  return (
    <section id="drivers" className="py-16 relative" style={{ background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(167, 139, 250, 0.05))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-10 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 font-heading">Our Professional Drivers</h2>
          <p className="mt-2 text-purple-900/70">Experienced chauffeurs for your ultimate comfort and safety</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md h-72 animate-pulse">
                <div className="h-56 w-full bg-purple-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-purple-200 rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-purple-100 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-xl shadow-md border border-red-100">
            <p className="text-red-500 font-medium">Error loading drivers. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.drivers ? data.drivers.slice(0, 4).map((driver: any) => (
              <DriverCard key={driver.id} driver={driver} />
            )) : null}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link 
            href="/drivers"
            className="relative overflow-hidden group inline-flex items-center px-8 py-4 bg-white text-purple-700 border border-purple-200 font-medium rounded-md transition-all shadow-md shadow-purple-100 hover:shadow-lg hover:shadow-purple-200/40 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative flex items-center">
              View All Drivers
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

export default TopDrivers;

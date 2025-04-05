import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import AIDriverReview from "@/components/driver/ai-driver-review";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Driver {
  id: number;
  name: string;
  experience: number;
  image: string;
  description: string;
  quote: string;
  rating: number;
  tripCount: number;
  specialties: string[];
  languages: string[];
  available: boolean;
}

interface DriverResponse {
  driver: Driver;
}

const DriverDetails = () => {
  const { id } = useParams();
  
  useEffect(() => {
    if (!id) return;
    document.title = "Loading Driver Details | Zoro Cars";
  }, [id]);
  
  const { data, isLoading, error } = useQuery<DriverResponse>({
    queryKey: [`/api/drivers/${id}`],
    enabled: !!id
  });
  
  useEffect(() => {
    if (data?.driver) {
      document.title = `${data.driver.name} | Zoro Cars`;
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !data?.driver) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-primary">Driver Not Found</h3>
          <p className="mt-2 text-neutral-600">We couldn't find the driver you're looking for.</p>
          <Link href="/drivers" className="mt-6 inline-block bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition-all">
            Back to Drivers
          </Link>
        </div>
      </div>
    );
  }
  
  const driver = data.driver;
  const displayRating = formatRating(driver.rating);
  
  return (
    <div className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/drivers" className="text-accent hover:text-accent-dark inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Drivers
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-2/5">
              <img 
                className="h-full w-full object-cover" 
                src={driver.image} 
                alt={driver.name}
              />
            </div>
            <div className="p-8 md:w-3/5">
              <div className="uppercase tracking-wide text-sm text-accent font-semibold">Professional Driver</div>
              <h1 className="mt-2 text-3xl font-bold text-primary font-heading">{driver.name}</h1>
              
              <div className="mt-2 flex items-center">
                <StarRating rating={displayRating} />
                <span className="ml-2 text-neutral-700">
                  {displayRating.toFixed(1)} ({driver.tripCount} trips)
                </span>
              </div>
              
              <div className="mt-4 flex flex-wrap">
                <div className="mr-6 mb-4">
                  <div className="text-sm text-neutral-500">Experience</div>
                  <div className="font-medium">{driver.experience} years</div>
                </div>
                
                <div className="mr-6 mb-4">
                  <div className="text-sm text-neutral-500">Languages</div>
                  <div className="font-medium">{driver.languages.join(", ")}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-neutral-500">Status</div>
                  <div className={`font-medium ${driver.available ? "text-green-600" : "text-red-600"}`}>
                    {driver.available ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>
              
              <blockquote className="mt-4 italic text-neutral-700 border-l-4 border-accent pl-4 py-2 bg-neutral-50">
                "{driver.quote}"
              </blockquote>
              
              <p className="mt-6 text-neutral-700">{driver.description}</p>
              
              <div className="mt-6">
                <h3 className="font-bold text-primary">Specialties</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {driver.specialties.map((specialty: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-neutral-100 text-neutral-800 px-3 py-1 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  href="/cars"
                  className="inline-flex items-center bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-md font-medium transition-all"
                >
                  Book a Car with this Driver
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="ai-analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 glass-panel p-1 gap-1">
              <TabsTrigger value="ai-analysis" className="text-md text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                AI Driver Analysis
              </TabsTrigger>
              <TabsTrigger value="benefits" className="text-md text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Why Choose a Professional Driver
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-analysis" className="mt-4">
              <AIDriverReview driverId={driver.id} driverName={driver.name} />
            </TabsContent>
            
            <TabsContent value="benefits">
              <div className="glass-card p-0.5 overflow-hidden">
                <div className="glass-dark p-6 rounded-xl h-full">
                  <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Why Choose a Professional Driver</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-lg border border-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:shadow-glow">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center mb-5 shadow-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Safety & Security</h3>
                      <p className="text-gray-300">
                        Our professional drivers ensure maximum safety with their expert driving skills and knowledge of the vehicles.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:shadow-glow">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-5 shadow-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Convenience</h3>
                      <p className="text-gray-300">
                        Relax and enjoy the journey without worrying about directions, parking, or driving in unfamiliar locations.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-blue-500/20 transition-all duration-300 hover:border-blue-500/50 hover:shadow-glow">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-5 shadow-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Experience</h3>
                      <p className="text-gray-300">
                        Enhance your luxury car experience with a chauffeur who knows how to maximize performance and comfort.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;

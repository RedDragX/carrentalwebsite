import { useEffect, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { formatCurrency, formatRating, calculateTotalPrice, daysBetween } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { UserContext } from "../App";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CarDetails = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoggedIn } = useContext(UserContext);
  
  // State for booking
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [withDriver, setWithDriver] = useState<boolean>(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    if (!id) return;
    document.title = "Loading Car Details | Zoro Cars";
  }, [id]);
  
  // Fetch car details
  const { data: carData, isLoading: isLoadingCar, error: carError } = useQuery({
    queryKey: [`/api/cars/${id}`],
    enabled: !!id
  });
  
  // Fetch drivers for the driver selection
  const { data: driversData, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["/api/drivers"],
    enabled: withDriver,
  });
  
  useEffect(() => {
    if (carData?.car) {
      document.title = `${carData.car.name} | Zoro Cars`;
    }
  }, [carData]);
  
  // Calculate total price when dates or withDriver changes
  useEffect(() => {
    if (!carData?.car || !startDate || !endDate) {
      setTotalPrice(0);
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = daysBetween(start, end);
    
    if (days <= 0) {
      setTotalPrice(0);
      return;
    }
    
    const price = calculateTotalPrice(carData.car.price, days, withDriver);
    setTotalPrice(price);
  }, [carData, startDate, endDate, withDriver]);
  
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book a car.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!startDate || !endDate || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Invalid dates",
        description: "The end date must be after the start date.",
        variant: "destructive",
      });
      return;
    }
    
    if (withDriver && !selectedDriverId) {
      toast({
        title: "Driver required",
        description: "Please select a driver.",
        variant: "destructive",
      });
      return;
    }
    
    const bookingData = {
      userId: user?.id,
      carId: Number(id),
      driverId: withDriver ? selectedDriverId : null,
      startDate,
      endDate,
      location,
      withDriver,
      totalPrice,
      status: "pending",
    };
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        toast({
          title: "Booking successful!",
          description: "Your booking has been confirmed. Check your profile for details.",
        });
        
        // Reset form
        setStartDate("");
        setEndDate("");
        setLocation("");
        setWithDriver(false);
        setSelectedDriverId(null);
      } else {
        throw new Error("Failed to process booking");
      }
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingCar) {
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
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-base-300 w-1/3 rounded mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-80 bg-base-300 rounded-lg mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="h-60 bg-base-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (carError || !carData?.car) {
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center py-16">
            <div className="bg-base-100/10 backdrop-blur-md rounded-xl p-10 border border-white/10 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">Car Not Found</h1>
              <p className="text-gray-300 font-medium mb-8 max-w-md mx-auto">
                The car you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/cars" className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-md inline-flex items-center transition-all duration-200 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                View All Cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { car } = carData;
  
  return (
    <div className="relative py-8 min-h-screen">
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/cars" className="text-violet-400 hover:text-violet-300 hover:underline flex items-center font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to all cars
            </Link>
          </div>
          
          {/* Title with gradient text */}
          <h1 className="text-3xl md:text-4xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 mb-3">{car.name}</h1>
          
          <div className="flex items-center flex-wrap gap-3 mb-6">
            <div className="flex items-center">
              <StarRating value={car.rating} size={20} />
              <span className="ml-2 text-gray-300 font-medium">{formatRating(car.rating)} ({car.reviewCount} reviews)</span>
            </div>
            <span className="inline-block h-4 w-[1px] bg-gray-700 mx-1"></span>
            <div className="badge badge-lg bg-violet-500 text-white border-0">{car.type}</div>
            <span className="inline-block h-4 w-[1px] bg-gray-700 mx-1"></span>
            <span className="text-gray-300 font-medium">
              <span className="font-bold text-violet-400">{formatCurrency(car.price)}</span> / day
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-700/50 bg-base-100/10 backdrop-blur-md">
                <div className="relative">
                  <img 
                    src={car.images[0]} 
                    alt={car.name} 
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                  {!car.available && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-bold py-2 px-6 rounded-md shadow-lg">
                        Currently Unavailable
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex mb-6 border-b border-gray-700">
                    <button 
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Car Details
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm font-medium ${activeTab === 'features' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('features')}
                    >
                      Features
                    </button>
                  </div>
                  
                  {activeTab === "details" && (
                    <div>
                      {/* Description with improved typography */}
                      <div className="p-4 rounded-lg bg-gray-800/30 mb-6 backdrop-blur-sm border border-gray-700/30">
                        <p className="text-gray-300 leading-relaxed font-medium">{car.description}</p>
                      </div>
                      
                      {/* Specifications heading with gradient text */}
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 mb-4">Performance Specifications</h3>
                      
                      {/* Grid with glass effect cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Top Speed */}
                        <div className="flex items-center bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/30 hover:shadow-md transition-all duration-200 group">
                          <div className="flex items-center justify-center w-12 h-12 bg-violet-900/20 rounded-lg mr-4 group-hover:bg-violet-900/40 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-100">Top Speed</h4>
                            <p className="text-violet-300 font-mono font-semibold">{car.topSpeed} mph</p>
                          </div>
                        </div>
                        
                        {/* Seating Capacity */}
                        <div className="flex items-center bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/30 hover:shadow-md transition-all duration-200 group">
                          <div className="flex items-center justify-center w-12 h-12 bg-indigo-900/20 rounded-lg mr-4 group-hover:bg-indigo-900/40 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-100">Seating Capacity</h4>
                            <p className="text-indigo-300 font-mono font-semibold">{car.seats} seats</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "features" && (
                    <div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 mb-4">Premium Features</h3>
                      
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {car.features.map((feature, index) => (
                          <li key={index} className="flex items-center bg-gray-800/50 p-2 rounded-lg border border-gray-700/50 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-center justify-center bg-violet-900/30 rounded-md p-1.5 mr-3 group-hover:bg-violet-900/50 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-200 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-base-100/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-gray-700/50 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Book This Car</h3>
                  
                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter address"
                        className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="withDriver"
                        checked={withDriver}
                        onChange={(e) => setWithDriver(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <label htmlFor="withDriver" className="ml-2 block text-sm text-gray-300">
                        Include a driver (+$150/day)
                      </label>
                    </div>
                    
                    {withDriver && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Driver</label>
                        <select
                          value={selectedDriverId || ""}
                          onChange={(e) => setSelectedDriverId(Number(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          required={withDriver}
                        >
                          <option value="">Select a driver</option>
                          {driversData?.drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} ({driver.experience} yrs exp)
                            </option>
                          ))}
                        </select>
                        {isLoadingDrivers && (
                          <p className="text-xs text-gray-400 mt-1">Loading drivers...</p>
                        )}
                      </div>
                    )}
                    
                    {totalPrice > 0 && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex justify-between text-gray-300 font-medium">
                          <span>Rental Rate:</span>
                          <span>{formatCurrency(car.price)}/day</span>
                        </div>
                        
                        {startDate && endDate && (
                          <div className="flex justify-between text-gray-300 mt-1">
                            <span>Duration:</span>
                            <span>{daysBetween(new Date(startDate), new Date(endDate))} days</span>
                          </div>
                        )}
                        
                        {withDriver && (
                          <div className="flex justify-between text-gray-300 mt-1">
                            <span>Driver Fee:</span>
                            <span>$150/day</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-700 my-2"></div>
                        
                        <div className="flex justify-between font-bold text-white">
                          <span>Total:</span>
                          <span>{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !car.available}
                      className={`w-full py-3 px-4 rounded-md shadow-lg ${
                        car.available
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      } font-bold transition-colors`}
                    >
                      {isSubmitting ? "Processing..." : car.available ? "Book Now" : "Currently Unavailable"}
                    </button>
                    
                    {!isLoggedIn && (
                      <div className="text-xs text-center text-gray-400 mt-2">
                        You need to be logged in to book a car.{' '}
                        <Link href="/login" className="text-primary hover:underline">
                          Log in here
                        </Link>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
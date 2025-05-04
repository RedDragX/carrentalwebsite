import { Link } from "wouter";
import { formatCurrency, formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { Heart, Clock, Calendar, Sparkles, Users, Gauge } from "lucide-react";

interface CarCardProps {
  car: {
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
  };
}

const CarCard = ({ car }: CarCardProps) => {
  const {
    id,
    name,
    brand,
    model,
    type,
    seats,
    topSpeed,
    price,
    images,
    rating,
    reviewCount,
    available
  } = car;

  // Format the rating from 0-500 scale to 0-5 scale
  const displayRating = formatRating(rating);

  return (
    <div className="group relative overflow-hidden rounded-lg bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Card Image with Hover Effect */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <Link href={`/cars/${id}`}>
          <img 
            src={images[0]} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-md bg-primary text-white backdrop-blur-sm tracking-wide shadow-md">
          {type}
        </div>
        
        {/* Wishlist button with glow on hover */}
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-primary transition-colors shadow-sm">
          <Heart className="h-4 w-4" />
        </button>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur-sm text-gray-800 shadow-md">
          <div className="flex items-center">
            <span className="text-lg font-bold">{formatCurrency(price)}</span>
            <span className="text-xs ml-1 opacity-80">/day</span>
          </div>
        </div>
        
        {/* Status Badge for Unavailable */}
        {!available && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="px-4 py-2 bg-red-600/90 text-white rounded-lg font-space text-sm tracking-wide shadow-lg">
              Currently Unavailable
            </div>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <Link href={`/cars/${id}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                {brand} {model}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">
              {name}
            </p>
          </div>
          
          <div className="flex items-center px-2 py-1 bg-primary/5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-gray-800 font-medium">
              {displayRating.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-500 text-xs">
              ({reviewCount})
            </span>
          </div>
        </div>
        
        {/* Features with modern icons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mr-2 text-primary">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span>{seats} seats</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mr-2 text-primary">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <span>{topSpeed} km/h</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mr-2 text-primary">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Free cancellation</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mr-2 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>Premium</span>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="flex items-center justify-center">
          <Link 
            href={`/cars/${id}`} 
            className={`w-full py-2.5 px-4 rounded-md font-medium text-white text-center transition-all duration-300 text-sm shadow-md 
              ${available 
                ? 'bg-primary hover:bg-primary/90 hover:shadow-lg' 
                : 'bg-gray-500 opacity-75 cursor-not-allowed'
              }`}
          >
            {available ? "View Details" : "Unavailable"}
          </Link>
        </div>
      </div>
      
      {/* Premium Indicator */}
      {price > 1000 && (
        <div className="absolute -right-10 top-5 w-40 transform rotate-45 bg-primary text-white text-xs font-bold py-1 text-center shadow-md">
          PREMIUM
        </div>
      )}
    </div>
  );
};

export default CarCard;

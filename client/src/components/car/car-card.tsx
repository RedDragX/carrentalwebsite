import { Link } from "wouter";
import { formatCurrency, formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { Heart } from "lucide-react";

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
    <div className="car-card">
      {/* Card Image */}
      <div className="car-card-image">
        <Link href={`/cars/${id}`}>
          <img 
            src={images[0]} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover"
          />
        </Link>
        
        {/* Type Badge */}
        <div className="car-card-badge bg-violet-600 text-white">
          {type}
        </div>
        
        {/* Wishlist button */}
        <button className="car-card-wishlist">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      
      {/* Card Content */}
      <div className="car-card-content">
        {/* Title & Rating */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="car-card-title text-gray-900 dark:text-white">
              {brand} {model}
            </h3>
            <p className="car-card-subtitle">
              {name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              ({reviewCount})
            </span>
          </div>
        </div>
        
        {/* Features */}
        <div className="car-card-features">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14a2 2 0 100-4 2 2 0 000 4zM7 14a2 2 0 100-4 2 2 0 000 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v4m0 8v-4m-8 0h16" />
            </svg>
            <span>{seats} seats</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{topSpeed} km/h</span>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Price per day</span>
            <p className="car-card-price text-gray-900 dark:text-white">{formatCurrency(price)}</p>
          </div>
          <Link 
            href={`/cars/${id}`} 
            className={`btn-turo ${!available ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {available ? "Book Now" : "Unavailable"}
          </Link>
        </div>
        
        {/* Availability Status */}
        {!available && (
          <div className="mt-2 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 py-1 rounded-md">
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCard;

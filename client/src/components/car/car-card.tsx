import { Link } from "wouter";
import { formatCurrency, formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";

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
    type,
    seats,
    topSpeed,
    price,
    images,
    rating,
    available
  } = car;

  // Format the rating from 0-500 scale to 0-5 scale
  const displayRating = formatRating(rating);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <div className="relative h-48 w-full overflow-hidden">
        <Link href={`/cars/${id}`}>
          <img 
            src={images[0]} 
            alt={name} 
            className="w-full h-full object-cover transition-all hover:scale-105"
          />
        </Link>
        <div className="absolute top-0 right-0 bg-accent text-white px-2 py-1 m-2 rounded-md font-medium text-sm">
          {type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link href={`/cars/${id}`}>
            <h3 className="font-heading font-bold text-lg text-primary">{name}</h3>
          </Link>
          <div className="flex items-center">
            <StarRating rating={displayRating} />
            <span className="ml-1 text-neutral-700 font-medium">{displayRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center mt-1 text-neutral-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h2.5a1 1 0 01.8.4l1.5 2a1 1 0 01.2.6V15a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H10a1 1 0 01-1-1v-4a1 1 0 011-1h4z" />
          </svg>
          <span>{seats} seats</span>
          <span className="mx-2">•</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>{topSpeed} km/h</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-neutral-500">Price per day</span>
            <p className="text-primary font-heading font-bold text-xl">{formatCurrency(price)}</p>
          </div>
          <Link href={`/cars/${id}`} className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md font-medium text-sm transition-all">
            {available ? "Book Now" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

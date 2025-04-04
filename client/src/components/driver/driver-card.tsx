import { Link } from "wouter";
import { formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";

interface DriverCardProps {
  driver: {
    id: number;
    name: string;
    experience: number;
    image: string;
    description: string;
    quote: string;
    rating: number;
    tripCount: number;
  };
}

const DriverCard = ({ driver }: DriverCardProps) => {
  const {
    id,
    name,
    experience,
    image,
    quote,
    rating,
    tripCount
  } = driver;

  // Format the rating from 0-500 scale to 0-5 scale
  const displayRating = formatRating(rating);

  return (
    <div className="car-card glass-card rounded-xl overflow-hidden hover:shadow-purple-100/20">
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        {/* Experience badge */}
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full font-medium text-sm shadow-lg">
          {experience}+ years
        </div>
        
        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 text-center">
          <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">{name}</h3>
        </div>
      </div>
      
      <div className="p-5 text-center">
        <div className="flex justify-center items-center -mt-8">
          <div className="bg-white shadow-lg rounded-full px-4 py-1.5 flex items-center">
            <StarRating rating={displayRating} />
            <span className="ml-2 text-neutral-700">({tripCount} trips)</span>
          </div>
        </div>
        
        <blockquote className="mt-4 px-4 py-3 bg-teal-50/30 backdrop-blur-sm rounded-xl border-l-4 border-accent italic text-sm text-neutral-700">
          "{quote}"
        </blockquote>
        
        <div className="mt-5">
          <Link 
            href={`/drivers/${id}`}
            className="btn-hover-effect gradient-primary py-2.5 px-6 rounded-full text-white font-medium text-sm shadow-md hover:shadow-lg inline-flex items-center"
          >
            View Profile
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;

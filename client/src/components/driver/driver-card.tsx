import { Link } from "wouter";
import { formatRating } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { Star, MapPin, Car, Award, ArrowRight, Clock } from "lucide-react";

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
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform">
      {/* Premium Experience Ribbon */}
      {experience > 3 && (
        <div className="absolute -left-16 top-5 w-56 transform -rotate-45 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold py-1 text-center shadow-md z-10">
          VERIFIED EXPERT
        </div>
      )}
      
      {/* Image Container with Overlay */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent opacity-60"></div>
        
        {/* Experience Badge with Icon */}
        <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-md flex items-center px-3 py-1.5 rounded-full shadow-lg border border-white/20">
          <Clock className="h-3.5 w-3.5 text-white mr-1.5" />
          <span className="text-white text-sm font-space">{experience}+ Years</span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mr-1" />
          <span className="text-white text-sm font-medium font-space">{displayRating.toFixed(1)}</span>
        </div>
        
        {/* Driver Info at Bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <h3 className="font-space text-2xl font-bold tracking-tight mb-1 drop-shadow-lg">{name}</h3>
          
          {/* Trip counter */}
          <div className="flex items-center mb-3">
            <Car className="h-4 w-4 text-violet-400 mr-1.5" />
            <span className="text-sm text-gray-200 font-outfit">{tripCount} trips completed</span>
          </div>
          
          {/* Quote with modern styling */}
          <div className="relative">
            <div className="absolute -left-2 -top-2 text-3xl text-violet-500 opacity-50">"</div>
            <blockquote className="pl-3 pr-2 py-2 text-sm italic font-outfit text-gray-100 backdrop-blur-sm bg-black/20 rounded-lg border-l-2 border-violet-500">
              {quote.length > 80 ? quote.substring(0, 80) + '...' : quote}
            </blockquote>
            <div className="absolute -right-1 -bottom-3 text-3xl text-violet-500 opacity-50">"</div>
          </div>
        </div>
      </div>
      
      {/* Call to Action Area */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex justify-between items-center">
        {/* Achievement Badge */}
        <div className="flex items-center">
          <Award className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" />
          <span className="text-sm font-medium font-outfit text-gray-700 dark:text-gray-300">
            {experience > 5 ? 'Elite Driver' : 'Professional'}  
          </span>
        </div>
        
        {/* View Profile Button */}
        <Link
          href={`/drivers/${id}`}
          className="inline-flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-sm shadow-md hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-violet-500/20"
        >
          <span className="font-space">Profile</span>
          <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* Hover effect spotlight */}
      <div className="absolute inset-0 origin-bottom-right bg-gradient-to-br from-violet-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default DriverCard;

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
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <div className="h-56 w-full">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-heading font-bold text-lg text-primary">{name}</h3>
        <p className="text-neutral-600 text-sm">{experience}+ years experience</p>
        <div className="flex justify-center mt-2">
          <StarRating rating={displayRating} />
          <span className="ml-2 text-neutral-700">({tripCount} trips)</span>
        </div>
        <p className="mt-3 text-sm text-neutral-600">"{quote}"</p>
        <div className="mt-4">
          <Link 
            href={`/drivers/${id}`}
            className="text-accent hover:text-accent-dark font-medium text-sm"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;

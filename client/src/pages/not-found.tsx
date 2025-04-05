import { Link } from "wouter";
import { AlertCircle, Car, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="glass-card w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/90 to-violet-600/90 p-6 text-white">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-space font-bold">404 Not Found</h1>
          </div>
          <p className="mt-2 font-poppins text-white/80">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 font-poppins mb-6">
            You might have entered an incorrect URL or the page may have been removed.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-turo flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            
            <Link href="/cars" className="btn-turo-light flex items-center justify-center gap-2">
              <Car className="h-4 w-4" />
              <span>Browse Cars</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="mt-2 flex items-center justify-center gap-1 text-gray-400 hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";

const HeroSection = () => {
  return (
    <div className="relative hero-gradient overflow-hidden min-h-[85vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left py-12">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
              Premium Luxury Car Rental Service
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-heading">
              <span className="block">Premium Cars for</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
                Unforgettable Journeys
              </span>
            </h1>
            
            <p className="mt-6 text-base text-teal-50 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
              Discover our exceptional fleet of luxury and sports cars. Drive yourself or hire one of our professional drivers for a complete experience.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/cars" className="btn-hover-effect gradient-accent shadow-lg text-white px-8 py-4 rounded-full text-base font-medium transition-all inline-flex items-center justify-center hover:shadow-teal-200/20">
                Browse Cars
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link href="/drivers" className="glass-card text-white px-8 py-4 rounded-full text-base font-medium border border-white/10 hover:bg-white/10 transition-all inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Our Drivers
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="float-element glass-card rounded-2xl overflow-hidden shadow-2xl">
              <img 
                className="w-full h-[500px] object-cover object-center transform hover:scale-105 transition-all duration-700" 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Luxury sports car"
              />
              
              {/* Stats floating on image */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="glass-card bg-black/40 px-4 py-2 rounded-xl text-white">
                  <div className="text-xs uppercase">Premium Fleet</div>
                  <div className="text-lg font-bold">20+ Luxury Cars</div>
                </div>
                
                <div className="glass-card bg-black/40 px-4 py-2 rounded-xl text-white">
                  <div className="text-xs uppercase">Expert Drivers</div>
                  <div className="text-lg font-bold">15+ Professionals</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

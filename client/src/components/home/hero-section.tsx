import { Link } from "wouter";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add animation once component is mounted
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background gradient and pattern */}
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
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side content with animations */}
          <div className={`text-center lg:text-left py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '300ms' }}>
            {/* Premium badge */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-md border border-violet-500/20 text-white text-sm font-medium mb-6 shadow-xl shadow-violet-900/20">
              <span className="inline-block mr-2 bg-violet-500 rounded-full h-2 w-2 animate-pulse"></span>
              Premium Luxury Car Rental Service
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-space leading-tight">
              <span className="block mb-1">Experience the</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 drop-shadow-lg">
                Ultimate Driving Thrill
              </span>
            </h1>
            
            {/* Description with aurora glow */}
            <p className="mt-6 text-base text-gray-200 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0 font-outfit relative">
              <span className="absolute -inset-1 bg-gradient-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0 blur-xl opacity-50 rounded-lg -z-10"></span>
              Discover our exceptional fleet of luxury and performance cars. Experience the power of automotive engineering paired with premium comfort.
            </p>
            
            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Link 
                href="/cars" 
                className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-lg text-base font-medium transition-all inline-flex items-center justify-center shadow-lg shadow-violet-700/30 hover:shadow-xl hover:shadow-violet-700/40 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-500/0 via-white/20 to-violet-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative flex items-center">
                  Browse Cars
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/drivers" 
                className="relative overflow-hidden group backdrop-blur-md bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg text-base font-medium transition-all inline-flex items-center justify-center hover:bg-white/10"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Our Drivers
                </span>
              </Link>
            </div>
          </div>
          
          {/* Lambo Car Section with Effects */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '600ms' }}>
            {/* Main car display */}
            <div className="relative overflow-hidden rounded-2xl perspective-1000">
              {/* Lamborghini image */}
              <div className="relative transform hover:scale-105 transition-all duration-700 ease-out group">
                <img 
                  className="w-full object-cover rounded-xl shadow-2xl" 
                  src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80" 
                  alt="Lamborghini Aventador"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Light sweep effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                
                {/* Car info badge */}
                <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 text-white font-space text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="inline-block h-2 w-2 bg-violet-500 rounded-full animate-pulse"></span>
                    <span>LAMBORGHINI</span>
                  </div>
                  <div className="text-xl font-bold mt-0.5">Aventador SVJ</div>
                </div>
                
                {/* Performance stats */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="backdrop-blur-md bg-black/30 px-3 py-2 rounded-lg text-white border border-white/10">
                    <div className="text-xs text-violet-300 font-medium">TOP SPEED</div>
                    <div className="text-lg font-bold font-space">350 km/h</div>
                  </div>
                  
                  <div className="backdrop-blur-md bg-black/30 px-3 py-2 rounded-lg text-white border border-white/10">
                    <div className="text-xs text-violet-300 font-medium">0-100 KM/H</div>
                    <div className="text-lg font-bold font-space">2.8 sec</div>
                  </div>
                  
                  <div className="backdrop-blur-md bg-black/30 px-3 py-2 rounded-lg text-white border border-white/10">
                    <div className="text-xs text-violet-300 font-medium">POWER</div>
                    <div className="text-lg font-bold font-space">770 HP</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements and glow effects */}
            <div className="absolute -top-10 right-20 w-32 h-32 bg-violet-600/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Premium tag */}
            <div className="absolute -right-10 top-6 w-40 transform rotate-45 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold py-1 text-center shadow-lg z-20">
              SUPERCAR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

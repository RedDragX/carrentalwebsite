import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserContext } from "../../App";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isLoggedIn, setUser } = useContext(UserContext);
  
  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-navbar' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-heading font-bold text-2xl">
                ZORO<span className="text-accent">CARS</span>
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className={`${
                isActive('/') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'text-neutral-700 hover:text-accent font-medium animated-underline'
              } px-1 py-4 transition-all`}>
                Home
              </Link>
              <Link href="/cars" className={`${
                isActive('/cars') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'text-neutral-700 hover:text-accent font-medium animated-underline'
              } px-1 py-4 transition-all`}>
                Cars
              </Link>
              <Link href="/drivers" className={`${
                isActive('/drivers') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'text-neutral-700 hover:text-accent font-medium animated-underline'
              } px-1 py-4 transition-all`}>
                Drivers
              </Link>
              <a href="#about" className="text-neutral-700 hover:text-accent font-medium px-1 py-4 animated-underline transition-all">
                About
              </a>
              <a href="#contact" className="text-neutral-700 hover:text-accent font-medium px-1 py-4 animated-underline transition-all">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex md:items-center bg-teal-50/70 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold mr-2">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-neutral-700 mr-2">{user?.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-4 text-neutral-700 hover:text-accent px-3 py-2 rounded-full text-sm font-medium border border-neutral-200 hover:border-accent transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-neutral-700 hover:text-accent px-3 py-2 rounded-full text-sm font-medium border border-neutral-200 hover:border-accent transition-all">
                  Sign In
                </Link>
                <Link href="/register" className="ml-4 px-5 py-2.5 rounded-full text-sm font-medium gradient-accent text-white hover:shadow-lg transition-all btn-hover-effect">
                  Register
                </Link>
              </>
            )}
            <div className="md:hidden flex items-center ml-4">
              <button 
                onClick={toggleMobileMenu}
                type="button" 
                className="text-neutral-700 hover:text-accent focus:outline-none bg-white/50 backdrop-blur-sm p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden glass-panel mt-2 mx-4 rounded-xl overflow-hidden transition-all duration-300`}>
        <div className="px-2 py-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-accent' : 'text-neutral-700 hover:bg-neutral-100/80'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/cars" 
            className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
              isActive('/cars') ? 'bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-accent' : 'text-neutral-700 hover:bg-neutral-100/80'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cars
          </Link>
          <Link 
            href="/drivers" 
            className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
              isActive('/drivers') ? 'bg-gradient-to-r from-teal-500/20 to-teal-400/10 text-accent' : 'text-neutral-700 hover:bg-neutral-100/80'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Drivers
          </Link>
          <a 
            href="#about" 
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100/80"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="block px-4 py-2.5 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100/80"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
          
          <div className="pt-4 mt-4 border-t border-neutral-200/30">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2.5 flex items-center">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold mr-2">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-neutral-700">{user?.username}</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-red-500 hover:bg-red-50/50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/login" 
                  className="block px-4 py-2.5 rounded-lg text-center text-base font-medium border border-neutral-200 text-neutral-700 hover:border-accent hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-2.5 rounded-lg text-center text-base font-medium gradient-accent text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { UserContext } from "../../App";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoggedIn, setUser } = useContext(UserContext);
  
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-heading font-bold text-2xl">ZORO<span className="text-accent">CARS</span></span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'text-primary font-medium border-b-2 border-accent' : 'text-neutral-500 hover:text-primary font-medium hover:border-b-2 hover:border-accent'} px-1 py-2 transition-all`}>
                Home
              </Link>
              <Link href="/cars" className={`${isActive('/cars') ? 'text-primary font-medium border-b-2 border-accent' : 'text-neutral-500 hover:text-primary font-medium hover:border-b-2 hover:border-accent'} px-1 py-2 transition-all`}>
                Cars
              </Link>
              <Link href="/drivers" className={`${isActive('/drivers') ? 'text-primary font-medium border-b-2 border-accent' : 'text-neutral-500 hover:text-primary font-medium hover:border-b-2 hover:border-accent'} px-1 py-2 transition-all`}>
                Drivers
              </Link>
              <a href="#about" className="text-neutral-500 hover:text-primary font-medium px-1 py-2 hover:border-b-2 hover:border-accent transition-all">
                About
              </a>
              <a href="#contact" className="text-neutral-500 hover:text-primary font-medium px-1 py-2 hover:border-b-2 hover:border-accent transition-all">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <span className="hidden md:inline text-neutral-500 mr-4">Welcome, {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-neutral-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-dark transition-all">
                  Register
                </Link>
              </>
            )}
            <div className="md:hidden flex items-center ml-4">
              <button 
                onClick={toggleMobileMenu}
                type="button" 
                className="text-neutral-500 hover:text-primary focus:outline-none"
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
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-accent text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/cars" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/cars') ? 'bg-accent text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cars
          </Link>
          <Link 
            href="/drivers" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/drivers') ? 'bg-accent text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Drivers
          </Link>
          <a 
            href="#about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
          {isLoggedIn ? (
            <button 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-neutral-500 hover:bg-neutral-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-accent text-white hover:bg-accent-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

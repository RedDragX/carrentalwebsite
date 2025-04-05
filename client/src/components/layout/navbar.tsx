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
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-xl bg-gradient-to-r from-gray-900/80 via-violet-950/80 to-gray-900/80 border-b border-violet-500/10 shadow-lg' 
        : 'bg-transparent backdrop-blur-sm bg-black/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 w-full">
        <div className="flex items-center justify-between">
          {/* Mobile menu */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto glass-dark px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                      <span className="logo-text text-2xl">
                        <span className="bg-gradient-to-r from-primary to-violet-500 text-transparent bg-clip-text">ZORO</span>
                        <span className="bg-gradient-to-r from-blue-400 to-accent text-transparent bg-clip-text">CARS</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-6 flow-root">
                    <div className="space-y-2 py-6">
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 ${
                          isActive('/') ? 'text-violet-400' : 'text-gray-200 hover:bg-gray-800/60'
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="/cars"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 ${
                          isActive('/cars') ? 'text-violet-400' : 'text-gray-200 hover:bg-gray-800/60'
                        }`}
                      >
                        Cars
                      </Link>
                      <Link
                        href="/drivers"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 ${
                          isActive('/drivers') ? 'text-violet-400' : 'text-gray-200 hover:bg-gray-800/60'
                        }`}
                      >
                        Drivers
                      </Link>
                      <a 
                        href="#about" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-200 hover:bg-gray-800/60"
                      >
                        About
                      </a>
                      <a 
                        href="#contact" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium leading-7 text-gray-200 hover:bg-gray-800/60"
                      >
                        Contact
                      </a>
                    </div>
                    
                    <div className="border-t border-gray-700/50 py-6">
                      {isLoggedIn ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 px-3">
                            <div className="w-10 h-10 rounded-full ring-2 ring-violet-500/30 bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-base font-semibold text-white font-space">{user?.username}</p>
                              <p className="text-sm text-gray-400 font-outfit">{user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <a className="block px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-800/60 rounded-lg">Profile</a>
                            <a className="block px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-800/60 rounded-lg">Bookings</a>
                            <button 
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                              className="block w-full text-left px-3 py-2 text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-gray-800/60 rounded-lg"
                            >
                              Log Out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 px-3">
                          <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center py-2.5 px-3 rounded-lg text-gray-200 font-space text-base font-medium border border-gray-700 hover:bg-gray-800/60"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center py-2.5 px-3 rounded-lg font-space text-base font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
                          >
                            Register
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="logo-text text-2xl lg:text-3xl">
                <span className="bg-gradient-to-r from-primary to-violet-500 text-transparent bg-clip-text drop-shadow-sm">ZORO</span>
                <span className="bg-gradient-to-r from-blue-400 to-accent text-transparent bg-clip-text drop-shadow-sm">CARS</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-6 justify-center">
            <Link 
              href="/" 
              className={`relative font-space text-sm font-medium px-3 py-2 ${
                isActive('/') 
                  ? 'text-violet-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-500/50' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/cars" 
              className={`relative font-space text-sm font-medium px-3 py-2 ${
                isActive('/cars') 
                  ? 'text-violet-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-500/50' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Cars
            </Link>
            <Link 
              href="/drivers" 
              className={`relative font-space text-sm font-medium px-3 py-2 ${
                isActive('/drivers') 
                  ? 'text-violet-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-500/50' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Drivers
            </Link>
            <a 
              href="#about" 
              className="relative font-space text-sm font-medium text-gray-300 hover:text-white px-3 py-2"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="relative font-space text-sm font-medium text-gray-300 hover:text-white px-3 py-2"
            >
              Contact
            </a>
          </div>
          
          {/* User account section */}
          <div className="hidden lg:flex lg:items-center">
            {isLoggedIn ? (
              <div className="relative group">
                <button 
                  type="button" 
                  className="flex items-center gap-x-2 text-sm font-space leading-6 text-gray-200"
                >
                  <div className="w-9 h-9 rounded-full ring-2 ring-violet-500/30 bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-base shadow-lg">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 max-w-[100px] truncate">{user?.username}</span>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-xl bg-gray-900/90 backdrop-blur-xl py-2 shadow-xl ring-1 ring-white/10 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    <p className="text-sm text-gray-400 font-outfit">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate font-space">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <a className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 font-outfit">Profile</a>
                    <a className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 font-outfit">Bookings</a>
                  </div>
                  <div className="py-1 border-t border-gray-700/50">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm font-outfit text-rose-400 hover:text-rose-300 hover:bg-gray-800/60"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-space font-medium text-gray-300 hover:text-white px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-space font-medium text-white shadow-sm hover:from-violet-700 hover:to-purple-700 transition-all duration-300 hover:shadow-violet-500/20 hover:shadow-lg"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

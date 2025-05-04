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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-xl bg-purple-950/30 shadow-lg border-b border-purple-800/20' 
        : 'bg-transparent backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 py-4 w-full">
        <nav className="relative flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/10 backdrop-blur-xl text-gray-200 hover:bg-white/20 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
                
                {/* Mobile menu panel */}
                <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-gradient-to-b from-purple-950 to-gray-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-purple-800/20">
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                      <span className="logo-text text-2xl">
                        <span className="bg-gradient-to-r from-purple-400 to-violet-500 text-transparent bg-clip-text font-bold">ZORO</span>
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text font-bold">CARS</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="rounded-full flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flow-root">
                    <div className="space-y-2">
                      {[
                        { label: "Home", href: "/" },
                        { label: "Cars", href: "/cars" },
                        { label: "Drivers", href: "/drivers" },
                        { label: "About", href: "#about" },
                        { label: "Contact", href: "#contact" }
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block rounded-xl px-4 py-3 text-base font-medium ${
                            isActive(item.href) 
                            ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 text-fuchsia-300 border border-purple-500/30' 
                            : 'text-gray-200 hover:bg-purple-800/30'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      {isLoggedIn ? (
                        <div className="space-y-5">
                          {/* User profile */}
                          <div className="p-4 rounded-xl bg-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-base font-semibold text-white font-space">{user?.username}</p>
                              <p className="text-sm text-gray-400 font-outfit truncate max-w-[200px]">{user?.email}</p>
                            </div>
                          </div>
                          
                          {/* User actions */}
                          <div className="space-y-2">
                            <a className="block px-4 py-3 rounded-xl text-gray-200 hover:bg-white/5 font-medium font-space">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                My Profile
                              </span>
                            </a>
                            <a className="block px-4 py-3 rounded-xl text-gray-200 hover:bg-white/5 font-medium font-space">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                My Bookings
                              </span>
                            </a>
                            <button 
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 font-medium font-space"
                            >
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Log Out
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center py-3.5 px-4 rounded-xl bg-purple-800/30 text-gray-100 font-medium border border-purple-700/30 hover:bg-purple-700/40 transition-all duration-300"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center py-3.5 px-4 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                          >
                            Create Account
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
              <span className="logo-text text-2xl lg:text-3xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-violet-500 text-transparent bg-clip-text">ZORO</span>
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">CARS</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-1 items-center justify-center">
            {[
              { label: "Home", href: "/" },
              { label: "Cars", href: "/cars" },
              { label: "Drivers", href: "/drivers" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" }
            ].map((item) => (
              <Link 
                key={item.label}
                href={item.href} 
                className={`relative text-sm font-medium rounded-lg px-4 py-2.5 transition-all duration-300 ${
                  isActive(item.href) 
                    ? 'text-white bg-purple-700/80 backdrop-blur-sm shadow-md shadow-purple-900/20' 
                    : 'text-white hover:text-white hover:bg-purple-800/30 backdrop-blur-sm'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-fuchsia-400 to-purple-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>
          
          {/* User account section */}
          <div className="hidden lg:flex lg:items-center">
            {isLoggedIn ? (
              <div className="relative group">
                <button 
                  type="button" 
                  className="flex items-center gap-x-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-space leading-6 text-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 max-w-[100px] truncate">{user?.username}</span>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-gradient-to-b from-gray-900 to-gray-950 py-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-gray-400 font-outfit">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate font-space">{user?.email}</p>
                  </div>
                  
                  <div className="py-2 px-1">
                    <a className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg font-outfit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </a>
                    <a className="flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg font-outfit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Bookings
                    </a>
                  </div>
                  
                  <div className="py-1 border-t border-gray-800 px-1 mt-1">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2.5 text-sm font-outfit text-rose-400 hover:text-rose-300 hover:bg-rose-900/10 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white px-4 py-2.5 rounded-lg hover:bg-purple-800/30 backdrop-blur-sm transition-all duration-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

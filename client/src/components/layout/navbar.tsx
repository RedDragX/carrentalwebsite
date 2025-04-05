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
    <div className={`navbar sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-navbar' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={toggleMobileMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            {mobileMenuOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 glass-card rounded-box w-52 shadow-xl">
                <li>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className={isActive('/') ? 'text-accent font-medium' : ''}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/cars" onClick={() => setMobileMenuOpen(false)} className={isActive('/cars') ? 'text-accent font-medium' : ''}>
                    Cars
                  </Link>
                </li>
                <li>
                  <Link href="/drivers" onClick={() => setMobileMenuOpen(false)} className={isActive('/drivers') ? 'text-accent font-medium' : ''}>
                    Drivers
                  </Link>
                </li>
                <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
                <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
                
                <div className="divider my-2"></div>
                
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 flex items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100 bg-primary text-white flex items-center justify-center font-bold">
                          {user?.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <span className="ml-2">{user?.username}</span>
                    </div>
                    <li>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-error"
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <div className="px-4 py-2 flex flex-col gap-2">
                    <Link 
                      href="/login" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className="btn btn-primary btn-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </ul>
            )}
          </div>
          
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-primary font-heading font-bold text-2xl lg:text-3xl">
              ZORO<span className="text-accent">CARS</span>
            </span>
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link href="/" className={`${
                isActive('/') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'hover:text-accent font-medium animated-underline'
              } px-2`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/cars" className={`${
                isActive('/cars') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'hover:text-accent font-medium animated-underline'
              } px-2`}>
                Cars
              </Link>
            </li>
            <li>
              <Link href="/drivers" className={`${
                isActive('/drivers') 
                  ? 'text-accent font-medium animated-underline after:w-full' 
                  : 'hover:text-accent font-medium animated-underline'
              } px-2`}>
                Drivers
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-accent font-medium px-2 animated-underline">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-accent font-medium px-2 animated-underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        
        <div className="navbar-end">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 bg-primary text-white flex items-center justify-center font-bold">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content glass-card rounded-box w-52">
                  <li className="font-semibold px-4 py-2">{user?.username}</li>
                  <div className="divider my-0"></div>
                  <li><a>Profile</a></li>
                  <li><a>Bookings</a></li>
                  <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-accent btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

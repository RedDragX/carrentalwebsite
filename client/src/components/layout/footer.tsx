import { Link } from "wouter";

const Footer = () => {
  return (
    <footer id="contact" className="relative pt-16 pb-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-t from-fuchsia-400/15 to-transparent"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter signup */}
        <div className="bg-purple-900/30 backdrop-blur-sm mb-16 p-8 rounded-2xl border border-purple-500/20 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white font-heading">Get Updates & Exclusive Offers</h3>
              <p className="text-purple-100 mt-2">Subscribe to our newsletter and be the first to know about new cars and special promotions.</p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow bg-white/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-purple-500/30 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white font-heading mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-violet-500 text-transparent bg-clip-text">ZORO</span>
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">CARS</span>
            </h3>
            <p className="text-purple-100 mb-6">Experience luxury and performance with our premium car rental service. Choose from our exclusive collection of high-end vehicles.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-600/40 hover:text-white text-purple-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4 fill-current">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-600/40 hover:text-white text-purple-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-600/40 hover:text-white text-purple-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-current">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-600/40 hover:text-white text-purple-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-current">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-2 border-b border-purple-500/20">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Cars
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Drivers
                </Link>
              </li>
              <li>
                <a href="#about" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-2 border-b border-purple-500/20">Car Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/cars?type=Luxury" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Sports" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Sports Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?type=SUV" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Convertible" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Convertibles
                </Link>
              </li>
              <li>
                <Link href="/cars?type=Sedan" className="text-purple-100 hover:text-fuchsia-300 animated-underline inline-flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Sedans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-2 border-b border-purple-500/20">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="min-w-[40px] h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-purple-100 mt-2">123 Luxury Lane, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center">
                <div className="min-w-[40px] h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-purple-100">+1 (888) 555-ZORO</span>
              </li>
              <li className="flex items-center">
                <div className="min-w-[40px] h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-purple-100">info@zorocars.com</span>
              </li>
              <li className="flex items-center">
                <div className="min-w-[40px] h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-teal-100">Mon-Sun: 8AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center">
          <p className="text-teal-200/60 text-sm">© {new Date().getFullYear()} Zoro Cars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

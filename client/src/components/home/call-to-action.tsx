import { Link } from "wouter";

const CallToAction = () => {
  return (
    <section className="py-16 relative" style={{ background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(167, 139, 250, 0.05))' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-700 to-violet-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 lg:py-16 lg:px-16 md:flex md:items-center md:justify-between relative z-10">
            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
            
            <div className="max-w-3xl relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading">
                Ready for an Unforgettable Drive?
              </h2>
              <p className="mt-3 text-lg text-purple-100 md:max-w-md">
                Whether it's a special occasion or you just want to experience luxury, our premium fleet is waiting for you.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col md:flex-row md:items-center gap-4">
              <Link href="/cars" className="bg-white text-purple-700 px-6 py-3 rounded-md font-bold text-center transition-all hover:bg-purple-50 shadow-md">
                Browse Cars
              </Link>
              <a href="#contact" className="bg-purple-900/40 backdrop-blur-sm text-white border border-purple-400/30 px-6 py-3 rounded-md font-bold text-center transition-all hover:bg-purple-900/60 shadow-md">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

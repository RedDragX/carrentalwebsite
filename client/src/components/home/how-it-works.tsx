const HowItWorks = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary font-heading">How Zoro Cars Works</h2>
          <p className="mt-2 text-neutral-600">Three simple steps to your perfect car rental experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-light text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary font-heading">1. Search & Select</h3>
            <p className="mt-2 text-neutral-600">Browse our extensive collection of premium cars and choose the perfect one for your needs.</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-light text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm-4-4H7v2h2V7zm4 0h-2v2h2V7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary font-heading">2. Book & Pay</h3>
            <p className="mt-2 text-neutral-600">Select your dates, choose optional services like professional drivers, and complete your booking.</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-light text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h2.5a1 1 0 01.8.4l1.5 2a1 1 0 01.2.6V15a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H10a1 1 0 01-1-1v-4a1 1 0 011-1h4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary font-heading">3. Enjoy Your Ride</h3>
            <p className="mt-2 text-neutral-600">Pick up your car at the designated location and start your premium driving experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

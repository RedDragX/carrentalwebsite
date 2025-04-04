import { Link } from "wouter";

const CallToAction = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 lg:py-16 lg:px-16 md:flex md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading">
                Ready for an Unforgettable Drive?
              </h2>
              <p className="mt-3 text-lg text-neutral-300 md:max-w-md">
                Whether it's a special occasion or you just want to experience luxury, our premium fleet is waiting for you.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col md:flex-row md:items-center gap-4">
              <Link href="/cars" className="bg-white text-primary px-6 py-3 rounded-md font-bold text-center transition-all hover:bg-neutral-100">
                Browse Cars
              </Link>
              <a href="#contact" className="bg-accent text-white px-6 py-3 rounded-md font-bold text-center transition-all hover:bg-accent-dark">
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

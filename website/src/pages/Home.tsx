import React, { useState } from 'react';
import MintLogo from '../images/icon/mint-logo.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <header className="bg-slate-950">
        <nav className="container relative flex items-center justify-between px-6 py-8 mx-auto text-white">
          <a href="#">
            <img className="w-16" src={MintLogo} alt="Logo" />
          </a>

          {/* <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button> */}

          {/* <div
            className={`absolute inset-x-0 z-30 w-full px-6 py-8 mt-4 space-y-6 transition-all duration-300 ease-in-out bg-indigo-600 top-16 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:space-y-0 md:-mx-6 md:flex md:items-center ${
              isOpen
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 -translate-x-full'
            }`}
          >
            <a
              href="#"
              className="block text-white transition-colors duration-300 md:px-6 hover:text-indigo-300"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-white transition-colors duration-300 md:px-6 hover:text-indigo-300"
            >
              {' '}
              About
            </a>
            <a
              href="#"
              className="block text-white transition-colors duration-300 md:px-6 hover:text-indigo-300"
            >
              {' '}
              Portfolio
            </a>
            <a
              href="#"
              className="block text-white transition-colors duration-300 md:px-6 hover:text-indigo-300"
            >
              {' '}
              Blogs
            </a>
            <a
              href="#"
              className="block text-white transition-colors duration-300 md:px-6 hover:text-indigo-300"
            >
              {' '}
              Contact
            </a>
          </div> */}
        </nav>
      </header>
      <main>
        <section>
          <div className="relative grid w-full bg-green-900 h-96 lg:h-[32rem] place-items-center">
            <div className="flex flex-col items-center mx-auto text-center">
              <h1 className="text-4xl font-semibold text-white uppercase md:text-6xl">
                Coming Soon!
              </h1>
              <p className="mt-6 text-lg leading-5 text-white">
                A CRM for your business that you can customize to your needs.
              </p>
              <a href="#about" className="mt-8 cursor-pointer animate-bounce">
                <svg
                  width="53"
                  height="53"
                  viewBox="0 0 53 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="27"
                    cy="26"
                    r="18"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>
          <svg
            className="fill-green-900"
            viewBox="0 0 1440 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1440 0H0V57C720 0 1440 57 1440 57V0Z" />
          </svg>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="about">
          <div className="lg:flex lg:items-center lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
                MintChoccy CRM: Streamlined Client Management with Customizable
                Intelligence
              </h3>
              <p className="mt-6 text-gray-500 ">
                Unlock the power of client management with MintChoccy CRM, your
                go-to solution engineered to enhance your business interactions
                straight out of the box. MintChoccy offers a robust suite of
                features designed to optimize your workflow, improve client
                relations, and boost productivity. From seamless contact
                management to efficient task tracking and comprehensive reports,
                you get everything you need to manage your clients effectively.
                <br /><br />
                But MintChoccy doesn't stop there. For businesses looking to go
                beyond the standard, we offer premium customization options.
                Tailor your CRM with specialized development services and
                cutting-edge AI features that adapt to your unique business
                requirements. Whether you need advanced analytics, predictive
                customer behavior models, or automated marketing tools,
                MintChoccy can be customized to suit your needs. Invest in
                MintChoccy's custom solutions to transform your customer
                relationship management into a powerful, intelligent engine that
                drives your business forward.
              </p>
              {/* <button className="flex items-center mt-8 -mx-2 text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 mx-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mx-1 font-semibold">PLAY VIDEO</p>
              </button> */}
            </div>
            <div className="mt-8 lg:w-1/2 lg:px-4 lg:mt-0">
              <img
                className="object-cover w-full rounded-xl h-96"
                src="https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                alt="Video thumbnail"
              />
            </div>
          </div>
        </section>

        {/* More sections can be converted similarly */}
      </main>
      <footer className="flex flex-col items-center py-20 text-white bg-slate-950">
        <p className="text-center">Copyright © 2024, Mint Choccy.</p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mt-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </footer>
    </div>
  );
};

export default Header;

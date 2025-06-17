'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxATAjMSQUC_t2U1LNo8EFyMVMViFRXDTs2o_8xZeg5Y64hHNcfIw9OwcwP10dztCng/exec',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ email }),
        }
      );

      const result = await response.json();
      if (result.result === 'success') {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Coming Soon</title>
        <link rel="icon" href="4neco.ico" />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.2),
                transparent 60%
              )`,
            zIndex: 1,
            transition: 'background 0.1s ease',
          }}
        ></div>

        <div className="relative z-10 max-w-2xl w-full text-center p-6 bg-opacity-80 bg-black rounded-lg">
          <img
            src="/honourimage.jpg"
            alt="Honour Equality and Equity"
            className="mx-auto max-w-[25rem] max-h-[21rem] mb-8 rounded-lg shadow-lg object-contain"
          />
          <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-lg mb-8">
            We're building something amazing. Stay updated by signing up for updates.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-white sm:w-72"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-md hover:bg-gray-100 hover:scale-105 transition-transform"
            >
              Notify Me
            </button>
          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}
           {/* Visit us and Contact Us Section */}
          <footer className="mt-12 text-sm px-4 space-y-2">
            <p className="text-lg font-semibold">
              <a
                href="https://www.honour.app"
                className="underline text-blue-400 hover:text-blue-500 transition-all"
              >
                Visit us at www.honour.app
              </a>
            </p>
            <p className="text-lg font-semibold">
              <a
                href="https://www.honour.app/en/cntct6011"
                className="underline text-blue-400 hover:text-blue-500 transition-all"
              >
                Contact us here
              </a>
            </p>
          </footer>
        </div>

        <div
          className="absolute w-40 h-40 rounded-full bg-green-300 blur-lg opacity-50"
          style={{
            top: `${20 + mousePosition.y * 20}%`,
            left: `${10 + mousePosition.x * 20}%`,
            zIndex: 0,
            transition: 'top 0.1s ease, left 0.1s ease',
          }}
        ></div>
        <div
          className="absolute w-60 h-60 rounded-full bg-blue-300 blur-lg opacity-50"
          style={{
            bottom: `${10 + mousePosition.y * 20}%`,
            right: `${15 + mousePosition.x * 20}%`,
            zIndex: 0,
            transition: 'bottom 0.1s ease, right 0.1s ease',
          }}
        ></div>
      </div>
    </>
  );
}

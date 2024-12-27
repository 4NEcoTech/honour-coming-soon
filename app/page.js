'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Submit email via FormSubmit
      const response = await fetch('https://formsubmit.co/0af46cfe4919596776f18a4ad4ac560c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Thank you for subscribing! We’ll keep you updated.');
        setEmail('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Favicon and Meta Tags */}
      <Head>
        <title>Coming Soon</title>
        <link rel="icon" href="4neco.ico" />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white overflow-hidden">
        {/* Background Animation */}
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

        {/* Main Content */}
        <div className="relative z-10 max-w-2xl w-full text-center p-6 bg-opacity-80 bg-black rounded-lg">
          <img
            src="/4N_Square-removebg.png"
            alt="4Necotech Logo"
            className="mx-auto w-32 mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-lg mb-8">
            We're building something amazing. Stay updated by signing up for updates.
          </p>
          <form
            action="https://formsubmit.co/0af46cfe4919596776f18a4ad4ac560c"
            method="POST"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-white sm:w-64"
              required
            />
            {/* Hidden Inputs for FormSubmit Enhancements */}
            <input
              type="hidden"
              name="_webhook"
              value="https://script.google.com/macros/s/AKfycbzaeH_pacJRQooWt4xufHN0q7cdjh0P1orDawmp54Y8v1VST0GN_qFhgLM82rmkpJyh/exec"
            />
            <input
              type="hidden"
              name="_autoresponse"
              value="Thank you for subscribing to Honour updates!"
            />
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_blacklist"
              value="spam,badword,blocked"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Notify Me
            </button>
          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}
          <footer className="mt-12 text-sm">
            Contact us at{' '}
            <a href="mailto:thehonourenterprise@gmail.com" className="underline">
              thehonourenterprise@gmail.com
            </a>
          </footer>
        </div>

        {/* Floating Decorations */}
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

import React, { useContext, useState } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import img2 from "../img/mainimg2.png";
import img3 from "../img/mainimg3.png";
import img5 from "../img/mainimg5.png"; // Laptop background image
import img6 from "../img/mainimg6.png"; // Tablet background image
import img7 from "../img/mainimg7.png"; // Mobile background image
import './hero.css';

const Hero = () => {
  const { currency, conversionRates } = useContext(ProductContext);
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Fallback to 1 if currency or conversion rate is not defined
  const conversionRate = conversionRates?.[currency] || 1;
  const freeDeliveryThresholdUSD = 120; // Threshold in USD
  const freeDeliveryThreshold = (freeDeliveryThresholdUSD * conversionRate).toFixed(2); // Convert to selected currency

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('INDIAISGREAT').then(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000); // Hide the toast after 3 seconds
    });
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `rotateX(${y / 10}deg) rotateY(${x / 10}deg)`;

    const posX = ((x + rect.width / 2) / rect.width) * 100;
    const posY = ((y + rect.height / 2) / rect.height) * 100;

    card.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(169, 169, 169, 0.6) 5%, transparent 60%)`;

    card.style.borderTop = `4px solid transparent`;
    card.style.borderRight = `4px solid transparent`;
    card.style.borderBottom = `4px solid transparent`;
    card.style.borderLeft = `4px solid transparent`;

    card.style.borderImage = `
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.9) ${posX - 5}%,
        rgba(0, 0, 0, 0.3) ${posX + 10}%
      ) 1 0,
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.9) ${posY - 5}%,
        rgba(0, 0, 0, 0.3) ${posY + 10}%
      ) 1 0,
      linear-gradient(
        to left,
        rgba(0, 0, 0, 0.9) ${100 - posX - 5}%,
        rgba(0, 0, 0, 0.3) ${100 - posX + 10}%
      ) 1 0,
      linear-gradient(
        to top,
        rgba(0, 0, 0, 0.9) ${100 - posY - 5}%,
        rgba(0, 0, 0, 0.3) ${100 - posY + 10}%
      ) 1 0;
    `;

    card.style.boxShadow = `0 10px 20px rgba(169, 169, 169, 0.7), 0 6px 6px rgba(169, 169, 169, 0.5)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'rotateX(0) rotateY(0)'; // Reset transform
    card.style.background = ''; // Remove the light spot when the mouse leaves
    card.style.borderImage = ''; // Remove the border gradient
    card.style.boxShadow = ''; // Remove shadow or glow effect
  };

  return (
    <div className='bg-gray-50 pt-24'>
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-2 bg-gray-200 p-10 flex items-center justify-between min-h-[300px] hero-bg"
          >
            <div className="flex flex-col justify-center">
              <h1 className="lg:text-3xl md:text-3xl text-2xl font-bold text-gray-800 mb-6">Independence Day Sale 30% Off</h1>
              <p className="lg:text-lg md:text-md text-md text-gray-600 mb-8">
                Unlock incredible savings with our special offer! Enjoy 30% off on all products sitewide.
              </p>
              <div className="relative">
                <button
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 lg:text-md md:text-md text-sm"
                  onClick={handleCopyCoupon}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Use Code: INDIAISGREAT
                </button>
                {isHovered && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded-lg py-1 px-2">
                    Click to copy
                  </div>
                )}
                {showToast && (
                  <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-md z-50">
                    Coupon code copied!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:col-span-1">
            <div
              className="bg-gray-200 p-4 text-center flex items-center justify-center transition-transform duration-300 hover:shadow-lg"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <img src={img3} alt="Summer Travel Collection" className="w-36 h-36 mx-auto mb-4 object-contain" />
                <h2 className="lg:text-lg md:text-md text-md font-semibold text-gray-800">Summer Travel Collection</h2>
                <a href="/" className="text-blue-600 hover:underline lg:text-md md:text-sm text-sm">Discover Now</a>
              </div>
            </div>
            <div
              className="bg-gray-200 p-4 text-center flex items-center justify-center transition-transform duration-300 hover:shadow-lg"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <img src={img2} alt="Get 30% Off On iPhone" className="w-36 h-36 mx-auto mb-4 object-contain" />
                <h2 className="lg:text-lg md:text-md text-md font-semibold text-gray-800">
                  Free delivery on orders above {currency} {freeDeliveryThreshold}
                </h2>
                <a href="#" className="text-blue-600 hover:underline lg:text-md md:text-sm text-sm  ">Shop Now</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;

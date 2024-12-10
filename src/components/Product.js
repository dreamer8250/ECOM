import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faFire } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../contexts/CartContext';

const Product = ({ product, formatPrice, trimProductTitle }) => {
  const { addToCart } = useContext(CartContext);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);

    // Reset animation state after the full sequence is done
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // Total duration of the animation
  };

  return (
    <div
      key={product.id}
      className='border bg-gray-200 border-gray-200 rounded-lg overflow-hidden shadow-md relative flex flex-col justify-between transform transition-transform duration-500 hover:scale-105 hover:bg-gray-300'
    >
      {/* Badges */}
      {product.isNew && (
        <span className='absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded'>
          New
        </span>
      )}
      {product.isHot && (
        <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center'>
          <FontAwesomeIcon icon={faFire} className="mr-1" /> Hot
        </span>
      )}
      {product.discount && (
        <span className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded'>
          -{product.discount}%
        </span>
      )}
      {/* Product Image */}
      <img src={product.image} alt={product.title} className='w-full h-64 object-contain p-4' />
      {/* Product Details */}
      <div className='p-4 flex-grow flex flex-col justify-between'>
        <div>
          <a>
            <h2 className='font-medium lg:text:lg md:text-md text-sm mb-2 text-center hover:text-blue-700'>{trimProductTitle(product.title)}</h2>
          </a>
          <p className=' lg:text:lg md:text-md text-md my-4 text-gray-900 font-semibold mb-2 text-center'>
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className='line-through text-gray-500 ml-2'>{formatPrice(product.originalPrice)}</span>
            )}
          </p>
        </div>
        <div className='mt-4'>
          <button 
            onClick={handleAddToCart}
            className={`relative bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition w-full cart-button ${isAnimating ? 'animate' : ''}`}
            style={{ overflow: 'hidden', position: 'relative', height: '2.5rem' }} // Maintain a consistent button height
          >
            <span className='inline-flex items-center justify-center'>
              <FontAwesomeIcon 
                icon={faShoppingCart} 
                className={`transition-all duration-1000 ${isAnimating ? 'move-icon' : 'opacity-0'}`} 
                style={{ 
                  left: isAnimating ? '80%' : '0', 
                  position: isAnimating ? 'absolute' : 'absolute', 
                  visibility: isAnimating ? 'visible' : 'hidden',
                  fontSize: '1.5em'  // This will increase the size by 1.5 times
                }} 
              />
            </span>
            <span
              className={` lg:text:lg md:text-md text-md absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            >
              Add to Cart
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 delay-600 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            >
              Added
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

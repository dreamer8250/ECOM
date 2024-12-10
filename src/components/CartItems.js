// src/components/CartItems.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const CartItems = ({ item, currency, conversionRates, removeFromCart, updateQuantity, formatPrice }) => {
  const itemPrice = item.price / conversionRates[item.currency] * conversionRates[currency];
  const originalPrice = itemPrice.toFixed(2);
  const discountedPrice = item.discount
    ? (itemPrice * (1 - item.discount / 100)).toFixed(2)
    : originalPrice;

  return (
    <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <a href="#" className="shrink-0 md:order-1">
          <img className="h-20 w-20" src={item.image} alt={item.title} />
        </a>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (item.quantity === 1) {
                  removeFromCart(item.id);
                } else {
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-red-500 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <FontAwesomeIcon icon={faMinus} className="text-red-700 dark:text-white" />
            </button>
            <input
              type="text"
              className="w-10 text-center text-sm font-medium text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white"
              value={item.quantity}
              readOnly
            />
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-green-500 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <FontAwesomeIcon icon={faPlus} className="text-green-700 dark:text-white" />
            </button>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {formatPrice(discountedPrice * item.quantity)}
            </p>
            {item.discount && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(originalPrice * item.quantity)}
              </p>
            )}
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <a href="#" className="lg:text-md md:text-md text-sm text-base font-medium text-gray-900 hover:underline dark:text-white">
            {item.title}
          </a>
          {item.discount && (
            <span className="inline-block mx-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              - {item.discount}%
            </span>
          )}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;

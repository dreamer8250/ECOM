import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { ProductContext } from '../contexts/ProductContext';
import Product from './Product'; // Import the Product component

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { products, currency, conversionRates } = useContext(ProductContext);
  const [couponCode, setCouponCode] = useState(localStorage.getItem('couponCode') || '');
  const [discount, setDiscount] = useState(parseFloat(localStorage.getItem('discount')) || 0);
  const [isCouponApplied, setIsCouponApplied] = useState(localStorage.getItem('isCouponApplied') === 'true');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const deliveryThresholdUSD = 120;
  const deliveryChargeUSD = 10;

  const conversionRate = conversionRates[currency] || 1;
  const deliveryThreshold = deliveryThresholdUSD * conversionRate;
  const deliveryCharge = deliveryChargeUSD * conversionRate;

  useEffect(() => {
    // Ensure values in localStorage match the current state
    localStorage.setItem('couponCode', couponCode);
    localStorage.setItem('discount', discount.toString());
    localStorage.setItem('isCouponApplied', isCouponApplied.toString());
  }, [couponCode, discount, isCouponApplied]);

  const calculateOrderAmount = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price / conversionRates[item.currency] * conversionRates[currency];
      const finalPrice = item.discount ? itemPrice * (1 - item.discount / 100) : itemPrice;
      return total + finalPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const calculateTotal = () => {
    const orderAmount = parseFloat(calculateOrderAmount());
    let total = orderAmount;

    if (orderAmount < deliveryThreshold) {
      total += deliveryCharge;
    }

    if (discount > 0) {
      total *= (1 - discount / 100);
    }

    return total.toFixed(2);
  };

  const calculateDiscountAmount = () => {
    const orderAmount = parseFloat(calculateOrderAmount());
    return discount > 0 ? (orderAmount * discount / 100).toFixed(2) : '0.00';
  };

  const formatPrice = (price) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
    }
  };

  //code for handlecheckout to display a toast at top center of page saying cart updated successfully
  const handleCheckout = () => {
    setToastMessage('Cart updated successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'INDIAISGREAT') {
      setDiscount(30);
      setIsCouponApplied(true);
      setToastMessage('Coupon code applied! 30% discount.');
      setToastType('success');
    } else {
      setDiscount(0);
      setIsCouponApplied(false);
      setToastMessage('Enter correct coupon code.');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode('');
    setIsCouponApplied(false);
    setToastMessage('Coupon code removed.');
    setToastType('info');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    localStorage.removeItem('couponCode');
    localStorage.removeItem('discount');
    localStorage.removeItem('isCouponApplied');
  };

  // Filter products that are not in the cart
  const filteredProducts = products.filter(product => !cartItems.some(item => item.id === product.id));
  
  // If all products are in the cart, select a few randomly
  const recommendedProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 3);

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-28">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

        {showToast && (
          <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 bg-${toastType === 'success' ? 'green' : toastType === 'error' ? 'red' : 'blue'}-500 text-white py-2 px-4 rounded-md shadow-md z-50`}>
            {toastMessage}
          </div>
        )}

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => {
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
                              <svg className="h-2.5 w-2.5 text-red-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                              </svg>
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
                              <svg className="h-2.5 w-2.5 text-green-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                              </svg>
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
                          <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
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
                              <svg className="mr-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L17.94 6M18 18L6.06 6" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full ">
            {cartItems.length > 0 && (
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Order summary</p>

                <div className="space-y-4">
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className=" lg:text-md md:text-md text-sm text-base font-bold text-gray-900 dark:text-white">Order Amount</dt>
                    <dd className="lg:text-md md:text-md text-sm text-base font-bold text-gray-900 dark:text-white">{formatPrice(calculateOrderAmount())}</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="lg:text-md md:text-md text-sm text-base font-bold text-gray-900 dark:text-white">Delivery Charges</dt>
                    <dd className="lg:text-md md:text-md text-sm text-base font-bold text-gray-900 dark:text-white">
                      {parseFloat(calculateOrderAmount()) >= deliveryThreshold.toFixed(2) ? (
                        <span className="line-through">{formatPrice(deliveryCharge)}</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </dd>
                  </dl>

                  {discount > 0 && (
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="lg:text-md md:text-md text-sm text-base font-bold text-gray-900 dark:text-white">Coupon Discount</dt>
                      <dd className=" lg:text-md md:text-md text-sm text-base font-bold text-green-600 dark:text-green-400">- {formatPrice(calculateDiscountAmount())}</dd>
                    </dl>
                  )}

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="lg:text-lg md:text-lg text-md text-base font-bold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(calculateTotal())}</dd>
                  </dl>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-2/3 p-2 border rounded-md me-4 lg:text-md md:text-md text-sm"
                    disabled={isCouponApplied} // Disable input if coupon is applied
                  />
                  <div className="flex items-center w-1/3">
                    <button
                      onClick={handleApplyCoupon}
                      className={`w-full py-2 px-4 rounded-md ${
                        isCouponApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white lg:text-md md:text-md text-sm'
                      }`}
                      disabled={isCouponApplied} // Disable button if coupon is applied
                    >
                      {isCouponApplied ? 'Applied' : 'Apply'}
                    </button>
                    {isCouponApplied && (
                      <button
                        onClick={handleRemoveCoupon}
                        className="ml-2 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 "
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <a
                  href="#"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleCheckout}>
                  Proceed to Checkout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* People Also Bought Section */}
      {cartItems.length > 0 && recommendedProducts.length > 0 && (
        <div className="mt-12 mx-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl text-center">People also bought</h2>
          <hr className="mb-16 mt-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mt-6 mx-8">
            {recommendedProducts.slice(0, 3).map((product) => (
              <Product key={product.id} product={product} formatPrice={formatPrice} trimProductTitle={(title) => title.substring(0, 30) + '...'} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;

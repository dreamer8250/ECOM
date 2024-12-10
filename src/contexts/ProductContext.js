import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');

  const conversionRates = {
    USD: 1,
    EUR: 0.85,
    INR: 74,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();

      const initializedProducts = data.map(product => ({
        ...product,
        basePrice: product.price, // Store original price in USD
        price: product.price * conversionRates[currency], // Convert price to selected currency for display
        currency: currency,
      }));

      const productsWithFeatures = assignFeatures(initializedProducts);
      setProducts(productsWithFeatures);
    };

    fetchProducts();
  }, [currency]);

  const assignFeatures = (products) => {
    return products.map((product, index) => {
      const randomNum = index % 6;
      switch (randomNum) {
        case 0:
          return { ...product, isNew: true };
        case 1:
          return { ...product, isHot: true };
        case 2:
          return { ...product, discount: Math.floor(Math.random() * 21) + 10 }; 
        default:
          return product; 
      }
    });
  };

  const convertCurrency = (newCurrency) => {
    setProducts(products.map(product => ({
      ...product,
      price: parseFloat((product.basePrice * conversionRates[newCurrency]).toFixed(2)), // Use basePrice for conversion
      currency: newCurrency,
    })));
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  return (
    <ProductContext.Provider value={{ products, currency, convertCurrency, conversionRates }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

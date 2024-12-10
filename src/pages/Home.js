import React, { useContext } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import Product from '../components/Product';
import Hero from '../components/Hero';

const Home = () => {
  const { products, currency } = useContext(ProductContext);

  const filteredProducts = products.filter(
    (product) => product.category === "men's clothing" || product.category === "women's clothing" || product.category === 'jewelery'
  );

  const formatPrice = (price) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
    }
  };

  const trimProductTitle = (title) => {
    return title.split(' ').slice(0, 7).join(' ') + (title.split(' ').length > 5 ? '...' : '');
  };

  const dynamicText = "Explore Our Exclusive Collection";

  return(
  <div>
    <Hero />
    <div className="text-center pt-4 lg:text-3xl md:text-2xl text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {dynamicText}
    </div>
    <hr className="mb-16 mt-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
    <div className='container mx-auto bg-gray-50'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {filteredProducts.map((product) => (
          <Product
            key={product.id}
            product={product}
            formatPrice={formatPrice}
            trimProductTitle={trimProductTitle}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Home;

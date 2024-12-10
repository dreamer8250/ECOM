import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import CartProvider from './contexts/CartContext';  // Import CartProvider
import { NotFound404 } from './pages/NotFound404';
import { Contact } from './components/Contact';

const App = () => {
  return (
    <div className='overflow-hidden bg-gray-50'>
      <CartProvider>  {/* Wrap the app with CartProvider */}
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/contact' element={<Contact />} />
            {/* //404 page link route */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;

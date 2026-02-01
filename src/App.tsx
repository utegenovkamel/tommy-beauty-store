import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { OrderForm } from './components/OrderForm';
import { WhatsAppButton } from './components/WhatsAppButton';
import { OrderNotificationListener } from './components/OrderNotificationListener';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { Favorites } from './pages/Favorites';
import { Admin } from './pages/Admin';
import { CartPage } from './pages/CartPage';
import { useStore } from './store/useStore';

function App() {
  const { fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Router>
      <OrderNotificationListener />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/delivery" element={<Contacts />} />
      </Routes>
      <Footer />
      <Cart />
      <OrderForm />
      <WhatsAppButton />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2D2A32',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '15px',
            minWidth: '320px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#F44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;

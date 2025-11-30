import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Product from './components/Product';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Admin from './components/Admin/Admin';
import Login from "./components/buttons/Login";
import Proveedor from "./components/Admin/Proveedores/proveedor"; 
import Calzado from "./components/Admin/Calzado/calzado";
import InfoCalzado from "./components/Admin/Informacion Calzado/info_calzado";
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token && location.pathname !== '/login' && !location.pathname.startsWith('/admin')) {
        // Guardar la ruta actual para redirigir después del login
        localStorage.setItem('redirectPath', location.pathname);
      }
    };
    checkAuth();
  }, [location]);

  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/Proveedor" element={<Proveedor />} />
        <Route path="/admin/Calzado" element={<Calzado />} />
        <Route path="/admin/info_calzado" element={<InfoCalzado />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
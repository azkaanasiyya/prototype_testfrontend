import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Customers from "./pages/Customers/Customers";
import Transaction from "./pages/Transaction/Transaction";
import { ShoppingCartOutlined } from "@ant-design/icons";
import './App.css'; // Import CSS file

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]); // Menyimpan produk dalam keranjang

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]); // Kosongkan keranjang saat logout
    localStorage.removeItem("isLoggedIn"); // Menghapus status login dari localStorage
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            <Routes>
              <Route
                path="/customers"
                element={<Customers isLoggedIn={isLoggedIn} addToCart={addToCart} cart={cart} />}
              />
              <Route
                path="/transaction"
                element={<Transaction cart={cart} setCart={setCart} />}
              />
              <Route path="*" element={<Navigate to="/customers" />} />
            </Routes>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Keluar
            </button>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}

        {isLoggedIn && <CartIcon cart={cart} />}
      </div>
    </BrowserRouter>
  );
};

const CartIcon = ({ cart }) => {
  const navigate = useNavigate();

  return (
    <div
      className="cart-icon"
      onClick={() => navigate("/transaction")}
    >
      <ShoppingCartOutlined style={{ fontSize: "24px" }} />
      <span className="cart-item-count">{cart.length}</span>
    </div>
  );
};

export default App;

import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CartIcon = ({ cart }) => {
  const navigate = useNavigate();

  // Event handler untuk klik ikon keranjang
  const handleCartClick = () => {
    if (cart.length > 0) {
      navigate("/transaction"); // Arahkan ke halaman transaksi jika ada produk di keranjang
    } else {
      alert("Keranjang Anda kosong"); // Menampilkan pesan jika keranjang kosong
    }
  };

  return (
    <div
      onClick={handleCartClick}  // Menambahkan event handler klik
      style={{
        position: "fixed",
        top: "15px",
        right: "70px",
        backgroundColor: "#1677FF",
        color: "#FFF",
        padding: "10px",
        borderRadius: "50%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,  // Pastikan ikon berada di atas elemen lain
      }}
    >
      <ShoppingCartOutlined style={{ fontSize: "24px" }} />
      <span
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "12px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        {cart.length}
      </span>
    </div>
  );
};

export default CartIcon;

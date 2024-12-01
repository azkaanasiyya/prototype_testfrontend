// Customers.jsx

import React, { useState, useEffect } from "react";
import { Menu, Card, Badge, Typography, Rate, Button, message, Spin } from "antd";
import { ApiOutlined, GlobalOutlined, WifiOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import './Customers.css'; // Mengimpor CSS

const Customers = ({ isLoggedIn, addToCart, cart }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("hotPromo");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/${selectedMenu}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        message.error("Gagal memuat produk");
        setLoading(false);
      });
  }, [selectedMenu]);

  const handleMenuClick = (menuKey) => {
    setSelectedMenu(menuKey);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      message.warning("Anda harus login untuk menambahkan produk ke keranjang.");
      return;
    }
    addToCart(product);
    message.success(`${product.title} berhasil ditambahkan ke keranjang!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <div className="customers-container">
      <Typography.Title level={2} className="title">
        Produk Pelanggan
      </Typography.Title>

      <Menu
        mode="horizontal"
        selectedKeys={[selectedMenu]}
        onClick={(e) => handleMenuClick(e.key)}
        className="menu"
      >
        <Menu.Item key="hotPromo" icon={<ApiOutlined className="menu-icon" />}>
          Promo Terbaik
        </Menu.Item>
        <Menu.Item key="kuotaInternet" icon={<GlobalOutlined className="menu-icon" />}>
          Kuota Internet
        </Menu.Item>
        <Menu.Item key="wifi" icon={<WifiOutlined className="menu-icon" />}>
          Wi-Fi
        </Menu.Item>
      </Menu>

      <Spin spinning={loading} size="large" className="spin-loader">
        <div className="product-list">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="product-card-container"
            >
              <Badge.Ribbon text={`${product.discountPercentage}% Diskon`} color="#1677FF">
                <Card
                  hoverable
                  title={product.title}
                  cover={<img alt={product.title} src={product.thumbnail} className="product-image" />}
                  className="product-card"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Card.Meta
                    title={<Typography.Paragraph><strong>Harga:</strong> {formatPrice(product.price)} <Typography.Text delete>{formatPrice(product.price + (product.price * product.discountPercentage) / 100)}</Typography.Text></Typography.Paragraph>}
                    description={<Typography.Paragraph ellipsis={{ rows: 2 }}>{product.description}</Typography.Paragraph>}
                  />
                  <Rate disabled allowHalf value={product.rating} />
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Tambah ke Keranjang
                  </Button>
                </Card>
              </Badge.Ribbon>
            </motion.div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default Customers;

import React, { useState } from "react";
import { Card, Button, Typography, List, Form, Input, Select, message, Checkbox, Row, Col } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './Transaction.css';

const { Title } = Typography;

const Transaction = ({ cart, setCart }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const total = selectedItems.reduce(
    (acc, product) => acc + product.price * (product.quantity || 1),
    0
  );

  const handleCheckout = () => {
    if (!paymentMethod || !phoneNumber || !paymentDetail) {
      message.error("Harap lengkapi semua kolom.");
      return;
    }

    if (selectedItems.length === 0) {
      message.error("Harap pilih barang yang ingin dibeli.");
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      message.success("Pembayaran berhasil!");
      setCart([]);
      navigate("/customers");
    }, 2000);
  };

  const handleItemSelect = (checked, product) => {
    if (checked) {
      setSelectedItems((prevItems) => [...prevItems, product]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item.id !== product.id)
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, quantityChange) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + quantityChange) }
          : product
      )
    );
  };

  return (
    <div className="transaction-container">
      <Title level={2} className="transaction-title">Keranjang Belanja Anda</Title>

      <Card className="transaction-card">
        <List
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(product) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFromCart(product.id)}
                />,
                <Button
                  type="link"
                  onClick={() => handleQuantityChange(product.id, -1)}
                  disabled={product.quantity === 1}
                >
                  -
                </Button>,
                <span className="quantity">{product.quantity}</span>,
                <Button type="link" onClick={() => handleQuantityChange(product.id, 1)}>
                  +
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={product.title}
                description={`Harga: Rp ${product.price.toLocaleString("id-ID")}`}
              />
              <Checkbox
                checked={selectedItems.some((item) => item.id === product.id)}
                onChange={(e) => handleItemSelect(e.target.checked, product)}
              />
            </List.Item>
          )}
        />
      </Card>

      <Title level={4} className="transaction-total">Total: Rp {total.toLocaleString("id-ID")}</Title>

      <Card className="transaction-payment-card">
        <Form layout="vertical" onFinish={handleCheckout}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Metode Pembayaran"
                name="paymentMethod"
                rules={[{ required: true, message: "Harap pilih metode pembayaran" }]}
              >
                <Select
                  placeholder="Pilih metode pembayaran"
                  value={paymentMethod}
                  onChange={(value) => {
                    setPaymentMethod(value);
                    setPaymentDetail(""); // Reset payment detail when payment method changes
                  }}
                >
                  <Select.Option value="creditCard">Kartu Kredit</Select.Option>
                  <Select.Option value="paypal">PayPal</Select.Option>
                  <Select.Option value="bankTransfer">Transfer Bank</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Nomor Telepon untuk Paket Data"
                name="phoneNumber"
                rules={[{ required: true, message: "Harap masukkan nomor telepon Anda" }]}
              >
                <Input
                  placeholder="Masukkan nomor telepon untuk paket data"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {paymentMethod === "paypal" && (
            <Form.Item
              label="Email PayPal"
              name="paypalEmail"
              rules={[{ required: true, message: "Harap masukkan email PayPal Anda" }]}
            >
              <Input
                placeholder="Masukkan email PayPal Anda"
                value={paymentDetail}
                onChange={(e) => setPaymentDetail(e.target.value)}
              />
            </Form.Item>
          )}

          {paymentMethod === "bankTransfer" && (
            <Form.Item
              label="Nomor Rekening"
              name="bankAccount"
              rules={[{ required: true, message: "Harap masukkan nomor rekening Anda" }]}
            >
              <Input
                placeholder="Masukkan nomor rekening bank"
                value={paymentDetail}
                onChange={(e) => setPaymentDetail(e.target.value)}
              />
            </Form.Item>
          )}

          {paymentMethod === "creditCard" && (
            <>
              <Form.Item
                label="Nomor Kartu Kredit"
                name="creditCardNumber"
                rules={[{ required: true, message: "Harap masukkan nomor kartu kredit Anda" }]}
              >
                <Input
                  placeholder="Masukkan nomor kartu kredit"
                  value={paymentDetail}
                  onChange={(e) => setPaymentDetail(e.target.value)}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tanggal Kedaluwarsa"
                    name="expiryDate"
                    rules={[{ required: true, message: "Harap masukkan tanggal kedaluwarsa kartu kredit" }]}
                  >
                    <Input
                      placeholder="MM/YY"
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={[{ required: true, message: "Harap masukkan CVV kartu kredit" }]}
                  >
                    <Input
                      placeholder="Masukkan CVV"
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isCheckingOut}
              icon={<ShoppingCartOutlined />}
              className="checkout-button"
            >
              Checkout
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Button
        type="default"
        onClick={() => navigate("/customers")}
        icon={<ArrowLeftOutlined />}
        className="back-button"
      >
        Kembali ke Halaman Customer
      </Button>
    </div>
  );
};

export default Transaction;

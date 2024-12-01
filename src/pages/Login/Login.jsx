import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS file

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/users?username=${username}&password=${password}`
      );

      if (response.data.length > 0) {
        message.success("Login berhasil!");
        onLogin();
        navigate("/customers");
      } else {
        message.error("Username atau password salah");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    const { username, password, email } = values;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/users", {
        username,
        password,
        email,
      });

      if (response.status === 201) {
        message.success("Pendaftaran berhasil! Silakan login.");
        setIsRegistering(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      message.error("Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="login-container"
    >
      <Card
        className="login-card"
        title={
          <Typography.Title level={3} className="login-title">
            {isRegistering ? "Daftar" : "Login"}
          </Typography.Title>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isRegistering ? handleRegister : handleLogin}
          className="login-form"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Silakan masukkan username Anda" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1677FF" }} />}
              placeholder="Masukkan username Anda"
              size="large"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Silakan masukkan password Anda" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1677FF" }} />}
              placeholder="Masukkan password Anda"
              size="large"
              className="login-input"
            />
          </Form.Item>

          {isRegistering && (
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Silakan masukkan email Anda" }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#1677FF" }} />}
                placeholder="Masukkan email Anda"
                size="large"
                className="login-input"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              className="login-btn"
            >
              {isRegistering ? "Daftar" : "Login"}
            </Button>
          </Form.Item>

          <Form.Item className="toggle-form">
            <Button
              type="link"
              onClick={() => {
                setIsRegistering(!isRegistering);
                form.resetFields();
              }}
              className="toggle-btn"
            >
              {isRegistering
                ? "Sudah punya akun? Login"
                : "Belum punya akun? Daftar"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};

export default Login;

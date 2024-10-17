// src/pages/Login.js
import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Default role
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", formData);
      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful");

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "homebaker") {
        navigate("/homebaker");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Login failed"
      );
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Login As</Form.Label>
            <Form.Select name="role" value={role} onChange={onChange}>
              <option value="user">User</option>
              <option value="homebaker">Home Baker</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Login;

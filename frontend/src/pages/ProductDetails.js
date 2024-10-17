// frontend/src/pages/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams(); // Extract product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product details.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Product not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Image src={product.imageUrl} alt={product.name} fluid />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>${product.price.toFixed(2)}</h4>
          <p>
            <strong>Baker:</strong> {product.baker.name}
          </p>
          {/* Add more details or actions as needed */}
          <Button variant="primary">Place Order</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;

// frontend/src/components/ProductCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>
          <strong>Price:</strong> ${product.price.toFixed(2)}
        </Card.Text>
        <Button variant="primary" as={Link} to={`/products/${product._id}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;

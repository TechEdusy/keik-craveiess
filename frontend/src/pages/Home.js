// frontend/src/pages/Home.js
import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css"; // Import custom CSS for styling
import heroBackground from '../assets/hero-background.jpg';
function Home() {
  const heroStyle = {
    backgroundImage: `url(${heroBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#333",
    position: "relative",
    padding: "100px 0",
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section" style={heroStyle}>
        <Container className="text-center">
          <h1>Welcome to Keik Craveiess</h1>
          <p>Your one-stop destination for exquisite cakes and desserts.</p>
          <Button variant="primary" as={Link} to="/products">
            Explore Products
          </Button>
        </Container>
      </div>

      {/* Featured Products Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <Row>
          {/* Replace with dynamic content if available */}
          <Col md={4}>
            <Card>
              <Card.Img
                variant="top"
                src="/images/cake1.jpg"
                alt="Featured Product 1"
              />
              <Card.Body>
                <Card.Title>Chocolate Delight</Card.Title>
                <Card.Text>
                  Indulge in our rich and creamy chocolate cakes, perfect for
                  any occasion.
                </Card.Text>
                <Button variant="primary" as={Link} to="/products">
                  View More
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img
                variant="top"
                src="/images/cake2.jpg"
                alt="Featured Product 2"
              />
              <Card.Body>
                <Card.Title>Vanilla Dream</Card.Title>
                <Card.Text>
                  Experience the classic taste of vanilla with our beautifully
                  crafted cakes.
                </Card.Text>
                <Button variant="primary" as={Link} to="/products">
                  View More
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img
                variant="top"
                src="/images/cake3.jpg"
                alt="Featured Product 3"
              />
              <Card.Body>
                <Card.Title>Red Velvet Romance</Card.Title>
                <Card.Text>
                  Our red velvet cakes are a perfect blend of taste and
                  elegance.
                </Card.Text>
                <Button variant="primary" as={Link} to="/products">
                  View More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* About Us Teaser */}
      <Container className="my-5 text-center">
        <h2>About Keik Craveiess</h2>
        <p>
          At Keik Craveiess, we believe in creating memorable moments with our
          delightful range of cakes and desserts. Our team of skilled home
          bakers ensures that each product is crafted with love and precision.
        </p>
        <Button variant="secondary" as={Link} to="/about">
          Learn More
        </Button>
      </Container>
    </div>
  );
}

export default Home;

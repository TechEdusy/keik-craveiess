// frontend/src/pages/AboutUs.js
import React from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";

function AboutUs() {
  return (
    <Container className="my-5">
      {/* Mission Statement */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                At Keik Craveiess, our mission is to deliver delectable cakes
                and desserts that bring joy and sweetness to every celebration.
                We strive for excellence in every bite, ensuring quality and
                satisfaction for our cherished customers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-center mb-4">Meet Our Team</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Image src="/images/team1.jpg" roundedCircle fluid />
                <Card.Body className="text-center">
                  <Card.Title>Jane Doe</Card.Title>
                  <Card.Text>Founder & Head Baker</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Image src="/images/team2.jpg" roundedCircle fluid />
                <Card.Body className="text-center">
                  <Card.Title>John Smith</Card.Title>
                  <Card.Text>Operations Manager</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Image src="/images/team3.jpg" roundedCircle fluid />
                <Card.Body className="text-center">
                  <Card.Title>Alice Johnson</Card.Title>
                  <Card.Text>Customer Relations</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* History Section */}
      <Row>
        <Col>
          <h2 className="text-center mb-4">Our Story</h2>
          <p>
            Founded in 2023, Keik Craveiess started with a simple passion for
            baking and a desire to share delightful treats with the community.
            From humble beginnings in a home kitchen, we've grown into a beloved
            brand known for our commitment to quality and creativity. Each cake
            is a labor of love, crafted to perfection to ensure every bite is a
            memorable experience.
          </p>
          <p>
            Our team of talented home bakers brings diverse skills and unique
            styles, allowing us to offer a wide range of flavors and designs.
            Whether you're celebrating a birthday, wedding, or any special
            occasion, Keik Craveiess is here to make it sweeter.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;

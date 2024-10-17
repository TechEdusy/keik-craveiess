// frontend/src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Alert,
  Modal,
  Form,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import axios from "axios";

function UserDashboard() {
  const [bakers, setBakers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedBaker, setSelectedBaker] = useState(null);
  const [cakeDetails, setCakeDetails] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBakers();
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchBakers = async () => {
    try {
      const res = await axios.get("/api/user/bakers", {
        headers: { "x-auth-token": token },
      });
      setBakers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Home Bakers");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/user/orders", {
        headers: { "x-auth-token": token },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your orders");
    }
  };

  const placeOrder = async () => {
    if (!cakeDetails) {
      setError("Please provide cake details");
      return;
    }

    try {
      await axios.post(
        "/api/user/order",
        {
          bakerId: selectedBaker._id,
          cakeDetails,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      setMessage("Order placed successfully");
      setShowOrderModal(false);
      setCakeDetails("");
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Failed to place order"
      );
    }
  };

  return (
    <div>
      <h2 className="mb-4">Browse Home Bakers</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Row>
        {bakers.map((baker) => (
          <Col md={4} key={baker._id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={
                  baker.pastWorks[0]
                    ? baker.pastWorks[0].imageUrl
                    : "/default-cake.jpg"
                }
                alt={baker.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{baker.name}</Card.Title>
                <Card.Text>
                  {baker.pastWorks[0]
                    ? baker.pastWorks[0].description
                    : "Delicious cakes available"}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedBaker(baker);
                    setShowOrderModal(true);
                  }}>
                  Place Order
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Order Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Place Order with {selectedBaker && selectedBaker.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCakeDetails">
              <Form.Label>Cake Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the cake you want"
                value={cakeDetails}
                onChange={(e) => setCakeDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={placeOrder}>
            Submit Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Display User Orders */}
      <h2 className="mt-5 mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Baker</th>
              <th>Cake Details</th>
              <th>Status</th>
              <th>Estimated Arrival</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.baker.name}</td>
                <td>{order.cakeDetails}</td>
                <td>{order.status}</td>
                <td>
                  {order.estimatedArrival
                    ? new Date(order.estimatedArrival).toLocaleString()
                    : "N/A"}
                </td>
                <td>{new Date(order.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserDashboard;

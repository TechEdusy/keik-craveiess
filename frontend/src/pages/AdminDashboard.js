// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Table, Button, Tabs, Tab, Alert, Modal, Form } from "react-bootstrap";
import axios from "axios";

function AdminDashboard() {
  const [key, setKey] = useState("homebakers");
  const [homeBakers, setHomeBakers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHomeBakers();
    fetchUsers();
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchHomeBakers = async () => {
    try {
      const res = await axios.get("/api/admin/homebakers", {
        headers: { "x-auth-token": token },
      });
      setHomeBakers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Home Bakers");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Users");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders", {
        headers: { "x-auth-token": token },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Orders");
    }
  };

  const deleteHomeBaker = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Home Baker?"))
      return;

    try {
      await axios.delete(`/api/admin/homebakers/${id}`, {
        headers: { "x-auth-token": token },
      });
      setHomeBakers(homeBakers.filter((baker) => baker._id !== id));
      alert("Home Baker deleted successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to delete Home Baker");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { "x-auth-token": token },
      });
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to delete User");
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusChange = (e) => {
    setUpdateStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    if (!updateStatus) {
      setError("Please select a status");
      return;
    }

    try {
      await axios.put(
        `/api/admin/orders/${selectedOrder._id}`,
        { status: updateStatus },
        { headers: { "x-auth-token": token } }
      );
      setMessage("Order status updated successfully");
      setShowStatusModal(false);
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error(err);
      setError("Failed to update order status");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="homebakers" title="Home Bakers">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscription Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {homeBakers.map((baker) => (
                <tr key={baker._id}>
                  <td>{baker.name}</td>
                  <td>{baker.email}</td>
                  <td>
                    {baker.subscriptionExpiry
                      ? new Date(baker.subscriptionExpiry).toLocaleDateString()
                      : "Not Subscribed"}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHomeBaker(baker._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="users" title="Users">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteUser(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Baker</th>
                <th>Cake Details</th>
                <th>Status</th>
                <th>Estimated Arrival</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{order.baker.name}</td>
                  <td>{order.cakeDetails}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.estimatedArrival
                      ? new Date(order.estimatedArrival).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => openStatusModal(order)}>
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group controlId="formStatus">
                <Form.Label>Current Status: {selectedOrder.status}</Form.Label>
                <Form.Select value={updateStatus} onChange={handleStatusChange}>
                  <option value="">Select New Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formEstimatedArrival" className="mt-3">
                <Form.Label>Estimated Arrival (Optional)</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={
                    selectedOrder.estimatedArrival
                      ? new Date(selectedOrder.estimatedArrival)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setUpdateStatus((prev) => ({
                      ...prev,
                      estimatedArrival: date,
                    }));
                  }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateOrderStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;

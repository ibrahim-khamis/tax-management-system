import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://tax-management-system-34cb.onrender.com",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      alert("Failed to load payments");
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="payments-container">
          <div className="payments-header">
            <h2>Payments</h2>

            <div className="buttons-right">
              <Link to="/dashboard">
                <button className="back-btn">← Back</button>
              </Link>
            </div>
          </div>

          <table className="payments-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Business</th>
                <th>Amount (Tsh)</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.user_first_name}</td>
                    <td>{p.user_last_name}</td>
                    <td>{p.business_name}</td>
                    <td>{Number(p.amount).toLocaleString()}</td>
                    <td
                      style={{
                        color: p.status === "paid" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {p.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;

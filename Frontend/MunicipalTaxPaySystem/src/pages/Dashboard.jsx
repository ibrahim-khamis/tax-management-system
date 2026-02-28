import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://tax-management-system-34cb.onrender.com",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <div className="dashboard-cards">
          <div className="small-card">
            <span>Total Users</span>
            <h6>{stats.total_users}</h6>
          </div>

          <div className="small-card">
            <span>Paid</span>
            <h6>{stats.paid}</h6>
          </div>

          <div className="small-card">
            <span>Unpaid</span>
            <h6>{stats.unpaid}</h6>
          </div>

          <div className="small-card">
            <span>Total Revenue</span>
            <h6>{Number(stats.total_revenue).toLocaleString()} Tsh</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

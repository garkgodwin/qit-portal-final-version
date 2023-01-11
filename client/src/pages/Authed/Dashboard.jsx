import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CountCard from "../../components/cards/CountCard";
import "./Dashboard.css";
import { getDashboardData } from "../../api/general";

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    handleGetDashboardData();
  }, []);
  const handleGetDashboardData = async () => {
    const result = await getDashboardData();
    console.log(result);
    if (result.status === 200) {
      let data = result.data;
      setCards(data);
    }
  };
  return (
    <>
      <div className="dashboard">
        {cards.map((crd, index) => {
          return <CountCard key={index} data={crd} />;
        })}
      </div>
    </>
  );
};

export default Dashboard;

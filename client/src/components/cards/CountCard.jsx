import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";

const CountCard = ({ data }) => {
  const navigate = useNavigate();
  if (data) {
    return (
      <div className="Card card-count">
        <div className="card-content">
          <h1>{data.count}</h1>
          <span>{data.title}</span>
        </div>
        <div className="card-functions">
          <button
            className="card-function"
            onClick={(e) => {
              e.preventDefault();
              navigate(data.path);
            }}
          >
            {"Go to " + data.path.split("/")[1]}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Card card-count">
        <div className="card-content">
          <h1>{100}</h1>
          <span>{"Something"}</span>
        </div>
        <div className="card-functions">
          <button className="card-function">Something</button>
        </div>
      </div>
    );
  }
};

export default CountCard;

import React from "react";
import "./Filter.css";

const Filter = ({ init, state, handleState }) => {
  return (
    <div className="Filter">
      <div className="filter-field">
        <label>{init.text.label}</label>
        <input
          type="text"
          value={state.text}
          placeholder={init.text.placeholder}
          onChange={(e) => {
            const val = e.target.value;
            handleState(1, val);
          }}
        />
      </div>
      {init.selected1 && (
        <div className="filter-field">
          <label>{init.selected1.label}</label>
          <select
            value={state.selected1}
            onChange={(e) => {
              const val = e.target.value;
              handleState(2, val);
            }}
          >
            {init.selected1.options.map((opt) => {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.text}
                </option>
              );
            })}
          </select>
        </div>
      )}
      {init.selected2 && (
        <div className="filter-field">
          <label>{init.selected2.label}</label>
          <select
            value={state.selected2}
            onChange={(e) => {
              const val = e.target.value;
              handleState(3, val);
            }}
          >
            {init.selected2.options.map((opt) => {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.text}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
};

export default Filter;

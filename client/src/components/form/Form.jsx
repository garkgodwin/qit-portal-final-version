import React from "react";
import "./Form.css";

const Form = (props) => {
  const shown = props.shown;
  const loading = props.loading;
  return (
    <form
      className={"Form" + (shown ? " form-shown" : "")}
      onSubmit={(e) => {
        e.preventDefault();
        props.handleSubmit();
      }}
    >
      {props.children}
      <div className={"form-loading" + (loading ? " form-loading-shown" : "")}>
        ...Loading...
      </div>
      <div className="form-functions">
        <button
          className="form-function"
          onClick={(e) => {
            e.preventDefault();
            props.handleCancel();
          }}
        >
          Cancel
        </button>
        <button
          className="form-function"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            props.handleSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;

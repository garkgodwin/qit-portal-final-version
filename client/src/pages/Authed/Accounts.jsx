import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import { getAccounts } from "../../api/users";
//? HELPERS
import { getRoleText } from "../../helpers/formatText";
//? COMPONETS
import Filter from "../../components/filter/Filter";

const Accounts = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "0",
    selected2: "0",
  });
  const init = {
    text: {
      label: "Username",
      placeholder: "username here...",
    },
    selected1: {
      label: "Role",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "Admin" },
        { value: 2, text: "Registrar" },
        { value: 3, text: "Instructor" },
        { value: 4, text: "Student" },
        { value: 5, text: "Guardian" },
      ],
    },
    selected2: {
      label: "Status",
      options: [
        { value: 0, text: "None" },
        { value: 1, text: "Active" },
        { value: 2, text: "Inactive" },
      ],
    },
  };
  const handleFilter = (type, value) => {
    if (type === 1) {
      setFilterValues({
        ...filterValues,
        text: value,
      });
    } else if (type === 2) {
      setFilterValues({
        ...filterValues,
        selected1: value,
      });
    } else if (type === 3) {
      setFilterValues({
        ...filterValues,
        selected2: value,
      });
    }
  };
  useEffect(() => {
    handleFilterAccounts();
  }, [filterValues]);
  useEffect(() => {
    handleFilterAccounts();
  }, [accounts]);
  useEffect(() => {
    handleFetchAccounts();
  }, []);
  const handleFetchAccounts = async () => {
    const result = await getAccounts();
    if (result.status === 200) {
      setAccounts(result.data);
    }
  };
  const handleFilterAccounts = () => {
    let filtered = accounts.filter((acc) => {
      return (
        acc.username
          .toLowerCase()
          .includes(filterValues.text.trim().toLowerCase()) ||
        acc.email.toLowerCase().includes(filterValues.text.trim().toLowerCase())
      );
    });
    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((acc) => {
        return acc.role === parseInt(filterValues.selected1);
      });
    }
    if (filterValues.selected2 !== "0") {
      const val = filterValues.selected2 === "1" ? false : true;
      filtered = filtered.filter((acc) => {
        return acc.locked === val;
      });
    }
    setFilteredAccounts(filtered);
  };
  const handleCreate = () => {
    dispatch(
      showToast({
        body: "To create an account, please go to staffs or students and press the 'Create' button. ",
      })
    );
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>Accounts</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc, index) => {
              return (
                <tr key={acc._id}>
                  <td>{index + 1}</td>
                  <td>{acc.person.name}</td>
                  <td>{acc.username}</td>
                  <td>{acc.email}</td>
                  <td>{getRoleText(acc.role)}</td>
                  <td>{acc.activated ? "Activated" : "Unactivated"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="page-functions">
        <button
          className="page-function"
          onClick={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          Create account
        </button>
      </div>
    </>
  );
};

export default Accounts;

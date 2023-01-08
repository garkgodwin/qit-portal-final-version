import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? ROUTES
import { useLocation } from "react-router-dom";

//? API
import {
  getGuardiansOfThisStudent,
  addGuardianToStudent,
} from "../../api/students";
//? HELPERS
import { getRoleText } from "../../helpers/formatText";
//? COMPONETS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";

const StudentGuardians = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [guardians, setGuardians] = useState([]);
  const [filteredGuardians, setFilteredGuardians] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
  });
  const [formValues, setFormValues] = useState({
    loading: false,
    shown: false,
    type: 1,
  });
  const [formInputs, setFormInputs] = useState({
    user: {
      username: "",
      email: "",
    },
    person: {
      name: "",
      age: 0,
      birthDate: new Date().toISOString().substring(0, 10),
      gender: 1,
      mobileNumber: "",
    },
  });
  const init = {
    text: {
      label: "Guardian name",
      placeholder: "guardian here...",
    },
  };
  useEffect(() => {
    handleFetchGuardians();
  }, [location]);

  const handleFetchGuardians = async () => {
    const id = location.pathname.split("/")[2];
    const result = await getGuardiansOfThisStudent(id);
    console.log(result);
    if (result.status === 200) {
      setGuardians(result.data);
    } else {
      setGuardians([]);
    }
  };
  const handleFilter = () => {};
  const handleCreate = () => {
    setFormValues({
      ...formValues,
      type: 1,
      shown: true,
    });
  };

  const handleCancel = () => {
    setFormValues({
      ...formValues,
      type: 1,
      shown: false,
    });
  };

  const handleSubmit = async () => {
    const id = location.pathname.split("/")[2];
    setFormValues({
      ...formValues,
      type: 1,
      loading: true,
    });
    const result = await addGuardianToStudent(id, formInputs);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      handleCancel();
    }
    setFormValues({
      ...formValues,
      type: 1,
      loading: false,
    });
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>Guardian</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {guardians.map((acc, index) => {
              console.log(acc);
              return (
                <tr key={acc._id}>
                  <td>{index + 1}</td>
                  <td>{acc.person.name}</td>
                  <td>{acc.person.mobileNumber}</td>
                  <td>{acc.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Form
        shown={formValues.shown}
        loading={formValues.loading}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      >
        <div className="form-body">
          <h4 className="form-title">Guardian form</h4>
          <div className="form-fields">
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                value={formInputs.user.username}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    user: {
                      ...formInputs.user,
                      username: e.target.value.trim(),
                    },
                  });
                }}
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={formInputs.user.email}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    user: {
                      ...formInputs.user,
                      email: e.target.value.trim(),
                    },
                  });
                }}
              />
            </div>
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={formInputs.person.name}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    person: {
                      ...formInputs.person,
                      name: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={formInputs.person.age}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 3 || parseInt(val) > 100) {
                    return;
                  }
                  setFormInputs({
                    ...formInputs,
                    person: {
                      ...formInputs.person,
                      age: parseInt(e.target.value.trim()),
                    },
                  });
                }}
              />
            </div>
            <div className="form-field">
              <label>Birth Date</label>
              <input
                type="date"
                value={formInputs.person.birthDate}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    person: {
                      ...formInputs.person,
                      birthDate: e.target.value.toString(),
                    },
                  });
                }}
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select
                value={formInputs.person.gender}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    person: {
                      ...formInputs,
                      gender: parseInt(e.target.value),
                    },
                  });
                }}
              >
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>

            <div className="form-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                pattern="[0-9]{11}"
                value={formInputs.person.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 11) {
                    return;
                  }
                  setFormInputs({
                    ...formInputs,
                    person: {
                      ...formInputs.person,
                      mobileNumber: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Form>
      <div className="page-functions">
        <button
          className="page-function"
          onClick={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          Create guardian
        </button>
      </div>
    </>
  );
};

export default StudentGuardians;

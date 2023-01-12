import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import { getAllStaffs, createStaff, updateStaff } from "../../api/staffs";
//? HELPERS
import { getRoleText } from "../../helpers/formatText";
//? COMPONETS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";

const Staffs = () => {
  const dispatch = useDispatch();
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "0",
  });
  const [selectedData, setSelectedData] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 0, // 1 - create , 2 - update
    loading: false,
  });
  const [formInputs, setFormInputs] = useState({
    user: {
      username: "",
      email: "",
      role: 3,
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
      label: "Name",
      placeholder: "name here...",
    },
    selected1: {
      label: "Role",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "Admin" },
        { value: 2, text: "Registrar" },
        { value: 3, text: "Instructor" },
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
    }
  };
  useEffect(() => {
    handleFilterStaffs();
  }, [filterValues]);
  useEffect(() => {
    handleFilterStaffs();
  }, [staffs]);
  useEffect(() => {
    handleFetchStaffs();
  }, []);
  const handleFetchStaffs = async () => {
    const result = await getAllStaffs();
    if (result.status === 200) {
      setStaffs(result.data);
    }
  };
  const handleFilterStaffs = () => {
    let filtered = staffs.filter((person) => {
      return person.name
        .toLowerCase()
        .includes(filterValues.text.toLowerCase());
    });
    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((person) => {
        return person.user.role === parseInt(filterValues.selected1);
      });
    }
    setFilteredStaffs(filtered);
  };
  const handleCreate = () => {
    setFormValues({
      ...formValues,
      shown: true,
      type: 1,
    });
  };
  const handleSubmit = async () => {
    setFormValues({
      ...formValues,
      loading: true,
    });
    if (selectedData === null) {
      //? create
      const result = await createStaff(formInputs);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        setStaffs([...staffs, result.data]);
        handleCancel();
      }
    } else {
      //? update
      const result = await updateStaff(formInputs); // ? person data only
      console.log(result);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      handleCancel();
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };
  const handleCancel = () => {
    setFormValues({
      shown: false,
      type: 0,
    });
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>Staffs</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map((person, index) => {
              return (
                <tr key={person._id}>
                  <td>{index + 1}</td>
                  <td>{person.name}</td>
                  <td>{getRoleText(person.user.role)}</td>
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
          Create staff
        </button>
      </div>
      <Form
        shown={formValues.shown}
        loading={formValues.loading}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      >
        <div className="form-body">
          <h4 className="form-title">
            {formValues.type === 1
              ? "Staff creation form"
              : formValues.type === 2
              ? "Staff update form"
              : "Staff form"}
          </h4>
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
            <div className="form-field">
              <label>Role</label>
              <select
                value={formInputs.user.role}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    user: {
                      ...formInputs.user,
                      role: parseInt(e.target.value),
                    },
                  });
                }}
              >
                <option value={3}>Instructor</option>
                <option value={2}>Registrar</option>
              </select>
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
    </>
  );
};

export default Staffs;

import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import {
  getAllSchoolInfos,
  createSchoolInfo,
  updateSchoolInfo,
  getSchoolInfoForUpdate,
  lockOrUnlockSchoolInfo,
  moveSchoolInfo,
} from "../../api/schoolInfo";

import { useNavigate } from "react-router-dom";
//? HELPERS

//? COMPONETS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";

const SchoolInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [schoolInfos, setSchoolInfos] = useState([]);
  const [filteredSchoolInfos, setFilteredSchoolInfos] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "0", //? 0 - all , 1 - current
    selected2: "0", //? 0 - all , 1 - 1st semester infos, 2 - 2nd semester infos
  });
  const [selectedData, setSelectedData] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 0, // 1 - create , 2 - update
    loading: false,
  });

  const [formInputs, setFormInputs] = useState({
    sy: "",
    sem: "",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
  });

  const init = {
    text: {
      label: "School year",
      placeholder: "school year here...",
    },
    selected1: {
      label: "Status",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "Current" },
      ],
    },
    selected2: {
      label: "Semester",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "1st semester" },
        { value: 2, text: "2nd semester" },
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
    handleFilterSchoolInfos();
  }, [filterValues]);
  useEffect(() => {
    handleFilterSchoolInfos();
  }, [schoolInfos]);
  useEffect(() => {
    handleFetchSchoolInfos();
  }, []);
  const handleFetchSchoolInfos = async () => {
    const result = await getAllSchoolInfos();
    if (result.status === 200) {
      setSchoolInfos(result.data);
    }
  };
  const handleFilterSchoolInfos = () => {
    let filtered = schoolInfos.filter((info) => {
      return info.sy.trim().includes(filterValues.text.trim().toLowerCase());
    });

    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((info) => {
        return info.current;
      });
    }

    if (filterValues.selected2 !== "0") {
      filtered = filtered.filter((info) => {
        return info.sem === parseInt(filterValues.selected2);
      });
    }

    setFilteredSchoolInfos(filtered);
  };
  const handleCreate = async () => {
    const result = await createSchoolInfo();
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setSchoolInfos([...schoolInfos, result.data]);
    }
  };
  const handleSubmit = async () => {
    setFormValues({
      ...formValues,
      loading: true,
    });
    if (selectedData === null) {
      //? create
      const result = await createSchoolInfo(formInputs);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        setSchoolInfos([...schoolInfos, result.data]);
        setFormValues({
          shown: false,
          type: 0,
          loading: false,
        });
      }
    } else {
      //? update
      const data = {
        schoolInfo: formInputs,
      };
      const result = await updateSchoolInfo(selectedData, data); // ? person data only
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        setFormValues({
          ...formValues,
          shown: false,
          loading: false,
        });
        navigate("/");
      }
    }
  };
  const handleCancel = () => {
    setFormValues({
      shown: false,
      type: 0,
    });
  };

  const handleViewUpdate = async (id) => {
    setSelectedData(id);
    const result = await getSchoolInfoForUpdate(id);
    console.log(result);
    if (result.status === 200) {
      const d = result.data;
      setFormInputs({
        ...formInputs,
        sem: d.sem,
        sy: d.sy,
        startDate: d.startDate,
        endDate: d.endDate,
      });
      setFormValues({
        ...formValues,
        shown: true,
      });
    } else {
      setFormValues({
        ...formValues,
        shown: false,
      });
    }
  };
  const handleLockInfo = async (id) => {
    const result = await lockOrUnlockSchoolInfo(id);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      const newInfos = schoolInfos.map((info) => {
        if (info._id === id) {
          info.locked = !info.locked;
        }
        return info;
      });
      setSchoolInfos(newInfos);
    }
  };
  const handleMoveInfo = async (id) => {
    const result = await moveSchoolInfo(id);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      navigate("/");
    }
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>School Info</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>School year</th>
              <th>Semester</th>
              <th>Current</th>
              <th>Locked</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th># of students</th>
              <th># of classes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchoolInfos.map((info, index) => {
              return (
                <tr key={info._id}>
                  <td>{index + 1}</td>
                  <td>{info.sy}</td>
                  <td>{info.sem}</td>
                  <td>{info.current ? "Yes" : "No"}</td>
                  <td>{info.locked ? "Yes" : "No"}</td>
                  <td>{info.startDate}</td>
                  <td>{info.endDate}</td>
                  <td>{info.numberOfStudents ? info.numberOfStudents : 0}</td>
                  <td>{info.numberOfClasses ? info.numberOfClasses : 0}</td>
                  <td>
                    {!info.current && (
                      <>
                        <button
                          className="table-button table-button-1"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMoveInfo(info._id);
                          }}
                        >
                          Move
                        </button>
                      </>
                    )}
                    {info.current && (
                      <>
                        <button
                          className="table-button table-button-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLockInfo(info._id);
                          }}
                        >
                          {info.locked ? "Unlock" : "Lock"}
                        </button>
                        <button
                          className="table-button table-button-1"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewUpdate(info._id);
                          }}
                        >
                          Update
                        </button>
                      </>
                    )}
                  </td>
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
          Create next school year and semester
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
              ? "School info creation form"
              : formValues.type === 2
              ? "School info update form"
              : "School info form"}
          </h4>
          <div className="form-fields">
            <div className="form-field">
              <label>School Year</label>
              <input type="text" disabled value={formInputs.sy} />
            </div>
            <div className="form-field">
              <label>Semester</label>
              <input type="text" disabled value={formInputs.sem} />
            </div>
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label>Start Date</label>
              <input
                type="date"
                value={formInputs.startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormInputs({
                    ...formInputs,
                    startDate: val,
                  });
                }}
              />
            </div>

            <div className="form-field">
              <label>End Date</label>
              <input
                type="date"
                value={formInputs.endDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormInputs({
                    ...formInputs,
                    endDate: val,
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

export default SchoolInfo;

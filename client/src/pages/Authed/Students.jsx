import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? ROUTE
import { useNavigate } from "react-router-dom";

//? API
import {
  getAllStudents,
  createStudent,
  updateStudent,
  moveStudentToCurrentSem,
  getStudentForUpdate,
  getStudentAndSubjects,
} from "../../api/students";
import { getAllSchoolConstants } from "../../api/general";
//? HELPERS
import { getRoleText } from "../../helpers/formatText";
//? COMPONETS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";
import {
  studentForThisSubject,
  studentLevelText,
} from "../../helpers/formatSubjects";
import { getCurrentSchoolInfo } from "../../api/schoolInfo";
import { startLoading, stopLoading } from "../../features/pageSlice";
import { createGradeNotifications } from "../../api/notification";

const Students = () => {
  const page = useSelector((state) => state.page);
  const [currentSchoolInfo, setCurrentSchoolInfo] = useState(null);
  const [currentStudents, setCurrentStudents] = useState(true);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [schoolConstants, setSchoolConstants] = useState({
    STUDENT_TYPES: [],
    COLLEGE_COURSES: [],
    COLLEGE_LEVELS: [],
    COLLEGE_SECTIONS: [],
    SENIOR_COURSES: [],
    SENIOR_LEVELS: [],
    SENIOR_SECTIONS: [],
    JUNIOR_COURSES: [],
    JUNIOR_LEVELS: [],
    JUNIOR_SECTIONS: [],
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "1",
    selected2: "0",
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
    },
    person: {
      name: "",
      age: 0,
      birthDate: new Date().toISOString().substring(0, 10),
      gender: 1,
      mobileNumber: "",
    },
    student: {
      level: 1,
      course: "BSIT",
      section: "A",
      type: 1,
    },
  });
  const init1 = {
    text: {
      label: "Name",
      placeholder: "name here...",
    },
    selected2: {
      label: "Year Level",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "1st year" },
        { value: 2, text: "2nd year" },
        { value: 3, text: "3rd year" },
        { value: 4, text: "4th year" },
      ],
    },
  };
  const init2 = {
    text: {
      label: "Name",
      placeholder: "name here...",
    },
    selected2: {
      label: "Year Level",
      options: [
        { value: 0, text: "All" },
        { value: 11, text: "Grade 11" },
        { value: 12, text: "Grade 12" },
      ],
    },
  };
  const init3 = {
    text: {
      label: "Name",
      placeholder: "name here...",
    },
    selected2: {
      label: "Year Level",
      options: [
        { value: 0, text: "All" },
        { value: 7, text: "Grade 7" },
        { value: 8, text: "Grade 8" },
        { value: 9, text: "Grade 9" },
        { value: 10, text: "Grade 10" },
      ],
    },
  };
  const handleFilter = (type, value) => {
    console.log(type, value);
    if (type === 1) {
      setFilterValues({
        ...filterValues,
        text: value,
      });
    } else if (type === 2) {
      setFilterValues({
        ...filterValues,
        selected1: value,
        selected2: "0",
      });
    } else if (type === 3) {
      setFilterValues({
        ...filterValues,
        selected2: value,
      });
    }
  };

  useEffect(() => {
    handleFilterStudents();
  }, [filterValues]);
  useEffect(() => {
    handleFilterStudents();
  }, [students]);
  useEffect(() => {
    fetchCurrentSchoolInfo();
    handleFetchStudents();
    handleFetchSchoolConstants();
  }, []);
  const handleFetchStudents = async () => {
    const result = await getAllStudents("current");
    if (result.status === 200) {
      setStudents(result.data);
    }
  };
  const fetchCurrentSchoolInfo = async () => {
    const result = await getCurrentSchoolInfo();
    console.log(result);
    if (result.status === 200) {
      setCurrentSchoolInfo(result.data);
    }
  };
  const handleFetchSchoolConstants = async () => {
    const result = await getAllSchoolConstants();
    if (result.status === 200) {
      setSchoolConstants(result.data);
    }
  };
  const handleFilterStudents = () => {
    let filtered = students.filter((student) => {
      const person = student.person;
      return person.name
        .trim()
        .toLowerCase()
        .includes(filterValues.text.toLowerCase());
    });
    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((student) => {
        return student.type === parseInt(filterValues.selected1);
      });
    }
    if (filterValues.selected2 !== "0") {
      filtered = filtered.filter((student) => {
        return student.level === parseInt(filterValues.selected2);
      });
    }
    setFilteredStudents(filtered);
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
      const result = await createStudent(formInputs);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        setStudents([...students, result.data]);
        setFormValues({
          ...formValues,
          loading: false,
        });
        handleCancel();
      }
    } else {
      //? update
      const result = await updateStudent(formInputs); // ? person data only
      console.log(result);
      dispatch(
        showToast({
          body: result.message,
        })
      );
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };
  const handleCancel = () => {
    handleClearInputs();
    setFormValues({
      ...formValues,
      shown: false,
      type: 0,
    });
  };
  const handleClearInputs = () => {
    setFormInputs({
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
      student: {
        level: 1,
        course: "BSIT",
        section: "A",
        type: 1,
      },
    });
    setSelectedData(null);
  };

  //? TABLE FUNCTIONS
  const handleUpdateStudent = (studentID) => {
    setSelectedData(studentID);
    setFormValues({
      ...formValues,
      shown: true,
      type: 2,
    });
  };
  const handleViewSubjects = (studentID) => {
    navigate(`/students/${studentID}/subjects`);
  };
  const handleViewGuardian = (studentID) => {
    navigate(`/students/${studentID}/guardians`);
  };
  const handleViewStudentsBySchoolInfo = async () => {
    const type = currentStudents ? "all" : "current";
    const result = await getAllStudents(type);
    if (result.status === 200) {
      setStudents([]);
      setCurrentStudents(!currentStudents);
      setStudents(result.data);
    }
  };

  const handleMoveStudent = async (id) => {
    const result = await moveStudentToCurrentSem(id);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setStudents(
        students.filter((student) => {
          return student._id !== id;
        })
      );
    }
  };

  const handleViewUpdate = async (id) => {
    setSelectedData(id);
    setFormValues({
      ...formValues,
      type: 1,
      shown: true,
    });
    const result = await getStudentForUpdate(id);
    if (result.status === 200) {
      const data = result.data;
      const person = data.person;
      setFormInputs({
        ...formInputs,
        person: {
          ...formInputs.person,
          name: person.name,
          age: person.age,
          birthDate: person.birthDate,
          gender: person.gender,
          mobileNumber: person.mobileNumber,
        },
        student: {
          ...formInputs.student,
          level: data.level,
          course: data.course,
          section: data.section,
        },
      });
    } else {
      setFormValues({
        ...formValues,
        shown: false,
        loading: false,
      });
    }
  };

  const handleNotify = async (type) => {
    dispatch(startLoading());
    const result = await createGradeNotifications({ type: type });
    dispatch(
      showToast({
        body: result.message,
      })
    );
    dispatch(stopLoading());
  };

  const handleGenerateReport = (studentID) => {
    navigate(`/students/${studentID}/report`);
  };

  return (
    <>
      <div className="page-header">
        <Filter
          init={
            filterValues.selected1 === "1"
              ? init1
              : filterValues.selected1 === "2"
              ? init2
              : filterValues.selected1 === "3"
              ? init3
              : init1
          }
          state={filterValues}
          handleState={handleFilter}
        />
        <div className="page-header-functions">
          {auth.user.role === 2 && (
            <div className="page-header-notifications">
              <span>Notify: </span>
              <button
                className="page-function page-function-notification"
                onClick={(e) => {
                  e.preventDefault();
                  handleNotify(1);
                }}
              >
                Preliminary Term
              </button>

              <button
                className="page-function page-function-notification"
                onClick={(e) => {
                  e.preventDefault();
                  handleNotify(2);
                }}
              >
                Middle Term
              </button>
              <button
                className="page-function page-function-notification"
                onClick={(e) => {
                  e.preventDefault();
                  handleNotify(3);
                }}
              >
                Pre-final Term
              </button>

              <button
                className="page-function page-function-notification"
                onClick={(e) => {
                  e.preventDefault();
                  handleNotify(4);
                }}
              >
                Final Term
              </button>

              <button
                className="page-function page-function-notification"
                onClick={(e) => {
                  e.preventDefault();
                  handleNotify(5);
                }}
              >
                Final Grade
              </button>
            </div>
          )}
          <button
            className="page-function"
            onClick={(e) => {
              e.preventDefault();
              handleViewStudentsBySchoolInfo();
            }}
          >
            {currentStudents ? "View all students" : "View current students"}
          </button>
        </div>
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>Students</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Course</th>
              <th>Year Level</th>
              <th>Section</th>
              <th># of subjects</th>
              {(auth.user.role === 1 || auth.user.role === 2) && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => {
              const person = student.person;
              return (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{person.name}</td>
                  <td>{student.course}</td>
                  <td>{studentLevelText(student.level)}</td>
                  <td>{student.section}</td>
                  <td>{student.subjectCount || "None"}</td>
                  <td>
                    {auth.user.role === 1 && (
                      <>
                        <button
                          className="table-function"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewGuardian(student._id);
                          }}
                        >
                          Guardian
                        </button>
                        {!currentStudents &&
                          currentSchoolInfo &&
                          currentSchoolInfo._id !== student.schoolInfo && (
                            <button
                              className="table-function"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMoveStudent(student._id);
                              }}
                            >
                              Move
                            </button>
                          )}
                        <button
                          className="table-function"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewUpdate(student._id);
                          }}
                        >
                          Update
                        </button>
                      </>
                    )}
                    {auth.user.role === 2 && (
                      <>
                        <button
                          className="table-function"
                          onClick={(e) => {
                            handleViewSubjects(student._id);
                          }}
                        >
                          Subjects
                        </button>
                        <button
                          className="table-function"
                          onClick={(e) => {
                            handleGenerateReport(student._id);
                          }}
                        >
                          Report
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
        {auth.user.role === 1 && (
          <button
            className="page-function"
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            Create student
          </button>
        )}
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
              ? "Student creation form"
              : formValues.type === 2
              ? "Student update form"
              : "Student form"}
          </h4>
          {selectedData === null && (
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
          )}
          <div className="form-fields">
            <div className="form-field">
              <label>Course</label>
              <select
                value={formInputs.student.type}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    student: {
                      ...formInputs.student,
                      type: e.target.value,
                    },
                  });
                }}
              >
                {formInputs.student.type === 1
                  ? schoolConstants.COLLEGE_COURSES.map((course) => {
                      return (
                        <option key={course.code} value={course.code}>
                          {course.name}
                        </option>
                      );
                    })
                  : formInputs.student.type === 2
                  ? schoolConstants.SENIOR_COURSES.map((course) => {
                      return (
                        <option key={course.code} value={course.code}>
                          {course.name}
                        </option>
                      );
                    })
                  : formInputs.student.type === 3
                  ? schoolConstants.JUNIOR_COURSES.map((course) => {
                      return (
                        <option key={course.code} value={course.code}>
                          {course.name}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <div className="form-field">
              <label>Year Level</label>
              <select
                value={formInputs.student.level}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    student: {
                      ...formInputs.student,
                      level: parseInt(e.target.value),
                    },
                  });
                }}
              >
                {formInputs.student.type === 1
                  ? schoolConstants.COLLEGE_LEVELS.map((level) => {
                      return (
                        <option key={level.value} value={level.value}>
                          {level.text}
                        </option>
                      );
                    })
                  : formInputs.student.type === 2
                  ? schoolConstants.SENIOR_LEVELS.map((level) => {
                      return (
                        <option key={level.value} value={level.value}>
                          {level.text}
                        </option>
                      );
                    })
                  : formInputs.student.type === 3
                  ? schoolConstants.JUNIOR_LEVELS.map((level) => {
                      return (
                        <option key={level.value} value={level.value}>
                          {level.text}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <div className="form-field">
              <label>Section</label>
              <select
                value={formInputs.student.section}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    student: {
                      ...formInputs.student,
                      section: e.target.value,
                    },
                  });
                }}
              >
                {formInputs.student.type === 1
                  ? schoolConstants.COLLEGE_SECTIONS.map((section) => {
                      return (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      );
                    })
                  : formInputs.student.type === 2
                  ? schoolConstants.SENIOR_SECTIONS.map((section) => {
                      return (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      );
                    })
                  : formInputs.student.type === 3
                  ? schoolConstants.JUNIOR_SECTIONS.map((section) => {
                      return (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      );
                    })
                  : null}
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
                      ...formInputs.person,
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

export default Students;

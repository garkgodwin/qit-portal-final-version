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
  getStudentForUpdate,
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

const Students = () => {
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
    selected1: {
      label: "Student is",
      options: [
        { value: 1, text: "College" },
        { value: 2, text: "Senior High" },
        { value: 3, text: "Junior High" },
      ],
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
    selected1: {
      label: "Student is",
      options: [
        { value: 1, text: "College" },
        { value: 2, text: "Senior High" },
        { value: 3, text: "Junior High" },
      ],
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
    selected1: {
      label: "Student is",
      options: [
        { value: 1, text: "College" },
        { value: 2, text: "Senior High" },
        { value: 3, text: "Junior High" },
      ],
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
    handleFetchStudents();
    handleFetchSchoolConstants();
  }, []);
  const handleFetchStudents = async () => {
    const result = await getAllStudents();
    if (result.status === 200) {
      setStudents(result.data);
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
    formValues({
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
              <th>Type</th>
              <th>Course</th>
              <th>Year Level</th>
              <th>Section</th>
              <th># of guardians</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => {
              const person = student.person;
              return (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{person.name}</td>
                  <td>{studentForThisSubject(student.type)}</td>
                  <td>{student.course}</td>
                  <td>{studentLevelText(student.level)}</td>
                  <td>{student.section}</td>
                  <td>{student.guardian ? 1 : 0}</td>
                  <td>
                    {auth.user.role === 1 && (
                      <button
                        className="table-function"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewGuardian(student._id);
                        }}
                      >
                        Guardian
                      </button>
                    )}
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
                        e.preventDefault();
                        handleUpdateStudent(student._id);
                      }}
                    >
                      Update
                    </button>
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
          Create student
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
              ? "Student creation form"
              : formValues.type === 2
              ? "Student update form"
              : "Student form"}
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
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label>Student Type</label>
              <select
                value={formInputs.student.type}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  //? course, year, section
                  let course = "";
                  let level = 0;
                  let section = "";
                  if (val === 1) {
                    course = schoolConstants.COLLEGE_COURSES[0].code;
                    level = schoolConstants.COLLEGE_LEVELS[0].value;
                    section = schoolConstants.COLLEGE_SECTIONS[0];
                  } else if (val === 2) {
                    course = schoolConstants.SENIOR_COURSES[0].code;
                    level = schoolConstants.SENIOR_LEVELS[0].value;
                    section = schoolConstants.SENIOR_SECTIONS[0];
                  } else if (val === 3) {
                    course = schoolConstants.JUNIOR_COURSES[0].code;
                    level = schoolConstants.JUNIOR_LEVELS[0].value;
                    section = schoolConstants.JUNIOR_SECTIONS[0];
                  }
                  setFormInputs({
                    ...formInputs,
                    student: {
                      ...formInputs.student,
                      type: parseInt(e.target.value),
                      course: course,
                      level: level,
                      section: section,
                    },
                  });
                }}
              >
                {schoolConstants.STUDENT_TYPES.map((type) => {
                  return (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  );
                })}
              </select>
            </div>
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

export default Students;

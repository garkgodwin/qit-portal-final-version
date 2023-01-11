import React, { useState, useEffect } from "react";

//? GLOBAL STATE
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import {
  getSubjectsAvailableForThisStudent,
  addSubjectToStudent,
  dropStudentSubject,
  createGrade,
} from "../../api/students";

//? ROUTES
import { useLocation, useNavigate } from "react-router-dom";
import { getStudentAndSubjects } from "../../api/students";
//? COMPONENTS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";
import {
  semester,
  studentForThisSubject,
  studentLevelText,
} from "../../helpers/formatSubjects";

//? HELPERS
import { calculateTermGrade } from "../../helpers/calculate";
import SubjectGradeList from "../../components/list/SubjectGradeList";

const StudentClasses = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: 0,
  });
  const [formSubjects, setFormSubjects] = useState([]); //? These subject will be used for subject adding
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 1, // 1- add subject// 2- update grade
    loading: false,
  });
  const [formInputs, setFormInputs] = useState({
    subjectCode: "",
  });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formGradeInputs, setFormGradeInputs] = useState({
    term: 1,
    type: 1,
    achieved: 0,
    total: 0,
  });

  useEffect(() => {
    const pth = location.pathname.split("/");
    const studentID = pth[2];
    handleFetchStudentAndClasses(studentID);
    handleFormSubjects(studentID);
  }, [location]);

  useEffect(() => {
    if (formSubjects.length === 0) {
      return;
    }
    setFormInputs({
      subjectCode: formSubjects[0].code,
    });
  }, [formSubjects]);

  //? get all student's subject and classes
  const handleFetchStudentAndClasses = async (studentID) => {
    if (studentID === "" || studentID === undefined || studentID === null) {
      navigate("/students");
    } else {
      const result = await getStudentAndSubjects(studentID);
      if (result.status === 200) {
        const d = result.data;
        setStudent(d.student);
        setSubjects(d.subjects);
      } else {
        navigate("/students");
      }
      await fetchSubjectsForForm();
    }
  };
  //? for form subjects that are available
  const handleFormSubjects = async (studentID) => {
    const result = await getSubjectsAvailableForThisStudent(studentID);
    if (result.status === 200) {
      setFormSubjects(result.data);
    }
  };

  const init1 = {
    text: {
      label: "Subject",
      placeholder: "subject here...",
    },
    selected1: {
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
      label: "Subject",
      placeholder: "subject here...",
    },
    selected: {
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
      label: "Subject",
      placeholder: "subject here...",
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

  const handleFilter = () => {};

  //? FORM RELATED
  const fetchSubjectsForForm = async () => {
    if (!student) {
      return;
    } else {
      const result = await getSubjectsAvailableForThisStudent(student._id);
      if (result.status === 200) {
        setFormSubjects(result.data);
      } else {
        setFormSubjects([]);
      }
    }
  };
  const handleAddSubject = () => {
    if (auth.user.role !== 2) {
      dispatch(
        showToast({
          body: "Only registrar can add subject to the student.",
        })
      );
    } else {
      if (!student) {
        return;
      } else {
        setFormValues({
          ...formValues,
          shown: true,
        });
      }
    }
  };

  const handleSubmit = async () => {
    const id = student._id;
    setFormValues({
      ...formValues,
      loading: true,
    });
    const result = await addSubjectToStudent(id, formInputs);
    setFormValues({
      ...formValues,
      loading: false,
    });
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setSubjects([...subjects, result.data]);
      setFormValues({
        ...formValues,
        shown: false,
      });
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };
  const handleCancel = () => {
    setFormValues({
      ...formValues,
      shown: false,
      loading: false,
      type: 1,
    });
  };

  const getTotal = (grades) => {
    let total = 0;
    const prelim = calculateTermGrade(grades.prelim) * 0.2;
    const mid = calculateTermGrade(grades.mid) * 0.2;
    const prefi = calculateTermGrade(grades.prefi) * 0.2;
    const final = calculateTermGrade(grades.final) * 0.5;
    total = prelim + mid + prefi + final;
    return total;
  };

  const handleDropStudentSubject = async (subjectID) => {
    const result = await dropStudentSubject(subjectID);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setSubjects(
        subjects.filter((sub) => {
          return sub._id !== subjectID;
        })
      );
    }
  };

  //? GRADES
  const handleGradeUpdate = async (subjectID) => {
    setFormValues({
      ...formValues,
      shown: true,
      type: 2,
    });
    setSelectedSubject(subjectID);
  };

  const handleSubmitGrade = async () => {
    const studentID = student._id;
    if (formGradeInputs.achieved === "") {
      dispatch(
        showToast({
          body: "Please make sure you enter an achieved value",
        })
      );
      return;
    }
    if (formGradeInputs.total === "") {
      dispatch(
        showToast({
          body: "Please make sure you enter a total value",
        })
      );
      return;
    }
    setFormValues({
      ...formValues,
      loading: true,
    });
    const result = await createGrade(
      studentID,
      selectedSubject,
      formGradeInputs
    );
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      const d = result.data;
      setSubjects(
        subjects.map((sub) => {
          if (sub._id === d._id) {
            sub = d;
            return sub;
          }
        })
      );
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init1} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>{student === null ? "Student" : student.person.name}</h3>
          <span>
            {student === null
              ? "No data"
              : student.course +
                " : " +
                student.level +
                " : " +
                student.section}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Subject</th>
              <th>Schedules</th>
              <th>Prelim</th>
              <th>Midterm</th>
              <th>Prefi</th>
              <th>Final</th>
              <th>Total</th>
              {(auth.user.role === 2 || auth.user.role === 1) && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {subjects.map((cls, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{cls.subjectCode}</td>
                  <td>{cls.subjectName}</td>
                  <td>{cls.schedules || "No schedule yet"}</td>
                  <td>{calculateTermGrade(cls.grades.prelim).toString()}</td>
                  <td>{calculateTermGrade(cls.grades.mid).toString()}</td>
                  <td>{calculateTermGrade(cls.grades.prefi).toString()}</td>
                  <td>{calculateTermGrade(cls.grades.final).toString()}</td>
                  <td>{getTotal(cls.grades)}</td>
                  {(auth.user.role === 2 || auth.user.role === 1) && (
                    <td>
                      <button
                        className="table-function"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropStudentSubject(cls._id);
                        }}
                      >
                        Drop
                      </button>
                      <button
                        className="table-function"
                        onClick={(e) => {
                          e.preventDefault();
                          handleGradeUpdate(cls._id);
                        }}
                      >
                        Update Grade
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {formValues.type === 1 ? (
        <Form
          shown={formValues.shown}
          loading={formValues.loading}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        >
          <div className="form-body">
            <div className="form-title">
              {formValues.type === 1
                ? "Student subject adding form"
                : formValues.type === 2
                ? "Student subject update form"
                : "Student subject form"}
            </div>
            <div className="form-fields">
              <div className="form-field form-field-100">
                <label>Choose a subject</label>
                <select
                  size={12}
                  value={formInputs.subjectCode}
                  onChange={(e) => {
                    setFormInputs({
                      ...formInputs,
                      subjectCode: e.target.value,
                    });
                  }}
                >
                  {formSubjects.map((subject) => {
                    return (
                      <option key={subject.code} value={subject.code}>
                        {studentForThisSubject(subject.student) +
                          " : " +
                          studentLevelText(subject.level) +
                          " : " +
                          semester(subject.semester) +
                          " : " +
                          subject.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </Form>
      ) : formValues.type === 2 ? (
        <Form
          shown={formValues.shown}
          loading={formValues.loading}
          handleCancel={handleCancel}
          handleSubmit={handleSubmitGrade}
        >
          <div className="form-body">
            <div className="form-title">Update subject grade</div>
            <div className="form-fields">
              <div className="form-field form-field-100">
                <label>Subject Grades</label>
                {subjects.map((subject) => {
                  if (subject._id === selectedSubject) {
                    return (
                      <SubjectGradeList
                        key={subject._id}
                        grades={subject.grades}
                      />
                    );
                  }
                })}
              </div>
              <div className="form-field form-field-100">
                <label>Term</label>
                <select
                  value={formGradeInputs.term}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormGradeInputs({
                      ...formGradeInputs,
                      term: val,
                    });
                  }}
                >
                  <option value={1}>Prelim term</option>
                  <option value={2}>Mid term</option>
                  <option value={3}>Prefi term</option>
                  <option value={4}>Final term</option>
                </select>
              </div>
              <div className="form-field form-field-100">
                <label>Type</label>
                <select
                  value={formGradeInputs.type}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      type: val,
                    });
                  }}
                >
                  <option value={1}>Quiz</option>
                  <option value={2}>Activity</option>
                  <option value={3}>Performance</option>
                  <option value={4}>Exam</option>
                </select>
              </div>
              <div className="form-field">
                <label>Achieved</label>
                <input
                  type="number"
                  min={0}
                  value={formGradeInputs.achieved}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      achieved: val,
                    });
                  }}
                />
              </div>
              <div className="form-field">
                <label>Total</label>
                <input
                  type="number"
                  min={0}
                  value={formGradeInputs.total}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      total: val,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </Form>
      ) : null}
      <div className="page-functions">
        {(auth.user.role === 1 ||
          auth.user.role === 2 ||
          auth.user.role === 3) && (
          <button
            className="page-function"
            onClick={(e) => {
              e.preventDefault();
              handleAddSubject();
            }}
          >
            Add subject
          </button>
        )}
      </div>
    </>
  );
};

export default StudentClasses;

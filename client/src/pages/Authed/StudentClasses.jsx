import React, { useState, useEffect } from "react";

//? GLOBAL STATE
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import {
  getSubjectsAvailableForThisStudent,
  getStudentSubjectDetails,
  addSubjectToStudent,
  dropStudentSubject,
  createGrade,
} from "../../api/students";
import { getCurrentSchoolInfo } from "../../api/schoolInfo";

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
import ReportSample from "../../components/reports/ReportSample";

//? HELPERS
import {
  calculateTermGrade,
  getSubjectTotalGrade,
} from "../../helpers/calculate";
import SubjectGradeList from "../../components/list/SubjectGradeList";

const StudentClasses = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(null);
  const [student, setStudent] = useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: 0,
    selected2: 0,
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
  const [formGradeInputs, setFormGradeInputs] = useState({
    prelim: "",
    mid: "",
    prefi: "",
    final: "",
  });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formGradeInit, setFormGradeInit] = useState(null);

  useEffect(() => {
    handleGetCurrentSchoolInfo();
    const pth = location.pathname.split("/")[3];
  }, []);

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

  useEffect(() => {
    if (student) {
      setFilteredSubjects(student.subjects);
      handleFilterCurrent();
    } else {
      setFilteredSubjects([]);
    }
  }, [student]);

  //? get all student's subject and classes
  const handleFetchStudentAndClasses = async (studentID) => {
    if (studentID === "" || studentID === undefined || studentID === null) {
      navigate("/students");
    } else {
      const result = await getStudentAndSubjects(studentID);
      if (result.status === 200) {
        const d = result.data;
        setStudent(d);
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

  //? FILTER
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
    selected2: {
      label: "Semester",
      options: [
        { value: 0, text: "All" },
        { value: 1, text: "1st semester" },
        { value: 2, text: "2nd semester" },
      ],
    },
  };
  const handleFilter = (type, val) => {
    if (type === 1) {
      setFilterValues({
        ...filterValues,
        text: val,
      });
    } else if (type === 2) {
      setFilterValues({
        ...filterValues,
        selected1: parseInt(val),
      });
    } else if (type === 3) {
      setFilterValues({
        ...filterValues,
        selected2: parseInt(val),
      });
    }
  };
  const handleGetCurrentSchoolInfo = async () => {
    const result = await getCurrentSchoolInfo();
    if (result.status === 200) {
      setCurrent(result.data);
    }
  };
  const handleFilterCurrent = () => {
    if (current !== null && student !== null) {
      setFilterValues({
        ...filterValues,
        selected1: student.level,
        selected2: current.sem,
      });
    }
  };
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
      setStudent({
        ...student,
        subjects: [...student.subjects, result.data],
      });
      setFormSubjects(
        formSubjects.filter((sub) => {
          return result.data.subjectCode !== sub.code;
        })
      );
      setFormValues({
        ...formValues,
        shown: false,
      });
      window.location.reload(true);
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
    if (!grades) {
      return 0;
    }
    let total = 0;
    const prelim = (grades.prelim || 0) * 0.2;
    const mid = (grades.mid || 0) * 0.2;
    const prefi = (grades.prefi || 0) * 0.2;
    const final = (grades.final || 0) * 0.2;
    total = prelim + mid + prefi + final;
    return total;
  };

  //? GRADES
  const handleGradeUpdate = async (subjectID) => {
    const studentID = student._id;
    const result = await getStudentSubjectDetails(studentID, subjectID);
    if (result.status === 200) {
      const d = result.data;
      setFormValues({
        ...formValues,
        shown: true,
        type: 2,
      });
      setFormGradeInputs(d.grades);
      setFormGradeInit(d);
    }
    setSelectedSubject(subjectID);
  };

  const hanldeUpdateSubjectGrade = async () => {
    const studentID = student._id;
    console.log("Selected subject", selectedSubject);
    console.log("Student ID", studentID);
    if (!selectedSubject) {
      dispatch(
        showToast({
          body: "There is no subject selected",
        })
      );
      return;
    }
    const inputs = {
      prelim:
        isNaN(formGradeInputs.prelim) || formGradeInputs.prelim === ""
          ? 0
          : parseInt(formGradeInputs.prelim),
      mid:
        isNaN(formGradeInputs.mid) || formGradeInputs.mid === ""
          ? 0
          : parseInt(formGradeInputs.mid),
      prefi:
        isNaN(formGradeInputs.prefi) || formGradeInputs.prefi === ""
          ? 0
          : parseInt(formGradeInputs.prefi),
      final:
        isNaN(formGradeInputs.final) || formGradeInputs.final === ""
          ? 0
          : parseInt(formGradeInputs.final),
    };
    setFormGradeInputs(inputs);
    if (inputs.prelim < 0) {
      dispatch(
        showToast({
          body: "Please make sure the prelim term is not less than 0",
        })
      );
      return;
    }
    if (inputs.mid < 0) {
      dispatch(
        showToast({
          body: "Please make sure the middle term is not less than 0",
        })
      );
      return;
    }
    if (inputs.prefi < 0) {
      dispatch(
        showToast({
          body: "Please make sure the prefinal term is not less than 0",
        })
      );
      return;
    }
    if (inputs.final < 0) {
      dispatch(
        showToast({
          body: "Please make sure the final term is not less than 0",
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
    dispatch(showToast({ body: result.message }));
    if (result.status === 200) {
      const d = result.data;
      // window.location.reload();
      setStudent({
        ...student,
        subjects: student.subjects.map((sub) => {
          if (sub._id === d._id) {
            sub = d;
          }
          return sub;
        }),
      });
      setFormValues({
        ...formValues,
        loading: false,
        shown: false,
      });
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };

  //? REPORT
  const handleGenerateReport = async () => {
    console.log(student);
  };
  return (
    <>
      <div className="page-header">
        {location.pathname.split("/")[3] !== "report" ? (
          <>
            <Filter
              init={init1}
              state={filterValues}
              handleState={handleFilter}
            />
            <button
              className="page-function page-function-top"
              onClick={(e) => {
                e.preventDefault();
                handleFilterCurrent();
              }}
            >
              Current subjects
            </button>
          </>
        ) : (
          <>
            <button
              className="page-function page-function-top page-function-report"
              onClick={(e) => {
                e.preventDefault();
                handleGenerateReport();
              }}
            >
              Generate Report
            </button>
          </>
        )}
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
              <th>Prelim</th>
              <th>Midterm</th>
              <th>Prefi</th>
              <th>Final</th>
              <th>Total</th>
              {location.pathname.split("/")[3] !== "report" &&
                auth.user.role === 3 && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((cls, index) => {
              if (
                !cls.subjectCode
                  .toLowerCase()
                  .includes(filterValues.text.toLowerCase())
              ) {
                return;
              }
              if (
                filterValues.selected1 !== 0 &&
                filterValues.selected1 !== cls.yearLevelOfStudent
              ) {
                return;
              }
              if (
                filterValues.selected2 !== 0 &&
                filterValues.selected2 !== cls.schoolInfo.sem
              ) {
                return;
              }
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {cls.subjectCode ? cls.subjectCode : "No subject code"}
                  </td>
                  <td>{cls.subjectName}</td>
                  <td>
                    {cls.grades && cls.grades.prelim ? cls.grades.prelim : 0}
                  </td>
                  <td>{cls.grades && cls.grades.mid ? cls.grades.mid : 0}</td>
                  <td>
                    {cls.grades && cls.grades.prefi ? cls.grades.prefi : 0}
                  </td>
                  <td>
                    {cls.grades && cls.grades.final ? cls.grades.final : 0}
                  </td>
                  <td>{getSubjectTotalGrade(cls)}</td>
                  {auth.user.role === 3 && (
                    <td>
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
      {formValues.type === 2 ? (
        <Form
          shown={formValues.shown}
          loading={formValues.loading}
          handleCancel={handleCancel}
          handleSubmit={hanldeUpdateSubjectGrade}
        >
          <div className="form-body">
            <div className="form-title">
              {"Grades of " +
                (formGradeInit !== null ? formGradeInit.subjectCode : "None")}
            </div>
            <div className="form-fields">
              <div className="form-field">
                <label>Preliminary Term Grade</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formGradeInputs.prelim}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      prelim: val,
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-fields">
              <div className="form-field">
                <label>Middle Term Grade</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formGradeInputs.mid}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      mid: val,
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-fields">
              <div className="form-field">
                <label>Prefinal Term Grade</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formGradeInputs.prefi}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      prefi: val,
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-fields">
              <div className="form-field">
                <label>Final Term Grade</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formGradeInputs.final}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormGradeInputs({
                      ...formGradeInputs,
                      final: val,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </Form>
      ) : formValues.type === 1 ? (
        <Form
          shown={formValues.shown}
          loading={formValues.loading}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
        >
          <div className="form-body">
            <div className="form-title">Add subject</div>
            <div className="form-fields">
              <div className="form-field-100">
                <label>Available Subjects</label>
                <select
                  value={formInputs ? formInputs.subjectCode : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormInputs({
                      ...formInputs,
                      subjectCode: v,
                    });
                  }}
                >
                  {formSubjects.map((sub, index) => {
                    return (
                      <option key={index} value={sub.code}>
                        {sub.code + " : " + sub.name}
                      </option>
                    );
                  })}
                </select>
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

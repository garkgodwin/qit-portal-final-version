import React, { useState, useEffect } from "react";

//? ROUTEs
import { useNavigate } from "react-router-dom";

//? GLOBAL STATE
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import { getAllInstructors } from "../../api/staffs";
import {
  getClasses,
  createClass,
  getClass,
  updateClass,
} from "../../api/classes";
import { getAllSchoolConstants } from "../../api/general";

//? HELPERS
import { getRoleText } from "../../helpers/formatText";
import {
  collegeSubjectsToArray,
  combineArrays,
  juniorSubjectsToArray,
  seniorSubjectsToArray,
  studentForThisSubject,
  studentLevelText,
} from "../../helpers/formatSubjects";

//? Components
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";

const Classes = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "1", // 1-  college, 2- senior , 3 - junior
  });

  const [selectedClass, setSelectedClass] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 0, // 1 - create , 2 - update
    loading: false,
  });
  const [subjects, setSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [formInputs, setFormInputs] = useState({
    subjectCode: "",
    instructor: "",
    studentType: 1,
  });

  const init1 = {
    text: {
      label: "Subject code",
      placeholder: "subject here...",
    },
    selected1: {
      label: "Class is for",
      options: [
        { value: 0, text: "Everyone" },
        { value: 1, text: "College" },
        { value: 2, text: "Senior High" },
        { value: 3, text: "Junior High" },
      ],
    },
    selected2: {
      label: "Class by year level",
      options: [
        { value: 0, text: "All year levels" },
        { value: 1, text: "1st year" },
        { value: 2, text: "2nd year" },
        { value: 3, text: "3rd year" },
        { value: 4, text: "4th year" },
      ],
    },
  };

  useEffect(() => {
    handleFilterClasses();
  }, [filterValues]);
  useEffect(() => {
    handleFilterClasses();
  }, [classes]);
  useEffect(() => {
    handleFetchClasses();
    setFormSelections();
  }, []);

  const handleFetchClasses = async () => {
    const result = await getClasses();
    if (result.status === 200) {
      setClasses(result.data);
    }
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

  const handleFilterClasses = () => {
    let filtered = classes.filter((cls) => {
      return cls.subjectCode
        .toLowerCase()
        .includes(filterValues.text.trim().toLowerCase());
    });

    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((cls) => {
        return cls.studentType === parseInt(filterValues.selected1);
      });
    }
    setFilteredClasses(filtered);
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

    const data = {
      class: formInputs,
    };
    const result = await createClass(data);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setClasses([...classes, result.data]);
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
      loading: false,
    });
    setSelectedClass(null);
  };

  //? FORM RELATES
  const setFormSelections = async () => {
    const result = await getAllSchoolConstants();
    const resultInstructors = await getAllInstructors();
    if (result.status === 200) {
      const data = result.data;
      const cs = collegeSubjectsToArray(data.COLLEGE_SUBJECTS);
      const ss = seniorSubjectsToArray(data.SENIOR_SUBJECTS);
      const js = juniorSubjectsToArray(data.JUNIOR_SUBJECTS);
      setSubjects(combineArrays(cs, ss, js));
    }
    if (resultInstructors.status === 200) {
      setInstructors(resultInstructors.data);
      if (resultInstructors.data.length !== 0) {
        setFormInputs({
          ...formInputs,
          instructor: resultInstructors.data[0].user._id,
        });
      }
    }
  };

  useEffect(() => {
    setFilteredSubjects(
      subjects.filter((sub) => {
        return sub.student === formInputs.studentType;
      })
    );
  }, [subjects]);

  useEffect(() => {
    if (filteredSubjects.length === 0) {
      return;
    }
    setFormInputs({
      ...formInputs,
      subjectCode: filteredSubjects[0].code,
    });
  }, [filteredSubjects]);

  useEffect(() => {
    console.log(formInputs);
  }, []);

  useEffect(() => {
    if (selectedClass !== null) {
      setFormInputs({
        ...formInputs,
        subjectCode: selectedClass.subjectCode,
        instructor: selectedClass.instructor._id,
        studentType: selectedClass.studentType,
      });
    }
  }, [selectedClass]);

  const handleAdd = (classID) => {
    navigate(`/classes/${classID}/info`);
  };

  const handleUpdate = (classData) => {
    setFormValues({
      type: 2,
      shown: true,
    });
    setSelectedClass(classData);
  };
  return (
    <>
      <div className="page-header">
        <Filter init={init1} state={filterValues} handleState={handleFilter} />
      </div>
      <div className="page-body">
        <div className="page-body-title">
          <h3>Classes</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Subject</th>
              <th>Instructor</th>
              <th># of students</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((acc, index) => {
              return (
                <tr key={acc._id}>
                  <td>{index + 1}</td>
                  <td>{acc.subjectCode}</td>
                  <td>{acc.name || "No subject name"}</td>
                  <td>{acc.instructor.person.name}</td>
                  <td>{acc.students.length} </td>
                  <td>{studentForThisSubject(acc.studentType)}</td>
                  <td>
                    <button
                      className="table-function"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAdd(acc._id);
                      }}
                    >
                      Add student
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="page-functions">
        {auth.user.role === 2 && (
          <button
            className="page-function"
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            Create class
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
              ? "Class creation form"
              : formValues.type === 2
              ? "Class update form"
              : "Class form"}
          </h4>
          <div className="form-fields">
            <div className="form-field">
              <label>Student Type</label>
              <select
                value={formInputs.studentType}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    studentType: parseInt(e.target.value),
                  });

                  setFilteredSubjects(
                    subjects.filter((sub) => {
                      return sub.student === parseInt(e.target.value);
                    })
                  );
                }}
              >
                <option value={1}>College</option>
                <option value={2}>Senior High</option>
                <option value={3}>Junior High</option>
              </select>
            </div>

            <div className="form-field">
              <label>Instructor</label>
              <select
                value={formInputs.instructor}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    instructor: e.target.value,
                  });
                }}
              >
                {instructors.map((qq) => {
                  return (
                    <option key={qq.user._id} value={qq.user._id}>
                      {qq.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="form-fields">
            <div className="form-field form-field-100">
              <label>Subject</label>
              <select
                size={8}
                value={formInputs.subjectCode}
                onChange={(e) => {
                  setFormInputs({
                    ...formInputs,
                    subjectCode: e.target.value,
                  });
                }}
              >
                {filteredSubjects.map((subject) => {
                  return (
                    <option
                      key={subject.code + subject.student}
                      value={subject.code}
                    >
                      {studentForThisSubject(subject.student) +
                        "    : " +
                        studentLevelText(subject.level) +
                        "    : " +
                        `Semester ${subject.semester}` +
                        "    : " +
                        subject.code +
                        "    :    " +
                        subject.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Classes;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../features/toastSlice";
import {
  getClass,
  getStudentsToAddForClass,
  addStudentToClass,
} from "../../api/classes";
import "./ClassInfo.css";
import Form from "../../components/form/Form";
import { studentLevelText } from "../../helpers/formatSubjects";

const ClassInfo = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    loading: false,
    type: 1,
  });
  const [formStudents, setFormStudents] = useState([]);
  const [formInputs, setFormInputs] = useState({
    studentID: "",
  });

  useEffect(() => {
    const classID = location.pathname.split("/")[2];
    if (classID) {
      handleFetchClassInfo(classID);
      handleFetchStudents(classID);
    }
  }, []);

  const handleFetchClassInfo = async (classID) => {
    const result = await getClass(classID);
    if (result.status === 200) {
      setClassData(result.data);
    } else {
      navigate("/classes");
    }
  };

  const handleFetchStudents = async (classID) => {
    const result = await getStudentsToAddForClass(classID);
    if (result.status === 200) {
      setFormStudents(result.data);
      if (result.data.length !== 0) {
        setFormInputs({
          studentID: result.data[0]._id,
        });
      }
    } else {
      setFormValues({
        ...formValues,
        shown: false,
      });
    }
  };

  const handleOpenForm = () => {
    setFormValues({
      ...formValues,
      shown: true,
    });
  };
  const handleCancel = () => {
    setFormValues({
      ...formValues,
      loading: false,
      shown: false,
    });
  };
  const handleSubmit = async () => {
    setFormValues({
      ...formValues,
      loading: true,
    });
    const result = await addStudentToClass(classData._id, formInputs.studentID);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      setClassData({
        ...classData,
        students: [...classData.students, result.data],
      });
    }
    setFormValues({
      ...formValues,
      loading: false,
      shown: false,
    });
  };

  if (!classData) {
    return null;
  }
  return (
    <div className="ClassInfo">
      <div className="class-details">
        <h1>{classData.subjectName}</h1>
        <span>{classData.subjectCode}</span>
      </div>
      <div className="class-instructor">
        <p>{classData.instructor.person.name || "No instructor"}</p>
        <span>Instructor</span>
        <button className="class-instructor-function">View details</button>
      </div>
      <div className="class-students">
        {auth.user.role === 2 && (
          <div className="class-empty">
            <button
              className="table-function"
              onClick={(e) => {
                e.preventDefault();
                handleOpenForm();
              }}
            >
              +
            </button>
          </div>
        )}
        {classData.students.map((student, index) => {
          return (
            <div className="class-student" key={index}>
              <p>{student.person.name || "No student name"}</p>
              <span>Student</span>
              <button
                className="class-student-function"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/students/${student._id}/subjects`);
                }}
              >
                View details
              </button>
            </div>
          );
        })}
      </div>

      <Form
        shown={formValues.shown}
        loading={formValues.loading}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      >
        <div className="form-body">
          <h4 className="form-title">
            {formValues.type === 1 ? "Adding student to class" : ""}
          </h4>
          <div className="form-fields">
            <div className="form-field form-field-100">
              <label>Available studnets to be added</label>
              <select
                size={12}
                value={formInputs.studentID}
                onChange={(e) => {
                  setFormInputs({
                    studentID: e.target.value,
                  });
                }}
              >
                {formStudents.map((student, index) => {
                  console.log(student);
                  return (
                    <option key={index} value={student._id}>
                      {student.course +
                        " : " +
                        studentLevelText(student.level) +
                        " : " +
                        student.section +
                        " : " +
                        student.person.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ClassInfo;

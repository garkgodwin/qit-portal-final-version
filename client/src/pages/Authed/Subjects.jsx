import React, { useState, useEffect } from "react";
//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import { getAllSchoolConstants } from "../../api/general";

//? HELPERS
import {
  collegeSubjectsToArray,
  seniorSubjectsToArray,
  juniorSubjectsToArray,
  studentForThisSubject,
} from "../../helpers/formatSubjects";

//? COMPONETS
import Filter from "../../components/filter/Filter";
import Form from "../../components/form/Form";

const Subjects = () => {
  const dispatch = useDispatch();
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "",
    selected1: "1", //? 1 - College Subjects, 2 - Senior Subjects, 3 - Junior Subjects
    selected2: "0", //? 0 - all , 1 2 3 4 7 8 9 10 11 12
    selected3: "0", //? 0 - all sem, 1 - 1st sem, 2 - 2nd sem
  });
  const [selectedData, setSelectedData] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 0, // 1 - create , 2 - update
    loading: false,
  });

  const [formInputs, setFormInputs] = useState({});

  const init1 = {
    text: {
      label: "Subject name or code",
      placeholder: "subject here...",
    },
    selected1: {
      label: "Subject Type",
      options: [
        { value: 1, text: "College Subjects" },
        { value: 2, text: "Senior Subjects" },
        { value: 3, text: "Junior Subjects" },
      ],
    },
    selected2: {
      label: "Year Level",
      options: [
        { value: 0, text: "All year levels" },
        { value: 1, text: "1st year" },
        { value: 2, text: "2nd year" },
        { value: 3, text: "3rd year" },
        { value: 4, text: "4th year" },
      ],
    },
    selected3: {
      label: "Semester",
      options: [
        { value: 0, text: "All semesters" },
        { value: 1, text: "1st semester" },
        { value: 2, text: "2nd semester" },
      ],
    },
  };
  const init2 = {
    text: {
      label: "Subject name or code",
      placeholder: "subject here...",
    },
    selected1: {
      label: "Subject Type",
      options: [
        { value: 1, text: "College Subjects" },
        { value: 2, text: "Senior Subjects" },
        { value: 3, text: "Junior Subjects" },
      ],
    },
    selected2: {
      label: "Grade Level",
      options: [
        { value: 0, text: "All grade levels" },
        { value: 11, text: "Grade 11" },
        { value: 12, text: "Grade 12" },
      ],
    },
    selected3: {
      label: "Semester",
      options: [
        { value: 0, text: "All semesters" },
        { value: 1, text: "1st semester" },
        { value: 2, text: "2nd semester" },
      ],
    },
  };
  const init3 = {
    text: {
      label: "Subject name or code",
      placeholder: "subject here...",
    },
    selected1: {
      label: "Subject Type",
      options: [
        { value: 1, text: "College Subjects" },
        { value: 2, text: "Senior Subjects" },
        { value: 3, text: "Junior Subjects" },
      ],
    },
    selected2: {
      label: "Grade Level",
      options: [
        { value: 0, text: "All grade levels" },
        { value: 7, text: "Grade 7" },
        { value: 8, text: "Grade 8" },
        { value: 9, text: "Grade 9" },
        { value: 10, text: "Grade 10" },
      ],
    },
    selected3: {
      label: "Semester",
      options: [
        { value: 0, text: "All semesters" },
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
        selected2: "0",
        selected3: "0",
      });
    } else if (type === 3) {
      setFilterValues({
        ...filterValues,
        selected2: value,
      });
    } else if (type === 4) {
      setFilterValues({
        ...filterValues,
        selected3: value,
      });
    }
  };

  useEffect(() => {
    handleFilterSubjects();
  }, [filterValues]);
  useEffect(() => {
    handleFilterSubjects();
  }, [subjects]);
  useEffect(() => {
    handleFetchSubjects();
  }, []);
  const handleFetchSubjects = async () => {
    const result = await getAllSchoolConstants();
    if (result.status === 200) {
      const data = result.data;
      let subs = [];
      let collegeSubjects = collegeSubjectsToArray(data.COLLEGE_SUBJECTS);
      let seniorSubjects = seniorSubjectsToArray(data.SENIOR_SUBJECTS);
      let juniorSubjects = juniorSubjectsToArray(data.JUNIOR_SUBJECTS);
      collegeSubjects.map((sub) => {
        subs.push(sub);
      });
      seniorSubjects.map((sub) => {
        subs.push(sub);
      });
      juniorSubjects.map((sub) => {
        subs.push(sub);
      });
      setSubjects(subs);
    }
  };

  const handleFilterSubjects = () => {
    let filtered = subjects.filter((subject) => {
      return (
        subject.code
          .toLowerCase()
          .includes(filterValues.text.trim().toLocaleLowerCase()) ||
        subject.name
          .toLowerCase()
          .includes(filterValues.text.trim().toLocaleLowerCase())
      );
    });

    if (filterValues.selected1 !== "0") {
      filtered = filtered.filter((subject) => {
        return subject.student === parseInt(filterValues.selected1);
      });
    }

    if (filterValues.selected2 !== "0") {
      filtered = filtered.filter((subject) => {
        return subject.level === parseInt(filterValues.selected2);
      });
    }

    if (filterValues.selected3 !== "0") {
      filtered = filtered.filter((subject) => {
        return subject.semester === parseInt(filterValues.selected3);
      });
    }

    setFilteredSubjects(filtered);
  };
  const handleCreate = () => {
    setFormValues({
      ...formValues,
      shown: true,
      type: 1,
    });
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
          <h3>Subjects</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Students</th>
              <th>Year Level</th>
              <th>Semester</th>
              <th>Subject Type</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>{studentForThisSubject(subject.student)}</td>
                  <td>{subject.level}</td>
                  <td>{subject.semester}</td>
                  <td>{subject.type}</td>
                  <td>{subject.units}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="page-functions"></div>
    </>
  );
};

export default Subjects;

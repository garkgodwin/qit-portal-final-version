const {
  COLLEGE_SUBJECTS,
  SENIOR_SUBJECTS,
  JUNIOR_SUBJECTS,
  GRADING_SYSTEM_PER_SEM,
} = require("../constants/school");

exports.getSubjectDetails = (student, code) => {
  let detail = null;
  if (student === 1) {
    const arr = this.collegeSubjectsToArray(COLLEGE_SUBJECTS);
    arr.map((subject) => {
      if (subject.code === code) {
        detail = subject;
      }
    });
  } else if (student === 2) {
    const arr = this.seniorSubjectsToArray(SENIOR_SUBJECTS);
    arr.map((subject) => {
      if (subject.code === code) {
        detail = subject;
      }
    });
  } else if (student === 3) {
    const arr = this.juniorSubjectsToArray(JUNIOR_SUBJECTS);
    arr.map((subject) => {
      if (subject.code === code) {
        detail = subject;
      }
    });
  }

  return detail;
};
exports.collegeSubjectsToArray = (collegeSubjects) => {
  let subjects = [];
  collegeSubjects.first.map((sub) => {
    sub.level = 1;
    sub.student = 1; // college
    subjects.push(sub);
  });
  collegeSubjects.second.map((sub) => {
    sub.level = 2;
    sub.student = 1; // college
    subjects.push(sub);
  });
  collegeSubjects.third.map((sub) => {
    sub.level = 3;
    sub.student = 1; // college
    subjects.push(sub);
  });
  collegeSubjects.fourth.map((sub) => {
    sub.level = 4;
    sub.student = 1; // college
    subjects.push(sub);
  });
  return subjects;
};
exports.seniorSubjectsToArray = (seniorSubjects) => {
  let subjects = [];
  seniorSubjects.eleven.map((sub) => {
    sub.level = 11;
    sub.student = 2; //senior
    subjects.push(sub);
  });
  seniorSubjects.twelve.map((sub) => {
    sub.level = 12;
    sub.student = 2; //senior
    subjects.push(sub);
  });
  return subjects;
};
exports.juniorSubjectsToArray = (juniorSubjects) => {
  let subjects = [];
  juniorSubjects.seven.map((sub) => {
    sub.level = 7;
    sub.student = 3; // junior
    subjects.push(sub);
  });
  juniorSubjects.eight.map((sub) => {
    sub.level = 8;
    sub.student = 3; // junior
    subjects.push(sub);
  });
  juniorSubjects.nine.map((sub) => {
    sub.level = 9;
    sub.student = 3; // junior
    subjects.push(sub);
  });
  juniorSubjects.ten.map((sub) => {
    sub.level = 10;
    sub.student = 3; // junior
    subjects.push(sub);
  });
  return subjects;
};
exports.combineArrays = (array1, array2, array3) => {
  let newArr = [];
  array1.map((data) => {
    newArr.push(data);
  });
  array2.map((data) => {
    newArr.push(data);
  });
  array3.map((data) => {
    newArr.push(data);
  });
  return newArr;
};
exports.subjectName = (code, type) => {
  const cs = this.collegeSubjectsToArray(COLLEGE_SUBJECTS);
  const ss = this.seniorSubjectsToArray(SENIOR_SUBJECTS);
  const js = this.juniorSubjectsToArray(JUNIOR_SUBJECTS);
  const arr = this.combineArrays(cs, ss, js);

  let name = "No subject name";
  for (let i = 0; i < arr.length; i++) {
    if (code === arr[i].code && type === arr[i].student) {
      name = arr[i].name;
      break;
    }
  }

  return name;
};

exports.getDay = (day) => {
  if (day === 1) return "Monday";
  else if (day === 2) return "Tuesday";
  else if (day === 3) return "Wednesday";
  else if (day === 4) return "Thursday";
  else if (day === 5) return "Friday";
  else if (day === 6) return "Saturday";
  else if (day === 7) return "Sunday";
  else return "None";
};

exports.getSubjectTotalGrade = (subject) => {
  const grades = subject.grades;
  const total =
    grades.prelim * 0.2 +
    grades.mid * 0.2 +
    grades.prefi * 0.2 +
    grades.final * 0.4;
  return total;
};
exports.getTermTotalGrade = (subjects) => {
  let totalGrades = 0;
  let totalUnits = 0;
  for (let i = 0; i < subjects.length; i++) {
    let s = subjects[i];
    if (s.type === "major" || s.type === "minor") {
      const total = this.getSubjectTotalGrade(s);
      const units = s.units;
      totalGrades += total * units;
      totalUnits += units;
    }
  }
  let total = totalGrades / units;
  total = total / 100;
  return {
    total: total,
    point: getTermGradePoint(total),
  };
};

const getTermGradePoint = (total) => {
  const gwa = 0;
  const system = GRADING_SYSTEM_PER_SEM;
  for (let i = 0; i < system.length; i++) {
    const sys = system[i];
    if (sys.min <= total && sys.max >= total) {
      gwa = sys.point;
      break;
    }
  }
  return gwa;
};

export const collegeSubjectsToArray = (collegeSubjects) => {
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
export const seniorSubjectsToArray = (seniorSubjects) => {
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
export const juniorSubjectsToArray = (juniorSubjects) => {
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
export const combineArrays = (array1, array2, array3) => {
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
export const studentForThisSubject = (student) => {
  if (student === 1) {
    return "College";
  } else if (student == 2) {
    return "Senior High";
  } else if (student === 3) {
    return "Junior High";
  }
  return "None";
};

export const studentLevelText = (level) => {
  switch (level) {
    case 1:
      return "1st year";
    case 2:
      return "2nd year";
    case 3:
      return "3rd year";
    case 4:
      return "4th year";
    case 7:
      return "Grade 7";
    case 8:
      return "Grade 8";
    case 9:
      return "Grade 9";
    case 10:
      return "Grade 10";
    case 11:
      return "Grade 11";
    case 12:
      return "Grade 12";
    default:
      return "No level";
  }
};

export const semester = (sem) => {
  if (sem === 1) {
    return "1st semester";
  } else if (sem === 2) {
    return "2nd semester";
  } else {
    return "No semester";
  }
};

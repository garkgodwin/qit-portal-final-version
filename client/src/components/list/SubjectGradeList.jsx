import React from "react";
import "./List.css";

const SubjectGradeList = ({ grades }) => {
  return (
    <ul className="List">
      {GradePerTerm(1, grades.prelim)}
      {GradePerTerm(2, grades.mid)}
      {GradePerTerm(3, grades.prefi)}
      {GradePerTerm(4, grades.final)}
    </ul>
  );
};

const GradePerTerm = (term, v) => {
  return (
    <>
      <QuizGrades term={term} quizGrades={v.quiz} />
      <ActivityGrades term={term} actGrades={v.activity} />
      <PerformanceGrades term={term} perGrades={v.performance} />
      <ExamGrades term={term} exGrade={v.exam} />
    </>
  );
};

const QuizGrades = ({ term, quizGrades }) => {
  let i = 0;
  return quizGrades.map((g) => {
    i++;
    return <Grade key={i} term={term} type={1} grade={g} />;
  });
};
const ActivityGrades = ({ term, actGrades }) => {
  let i = 0;
  return actGrades.map((g) => {
    i++;
    return <Grade key={i} term={term} type={2} grade={g} />;
  });
};
const PerformanceGrades = ({ term, perGrades }) => {
  let i = 0;
  return perGrades.map((g) => {
    i++;
    return <Grade key={i} term={term} type={3} grade={g} />;
  });
};
const ExamGrades = ({ term, exGrade }) => {
  if (
    exGrade === null ||
    exGrade === undefined ||
    (Object.keys(exGrade).length === 0 && exGrade.constructor === Object)
  ) {
    return null;
  } else {
    return <Grade term={term} type={4} grade={exGrade} />;
  }
};

const Grade = ({ term, type, grade }) => {
  console.log(grade);
  return (
    <li className="subject-grade">
      {getTerm(term) +
        " >> " +
        getType(type) +
        " : " +
        grade.achieved +
        "/" +
        grade.total}
    </li>
  );
};

const getTerm = (term) => {
  if (term === 1) return "Prelim term";
  else if (term === 2) return "Middle term";
  else if (term === 3) return "Prefinal term";
  else if (term === 4) return "Final term";
  else return "No term";
};
const getType = (type) => {
  if (type === 1) {
    return "Quiz";
  } else if (type === 2) {
    return "Activity";
  } else if (type === 3) return "Performance";
  else if (type === 4) return "Exam";
  else return "No type";
};

export default SubjectGradeList;

export const getRoleText = (roleNum) => {
  if (roleNum === 1) {
    return "Administrator";
  } else if (roleNum === 2) {
    return "Registrar";
  } else if (roleNum === 3) {
    return "Instructor";
  } else if (roleNum === 4) {
    return "Student";
  } else if (roleNum === 5) {
    return "Guardian";
  } else {
    return "No role";
  }
};

export const getSemester = (sem) => {
  if (sem === 1) {
    return "1st semester";
  } else if (sem === 2) {
    return "2nd semester";
  } else {
    return "";
  }
};

const linksGeneral = [
  {
    to: "/",
    text: "Dashboard",
    access: [1, 2, 3, 4, 5],
  },
  {
    to: "/accounts",
    text: "Accounts",
    access: [1],
  },
  {
    to: "/staffs",
    text: "Staffs",
    access: [1],
  },
  {
    to: "/students",
    text: "Students",
    access: [1, 2],
  },
];

const linksSchool = [
  {
    to: "/school-info",
    text: "School Info",
    access: [1],
  },
  {
    to: "/subjects",
    text: "Subjects",
    access: [1, 2, 3, 4, 5],
  },
  {
    to: "/classes",
    text: "Classes",
    access: [1, 2, 3, 4, 5],
  },
  {
    to: "/schedules",
    text: "Schedules",
    access: [1, 2, 3, 4, 5],
  },
];

module.exports = {
  general: linksGeneral,
  school: linksSchool,
};

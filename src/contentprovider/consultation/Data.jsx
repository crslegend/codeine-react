import { pink, purple, teal } from "@material-ui/core/colors";

export const appointments = [
  {
    id: 0,
    title: "Website Re-Design Plan",
    startDate: new Date(2021, 1, 20, 9, 30),
    endDate: new Date(2021, 1, 20, 11, 30),
    member: 3,
    courseId: 1,
  },
  {
    id: 1,
    title: "Book Flights to San Fran for Sales Trip",
    startDate: new Date(2021, 1, 23, 12, 0),
    endDate: new Date(2021, 1, 23, 13, 0),
    member: 1,
    meeting_link: "fff",
    courseId: 2,
  },
];

export const resourcesData = [
  {
    text: "React 101",
    id: 1,
    color: teal,
  },
  {
    text: "React with React hooks",
    id: 2,
    color: pink,
  },
  {
    text: "React with Django",
    id: 3,
    color: purple,
  },
  { text: "No preference" },
];

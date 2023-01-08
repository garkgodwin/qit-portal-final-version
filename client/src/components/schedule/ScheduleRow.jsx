import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { timeInRange } from "../../helpers/formatTime";

const ScheduleRow = ({ schedules, triggerUpdate, time, handleNewSchedule }) => {
  const [mondays, setMondays] = useState([]);
  const [tuesdays, setTuesdays] = useState([]);
  const [wednesdays, setWednesdays] = useState([]);
  const [thursdays, setThursdays] = useState([]);
  const [fridays, setFridays] = useState([]);
  const [saturdays, setSaturdays] = useState([]);
  const [sundays, setSundays] = useState([]);

  useEffect(() => {
    setMondays([]);
    setTuesdays([]);
    setWednesdays([]);
    setThursdays([]);
    setFridays([]);
    setSaturdays([]);
    setSundays([]);
    for (let i = 0; i < schedules.length; i++) {
      const day = schedules[i].day;
      const timeStart = schedules[i].timeStart;
      const timeEnd = schedules[i].timeEnd;
      if (timeInRange(time, timeStart, timeEnd)) {
        console.log("IN TIME");
        if (day === 1) {
          setMondays(...mondays, [schedules[i]]);
        } else if (day === 2) {
          setTuesdays(...tuesdays, [schedules[i]]);
        } else if (day === 3) {
          setWednesdays(...wednesdays, [schedules[i]]);
        } else if (day === 4) {
          setThursdays(...thursdays, [schedules[i]]);
        } else if (day === 5) {
          setFridays(...fridays, [schedules[i]]);
        } else if (day === 6) {
          setSaturdays(...saturdays, [schedules[i]]);
        } else if (day === 7) {
          setSundays(...sundays, [schedules[i]]);
        }
      }
    }
  }, [schedules]);
  return (
    <div className={"sched-row"}>
      {mondays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {mondays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}
      {tuesdays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {tuesdays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}

      {wednesdays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {wednesdays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}

      {thursdays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {thursdays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}

      {fridays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {fridays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}

      {saturdays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {saturdays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}

      {sundays.length === 0 ? (
        <div className="sched-cell sched-cell-no-value">
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="sched-cell sched-cell-with-value">
          {sundays.map((sched, index) => {
            return (
              <div key={index} className="sched-sub-cell">
                <p> Room: {sched.room}</p>
                <p>Subject : {sched.class.subjectCode}</p>
                <p>{sched.class.instructor.person.name}</p>
              </div>
            );
          })}
          <button
            className="sched-cell-function"
            onClick={(e) => {
              e.preventDefault();
              handleNewSchedule();
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleRow;

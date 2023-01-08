import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { timeInRange } from "../../helpers/formatTime";
import { getSchedulePerDayAndTime } from "../../api/schedules";

const ScheduleRow = ({ triggerUpdate, time, handleNewSchedule }) => {
  const [mondays, setMondays] = useState([]);
  const [tuesdays, setTuesdays] = useState([]);
  const [wednesdays, setWednesdays] = useState([]);
  const [thursdays, setThursdays] = useState([]);
  const [fridays, setFridays] = useState([]);
  const [saturdays, setSaturdays] = useState([]);
  const [sundays, setSundays] = useState([]);
  useEffect(() => {
    runFetch();
  }, []);

  useEffect(() => {
    if (triggerUpdate) {
      runFetch();
    }
  }, [triggerUpdate]);

  const runFetch = () => {
    fetchSchedules(1, time);
    fetchSchedules(2, time);
    fetchSchedules(3, time);
    fetchSchedules(4, time);
    fetchSchedules(5, time);
    fetchSchedules(6, time);
    fetchSchedules(7, time);
  };

  const fetchSchedules = async (day, time) => {
    const result = await getSchedulePerDayAndTime(day, time);
    if (result.status === 200) {
      if (day === 1) {
        setMondays(result.data);
      } else if (day === 2) {
        setTuesdays(result.data);
      } else if (day === 3) {
        setWednesdays(result.data);
      } else if (day === 4) {
        setThursdays(result.data);
      } else if (day === 5) {
        setFridays(result.data);
      } else if (day === 6) {
        setSaturdays(result.data);
      } else if (day === 7) {
        setSundays(result.data);
      } else {
        return;
      }
    }
  };
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

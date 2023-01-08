import React, { useState, useEffect } from "react";

//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

//? API
import { getSchedules, createSchedule } from "../../api/schedules";
import { getAllSchoolConstants } from "../../api/general";
import { getClasses } from "../../api/classes";

//? CONSTANTS
import { TIMES } from "../../constants";

//? COMPONENTS
import Form from "../../components/form/Form";
import Filter from "../../components/filter/Filter";
import ScheduleRow from "../../components/schedule/ScheduleRow";

const Schedules = () => {
  const dispatch = useDispatch();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [filterValues, setFilterValues] = useState({
    text: "", // subject code / class
  });
  const [selectedData, setSelectedData] = useState(null);
  const [formValues, setFormValues] = useState({
    shown: false,
    type: 0, // 1 - create , 2 - update
    loading: false,
  });
  const [formRooms, setFormRooms] = useState([]);
  const [formClasses, setFormClasses] = useState([]);
  const [inputs, setInputs] = useState({
    classID: "",
    day: 1,
    timeStart: 6,
    timeEnd: 6,
    room: "",
  });

  const init = {
    text: {
      label: "Subject",
      placeholder: "subject here...",
    },
  };

  useEffect(() => {
    fetchSchoolConstants();
    handleGetClasses();
    getAllSchedules();
  }, []);

  const fetchSchoolConstants = async () => {
    const result = await getAllSchoolConstants();
    console.log(result);
    if (result.status === 200) {
      const data = result.data;
      const rs = data.ROOMS;
      setFormRooms(rs);
    }
  };

  const getAllSchedules = async () => {
    const result = await getSchedules();
    if (result.status === 200) {
      setSchedules(result.data);
    }
  };
  const handleGetClasses = async () => {
    const result = await getClasses();
    if (result.status === 200) {
      setFormClasses(result.data);
      if (result.data.length !== 0) {
        setInputs({
          ...inputs,
          classID: result.data[0]._id,
        });
      }
    } else {
      setFormClasses([]);
    }
  };

  const handleNewSchedule = (time, day) => {
    setSelectedData(null);
    setFormValues({
      ...formValues,
      shown: true,
      type: 1,
      day: day,
      time: time,
    });
  };
  const handleCancel = () => {
    setFormValues({
      shown: false,
      type: 1,
      day: 0,
      time: "",
    });
  };
  const handleSubmit = async () => {
    console.log(inputs);
    setFormValues({
      ...formValues,
      loading: true,
    });
    if (selectedData === null) {
      const result = await createSchedule(inputs);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        setSchedules([...schedules, result.data]);
        setFormValues({
          ...formValues,
          loading: false,
          shown: false,
        });
      }
    }
    setFormValues({
      ...formValues,
      loading: false,
    });
  };

  return (
    <>
      <div className="page-header"></div>
      <div className="page-body">
        <div className="page-schedules">
          <div className="sched-row sched-row-titles">
            <h3 className="sched-title sched-title-time">Time</h3>
            <h3 className="sched-title">Monday</h3>
            <h3 className="sched-title">Tuesday</h3>
            <h3 className="sched-title">Wednesday</h3>
            <h3 className="sched-title">Thursday</h3>
            <h3 className="sched-title">Friday</h3>
            <h3 className="sched-title">Saturday</h3>
            <h3 className="sched-title">Sunday</h3>
          </div>
          <div className="sched-body">
            <div className="sched-col">
              {TIMES.map((time, index) => {
                return (
                  <div key={index} className="sched-cell sched-cell-time">
                    {time}
                  </div>
                );
              })}
            </div>
            <div className="sched-content">
              {TIMES.map((time, index) => {
                return (
                  <ScheduleRow
                    schedules={schedules}
                    key={index}
                    time={time}
                    handleNewSchedule={handleNewSchedule}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Form
        shown={formValues.shown}
        loading={formValues.loading}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      >
        <div className="form-body">
          <h4 className="form-title">
            {formValues.type === 1
              ? "Schedule creation form"
              : formValues.type === 2
              ? "Schedule update form"
              : "Schedule form"}
          </h4>
          <div className="form-fields">
            <div className="form-field form-field-100">
              <label>Classes</label>
              <select
                size={2}
                value={inputs.classID}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    classID: e.target.value,
                  });
                }}
              >
                {formClasses.map((cls) => {
                  return (
                    <option key={cls._id} value={cls._id}>
                      {cls.subjectCode}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-field">
              <label>Rooms</label>
              <select
                size={7}
                value={inputs.room}
                onChange={(e) => {
                  console.log("ROOM", e.target.value);
                  setInputs({
                    ...inputs,
                    room: e.target.value,
                  });
                }}
              >
                <option value={""}>None</option>
                {formRooms.map((room) => {
                  return (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-field">
              <label>Day</label>
              <select
                size={7}
                value={inputs.day}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  console.log(val);
                  setInputs({
                    ...inputs,
                    day: val,
                  });
                }}
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={7}>Sunday</option>
              </select>
            </div>
          </div>
          <div className="form-fields">
            <div className="form-field">
              <label>Start time (24h format)</label>
              <input
                type="number"
                min={6}
                max={20}
                value={inputs.timeStart}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    timeStart: parseInt(e.target.value),
                  });
                }}
              />
            </div>
            <div className="form-field">
              <label>End time (24h format)</label>
              <input
                type="number"
                min={6}
                max={20}
                value={inputs.timeEnd}
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    timeEnd: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Schedules;

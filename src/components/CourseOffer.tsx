import { Fragment, useEffect, useState } from "react";
import AutoCompleteText from "./AutoCompleteText";
import {
  assignOffer,
  clearOffers,
  getOffers,
  getCurriculum,
  getFaculties,
  switchSemester,
  getAreas,
} from "../redux/semester/semesterSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Faculty, ISemester, Offer, SelectedCell } from "./types";

const DEBUG = false;

export const CourseOffer = function () {
  const { faculty, curriculum, semester, areas, offers } = useSelector(
    (state: RootState) => state.semester
  );
  const dispatch = useDispatch<AppDispatch>();

  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    column: -1,
    section: "",
    semester: 0,
  });

  useEffect(() => {
    dispatch(getCurriculum());
    dispatch(getFaculties(semester));
    dispatch(getOffers());
    dispatch(getAreas());
  }, [dispatch, semester]);

  const sems: ISemester[] = [
    { sno: 1, name: "1st" },
    { sno: 2, name: "2nd" },
    { sno: 3, name: "3rd" },
    { sno: 4, name: "4th" },
    { sno: 5, name: "5th" },
    { sno: 6, name: "6th" },
    { sno: 7, name: "7th" },
    { sno: 8, name: "8th" },
  ];

  const secs = [7, 7, 6, 6].map((s) =>
    [...Array(s).keys()].map((i) => String.fromCharCode(i + 1 + 64))
  );

  const toShowSemester = (semesterId: number) =>
    !!(semesterId % 2) === (semester === "Spring");

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th colSpan={9} style={{ fontWeight: "bold", fontSize: "16pt" }}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(switchSemester());
                  setSelectedCell({
                    column: -1,
                    section: "",
                    semester: 0,
                  });
                }}
                href="#"
                style={{ textDecoration: "none", color: "blue" }}
              >
                {semester} Semester
              </a>
            </th>
          </tr>
          <tr>
            <th style={{ width: "50px" }}>SNo.</th>
            <th style={{ width: "450px" }}>Title</th>
            <td colSpan={7} style={{ width: "25px", textAlign: "right" }}>
              <a
                onClick={async (e) => {
                  e.preventDefault();
                  await dispatch(clearOffers());
                  await dispatch(getOffers());
                }}
                href="#"
                style={{ textDecoration: "none", color: "blue" }}
              >
                Clear All
              </a>
            </td>
          </tr>
          {sems
            .filter((_, idx) => toShowSemester(idx))
            .map((s: ISemester, scnt: number) => (
              <Fragment key={s.sno}>
                <tr style={{ fontWeight: "bold" }}>
                  <th colSpan={2}>{s.name} Semester</th>
                  {secs[scnt].map((sec) => {
                    return (
                      <th key={sec} style={{ width: "200px" }}>
                        {sec}
                      </th>
                    );
                  })}
                </tr>
                {curriculum
                  .filter((course) => course.semno === s.sno)
                  .map((course, idx) => {
                    return (
                      <tr key={course.cid} style={{ height: "25px" }}>
                        <td style={{ textAlign: "center" }}>{idx + 1}</td>
                        <td>{course.title}</td>
                        {secs[scnt].map((sec, i) => {
                          const courseAreas = areas
                            .filter((a) => a.cid === course.cid)
                            .map((a) => a.fid);

                          const offeredTeachers = offers.find(
                            (o) =>
                              o.cid === course.cid &&
                              o.semno === s.sno &&
                              o.sec === sec
                          );

                          const teacherName = faculty.find(
                            (f) => f.fid === offeredTeachers?.fid
                          )?.TeacherName;

                          const isCellSelected =
                            selectedCell.column === course.cid &&
                            selectedCell.section === sec &&
                            selectedCell.semester === s.sno;

                          return (
                            <td
                              key={i}
                              onClick={() => {
                                if (teacherName) return;

                                setSelectedCell({
                                  column: course.cid,
                                  section: sec,
                                  semester: s.sno,
                                });
                              }}
                            >
                              {isCellSelected ? (
                                <AutoCompleteText
                                  items={faculty
                                    .filter((f) => courseAreas.includes(f.fid))
                                    .filter(
                                      (f) =>
                                        (f.fulltime && (f?.alot || 0) < 4) ||
                                        (!f.fulltime && (f?.alot || 0) < 2)
                                    )}
                                  setFaculty={async (faculty: Faculty) => {
                                    const o: Offer = {
                                      cid: course.cid,
                                      fid: faculty.fid,
                                      sec: sec,
                                      semester,
                                      semno: s.sno,
                                    };

                                    if (faculty) {
                                      const response = await dispatch(
                                        assignOffer(o)
                                      );

                                      await dispatch(getOffers());
                                      await dispatch(getFaculties(semester));

                                      if (DEBUG)
                                        console.log(
                                          `Offer Assigned?`,
                                          response.meta.requestStatus ===
                                            "fulfilled"
                                        );
                                    }

                                    setSelectedCell({
                                      column: -1,
                                      section: "",
                                      semester: 0,
                                    });
                                  }}
                                />
                              ) : (
                                teacherName
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

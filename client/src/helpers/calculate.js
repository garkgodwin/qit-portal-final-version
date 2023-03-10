exports.calculateTermGrade = (tg) => {
  if (tg) {
    //? INITIAL
    const q = tg.quiz;
    const a = tg.activity;
    const p = tg.performance;
    const e = tg.exam;
    //? TOTALS
    let tq = 0;
    let ta = 0;
    let tp = 0;
    let te = 0;
    if (q.length === 0) tq = 0;
    else {
      for (let i = 0; i < q.length; i++) {
        tq += q[i].achieved / q[i].total;
      }
      tq = (tq / q.length) * 100;
    }
    if (a.length === 0) ta = 0;
    else {
      for (let i = 0; i < a.length; i++) {
        ta += a[i].achieved / a[i].total;
      }
      ta = (ta / a.length) * 100;
    }
    if (p.length === 0) tp = 0;
    else {
      for (let i = 0; i < p.length; i++) {
        tp += p[i].achieved / p[i].total;
      }
      tp = (tp / p.length) * 100;
    }

    if (
      e === null ||
      e === undefined ||
      (Object.keys(e).length === 0 && e.constructor === Object)
    ) {
      te = 0;
    } else {
      te = (e.achieved / e.total) * 100;
    }
    const total = Math.round(tq * 0.2 + ta * 0.2 + tp * 0.1 + te * 0.5).toFixed(
      2
    );
    return total;
  } else {
    return 0;
  }
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

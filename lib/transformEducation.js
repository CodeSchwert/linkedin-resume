const fmtDate = require('./fmtDate');

const transformEducation = (e) => {
  return {
    institution: e['School Name'],
    area: e['Degree Name'],
    studyType: '',
    startDate: fmtDate(e['Start Date']),
    endDate: fmtDate(e['End Date']),
    gpa: '',
    courses: [],
  };
};

module.exports = transformEducation;

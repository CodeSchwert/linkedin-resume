const fmtDate = require('./fmtDate');

const fmtWorkSummary = (summary) => {
  return summary.replace(/\s\s/g, '\n');
};

const transformWorkPosition = (p) => {
  return {
    company: p['Company Name'],
    position: p.Title,
    website: '',
    startDate: fmtDate(p['Started On']),
    endDate: fmtDate(p['Finished On']),
    summary: fmtWorkSummary(p.Description),
    highlights: [],
  };
};

module.exports = transformWorkPosition;

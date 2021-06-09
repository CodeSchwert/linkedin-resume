const fmtDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  return new Date(dateString).toISOString().split('T')[0];
};

module.exports = fmtDate;

const fmtDate = require('./fmtDate');

const transformCerts = (c) => {
  return {
    name: c.Name,
    date: fmtDate(c['Finished On']),
    url: c.Url,
    issuer: c.Authority
  };
};

module.exports = transformCerts;

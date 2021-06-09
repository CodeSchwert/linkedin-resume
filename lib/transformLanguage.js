const transformLanguage = (l) => {
  return {
    language: l.Name,
    fluency: l.Proficiency,
  };
};

module.exports = transformLanguage;

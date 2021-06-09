const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const transformCerts = require('./transformCerts');
const transformEducation = require('./transformEducation');
const transformLanguage = require('./transformLanguage');
const transformSkills = require('./transformSkills');
const transformWorkPosition = require('./transformWorkPosition');

const dataObject = {};

const validDataFiles = [
  'Certifications',
  'Courses',
  'Education',
  'Email Addresses',
  'Languages',
  'Positions',
  'Profile',
  'Skills',
];

const parseDataFiles = (dataFolder) => {
  console.log(`Processing ${dataFolder}`);

  const dataFolderPath = path.join(__dirname, '..', 'DataExport', dataFolder);
  // console.log(dataFolderPath);

  // filter out unwanted CSV files
  const dataFiles = fs.readdirSync(dataFolderPath).filter((file) => {
    const [filename] = file.split('.csv');
    return validDataFiles.includes(filename);
  });

  console.log(dataFiles);

  dataFiles.map((dataFile) => {
    const dataFilePath = path.join(dataFolderPath, dataFile);
    console.log(dataFilePath);

    const csvString = fs.readFileSync(dataFilePath, { encoding: 'utf8' });

    Papa.parse(csvString, {
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      complete: (results) => {
        const [objectKey] = dataFile.split('.csv');
        if (objectKey === 'Profile' && results.data.length > 0) {
          dataObject[objectKey] = results.data[0];
        } else {
          dataObject[objectKey] = results.data;
        }
      },
    });
  });

  // console.log(dataObject);

  /**
   * Convert data object format to JSON resume format
   */
  const {
    Certifications,
    Courses,
    Education,
    Languages,
    Positions,
    Profile,
    Skills,
  } = dataObject;
  const EmailAddresses = dataObject['Email Addresses'];

  const jsonResume = {
    basics: {
      name: `${Profile['First Name']} ${Profile['Last Name']}`,
      label: Profile.Headline,
      picture: '',
      email: EmailAddresses.find((email) => email.Primary == 'Yes')[
        'Email Address'
      ],
      phone: '',
      webite: '',
      summary: Profile.Summary,
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: '',
      },
      profiles: [],
    },
    work: Positions.map(transformWorkPosition),
    volunteer: [],
    education: Education.map(transformEducation),
    awards: [],
    certificates: Certifications.map(transformCerts),
    publications: [],
    skills: Skills.map(transformSkills),
    languages: Languages.map(transformLanguage),
    interests: [],
    references: [],
  };

  console.log(jsonResume);

  /**
   * Output results to JSON files
   */
  const outputDir = path.join(dataFolderPath, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(
    path.join(outputDir, 'data.json'),
    JSON.stringify(dataObject, null, 2),
    {
      encoding: 'utf8',
    }
  );

  fs.writeFileSync(
    path.join(outputDir, 'resume.json'),
    JSON.stringify(jsonResume, null, 2),
    {
      encoding: 'utf8',
    }
  );

  return jsonResume;
};

module.exports = parseDataFiles;

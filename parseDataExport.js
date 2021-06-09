const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const resumeSchema = require('resume-schema');
const parseDataFiles = require('./lib/parseDataFiles');

const VALIDATE = false;

const dataExportPath = path.join(__dirname, 'DataExport');

const unzippedFolders = [];

// find all the data export zip files in the DataExport directory
const zipFiles = fs
  .readdirSync(dataExportPath)
  .filter(
    (item) => item.includes('LinkedInDataExport') && item.endsWith('.zip')
  );

// unzip all the data export zip archives into the DataExport directory
zipFiles.map((zipFile) => {
  const outputDir = zipFile.split('.zip')[0];
  fs.createReadStream(zipFile).pipe(
    unzipper.Extract({ path: `DataExport/${outputDir}` })
  );
  unzippedFolders.push(outputDir);
});

// console.log(unzippedFolders);

// iterate over unpacked folders
unzippedFolders.map((exportFolder) => {
  const resumeObject = parseDataFiles(exportFolder);

  if (VALIDATE) {
    resumeSchema.validate(
      resumeObject,
      (err, report) => {
        if (err) {
          console.error('The resume was invalid:', err);
          return;
        }
        console.log('Resume validated successfully:', report);
      },
      (err) => {
        console.error('The resume was invalid:', err);
      }
    );
  }

  console.log('exportFolder', exportFolder);
  // console.log(resumeObject);

  /**
   * Merge overrides here!
   */

  /**
   * Output files!
   */
  fs.writeFileSync(
    `${exportFolder}_resume.json`,
    JSON.stringify(resumeObject, null, 2),
    { encoding: 'utf8' }
  );
});

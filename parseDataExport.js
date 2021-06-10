const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const resumeSchema = require('resume-schema');
const { program } = require('commander');
const version = require('./package.json').version;
const parseDataFiles = require('./lib/parseDataFiles');

program
  .version(version)
  .option(
    '-v, --validate',
    'optionally validate output resume.json schema',
    false
  );

program.parse(process.argv);

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

// iterate over unpacked folders
unzippedFolders.map((exportFolder) => {
  const resumeObject = parseDataFiles(exportFolder);

  if (program.opts().validate) {
    console.info('Validate Schema');
    resumeSchema.validate(
      resumeObject,
      (err, report) => {
        if (err) {
          console.error('The resume was invalid:', err);
          return;
        }
        console.info('Resume validated successfully:', report);
      },
      (err) => {
        console.error('The resume was invalid:', err);
      }
    );
  }

  /**
   * Merge overrides here!
   */
  if (fs.existsSync('./overrides/override.json')) {
    console.info('Merging override.json');
    const overrides = require('./overrides/override.json');

    _.merge(resumeObject, overrides);
  }

  /**
   * Output files!
   */
  fs.writeFileSync(
    `${exportFolder}_resume.json`,
    JSON.stringify(resumeObject, null, 2),
    { encoding: 'utf8' }
  );
});

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const parseDataFiles = require('./lib/parseDataFiles');

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
  fs.createReadStream(zipFile).pipe(unzipper.Extract({ path: `DataExport/${outputDir}` }));
  unzippedFolders.push(outputDir);
});

console.log(unzippedFolders);

// iterate over unpacked folders
unzippedFolders.map(exportFolder => parseDataFiles(exportFolder));

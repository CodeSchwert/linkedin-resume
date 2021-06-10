const fs = require('fs');
const { red } = require('chalk');
const resumeSchema = require('resume-schema');
const { program } = require('commander');
const version = require('./package.json').version;

const action = (source) => {
  if (!fs.existsSync(source)) {
    console.error(red(`\nCould not find ${source} file\n`));
    return;
  }

  const resumeObject = require(source);

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
};

program.version(version).command('resume <source>').action(action);

program.parse(process.argv);

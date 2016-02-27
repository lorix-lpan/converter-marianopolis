import fs from 'fs';

const content = JSON.parse(fs.readFileSync('./data/all_programs.json'));
let passed = true;

content.forEach( (file) => {

  // only course that does not have a teacher
  if (file.teacher === "" && file.name !== 'COMP. III + SMALL ENS. (DDEC)') {
    passed = false;
    console.log(file);
    console.log('does not have a teacher');
  }
  if (file.name === "") {
    passed = false;
    console.log(file);
    console.log('does not have a name');
  }
});

if (passed) console.log('All tests passed');

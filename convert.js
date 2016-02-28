import fs from 'fs';
import path from 'path';
import _ from 'underscore';
import PDFParser from './node_modules/pdf2json/pdfparser';

const pdfParser = new PDFParser();
let pdfData = [];

function removeDuplicated (courses) {

  for (let i = courses.length-1; i > 0; i--) {

    for (let j = i-1; j >= 0; j--) {

      if (courses[i].name === courses[j].name) {

        if (courses[i].code === courses[j].code) {

          if (courses[i].section === courses[j].section) {
            courses.splice(j, 1);
          }
        }
      }
    }
  }
}




function _onPFBinDataReady (evtData) {

  function chomp (raw_text) {
    return raw_text.replace(/(\n|\u0000)+$/, '');
  };

  let data = [];
  const regexes = [
    /^SECTION/,
    /^COURSE/,
    /^DAY/,
    /^ROOM/,
    /^SCHEDULE/,
    /^MARIANOPOLIS%20COLLEGE/i,
    /^[0-9]{1,2}$/,
    /^Complementary/,
    /^Physical/,
    /^Humanities/,
    /^French$/,
    /^English$/,
    /[A-Z]{3}\s-\s/, // matching liberal arts and alc shit
    /^[0-9]+\./ // match program name
  ];

  let count = -1; // for the foreach loop
  let course = -1;
  let overflow = false;
  let track = []; // to prevent duplication using page numbers

  evtData.data.Pages.forEach( (page, i) => {

    let sorted = page.Texts.sort( (a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      } else {
        return a.y - b.y;
      }
    });
    let pageNum = sorted[sorted.length-1].R[0].T;
    for (let j = 0; j < track.length; j ++) {
      if (pageNum == track[j])
        return;
    }
    track.push(pageNum);
    sorted.
      // Find items with certain expression and replace them with
      // blank space
      map( (file) => {
        var isValid = true;
        regexes.forEach(function (regex) {
          if (file.R[0].T.match(regex))
            isValid = false;
        });
        if (isValid) {
          return chomp(decodeURIComponent(file.R[0].T));
        }
      }).
      // Delete blank space by the previous map function
      filter( (item) => {
        return item !== undefined && item !== '';
      }).
      // Convert array to a list of js objects
      forEach( (file) => {
        if (file.match(/^[0-9]{5}$/)) {
          count ++;
          course = -1;
          data.push({});
          data[count].section = file;
          data[count].meeting = [];
          data[count].name = '';
          data[count].teacher = '';
        } else if (file.match(/^.{3}-.{3}/)) {
          if (file.match(/[0-9]{5}/)) {
            count ++;
            course = -1;
            data.push({});
            data[count].section = file.match(/[0-9]{5}/)[0];
            data[count].code = file.match(/^.{3}-.{3}/)[0];
            data[count].meeting = [];
            data[count].name = '';
            data[count].teacher = '';
          } else {
            data[count].code = file;
          }
        } else if (file.match(/^(M|T|W|H|F|S){1,3}$/)) {
          course ++;
          data[count].meeting.push({});
          data[count].meeting[course].day = file;
        } else if (file.match(/^[0-9]{2}\:[0-9]{2}-/)) {
          data[count].meeting[course].time = file.split('-');
        } else if (file.match(/^([A-Z]-\d{3}|\d{3}|AUD|GYM)$/)) {
          data[count].meeting[course].room = file;
        } else if (file.match(/^[^,;]+,\ [^,;]+/) || overflow) {
          if (file.match(/;/)) {
            data[count].teacher += file.toString();
            if (file.toString()[file.toString().length-1] === ' ') {
              overflow = true;
            }
          } else if (file.match(/TRUTH/)) {
            data[count].name += file;
          } else {
            if (overflow) {
              overflow = false;
            }
            data[count].teacher += file.toString();
          }
        } else {
          data[count].name += file;
        }
      });
  });

  pdfData = data;
  removeDuplicated(pdfData);
  fs.writeFile(jsonName, JSON.stringify(pdfData, null, 2), 'utf8');
};

function _onPFBinDataError (evtError) {
  console.log('error');
};

pdfParser.on('pdfParser_dataReady', _.bind(_onPFBinDataReady, this));

pdfParser.on('pdfParser_dataError', _.bind(_onPFBinDataError, this));

// Start of the program
// input filename as a commandline argument
const pdfFilePath = process.argv[2];
const fileName = pdfFilePath.match(/[a-zA-Z\-\_]+\.(pdf|PDF)/)[0];

const jsonName = path.join(__dirname, 'data', fileName.match(/^[a-zA-Z\_]+/)[0] + '.json');

pdfParser.loadPDF(pdfFilePath);

// or call directly with buffer
fs.readFile(pdfFilePath, function (err, pdfBuffer) {
  if (!err)
    pdfParser.parseBuffer(pdfBuffer);
});

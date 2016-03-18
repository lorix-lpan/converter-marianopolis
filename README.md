# Course Offering PDF converter

Convert Marianopolis Course Offering document from PDF to JSON

### Usage

```bash
git clone https://github.com/lorix-lpan/converter-marianopolis
cd converter-marianopolis
npm install
# convert pdf from ./test/test_files/all_programs.pdf
# to ./data/all_programs.json
npm start
# Test the converted json file
npm test
```


### Example Data Format
```javascript
[
  {
    "section": "00001",
    "meeting": [
      {
        "day": "M",
        "time": "14:15-16:15",
        "room": "G-202"
      },
      {
        "day": "TH",
        "time": "14:15-15:45",
        "room": "A-315"
      }
    ],
    "name": "GENERAL BIOLOGY II",
    "teacher": "Di Flumeri, Celestino",
    "code": "101-LCU-05"
  }
]

### License
MIT

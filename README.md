# Course Offering PDF converter

Convert Marianopolis Course Offering document from PDF to JSON

### Usage

* $ git clone https://github.com/lorix-lpan/converter-marianopolis
* $ cd converter-marianopolis
* $ npm install
* $ node convert.js path/to/your/file

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

new Vue({
  el: "#app",
  data: {
    newNote: {
      date:"",
      summary: "",
      content: "",
    },
    noteSelected: {
      date:"",
      summary: "",
      content: "",
    },
    notes: JSON.parse(localStorage.getItem('notes')) ||[],
    weather: {},
    src: "",
  },
  watch:{
    handler:'saveNotes',
    deep:true

  },
  mounted() {
    this.getInfos();
  },
  methods: {
    getInfos() {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1FA885D3-EDED-4045-B0A2-0766AA000973&format=JSON&locationName=%E8%87%BA%E4%B8%AD%E5%B8%82"
      );
      xhr.responseType = "json";
      xhr.onload = () => {
        var res = xhr.response.records.location[0];
        var weatherDate = {
          locationName: res.locationName,
          startTime: res.weatherElement[0].time[0].startTime.split(" ")[0],
          endTime: res.weatherElement[0].time[0].endTime,
          highestTemperature:
            res.weatherElement[4].time[0].parameter.parameterName + "℃",
          lowestTemperature:
            res.weatherElement[2].time[0].parameter.parameterName + "℃",
          rain: res.weatherElement[1].time[0].parameter.parameterName + "%",
          weatherStatus: res.weatherElement[0].time[0].parameter.parameterName,
          weatherIndex: res.weatherElement[0].time[0].parameter.parameterValue,
        };
        this.weather = weatherDate;
        this.changeImg();
      };
      xhr.send();
    },
    changeImg() {
      //wInd天氣狀態index
      var wInd = parseInt(this.weather.weatherIndex);
      // console.log("wInd天氣狀態index",wInd)
      switch (wInd) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
          this.src = "img/sunIMG.svg";  
          break;
        case 7:
        case 8:
        case 9:
        case 10:
          this.src = "img/cloudIMG.svg";
          break;
        case 42:
          this.src = "img/snowIMG.svg";
          break;
        default:
          this.src = "img/rainIMG.svg";
          break;
      }
    },
    addNote() {
      //檢查有無輸入內容
      if (
        this.newNote.summary.length == 0 ||
        this.newNote.content.length == 0 ||
        this.newNote.date.length == 0 
      ) {
        alert("資料請填寫完整");
        return;
      }
      //顯示新增=>使用{{}}綁定
      //存入陣列
      const note = {
        summary: this.newNote.summary,
        content: this.newNote.content,
        date: this.newNote.date
      };
      this.notes.push(note);
      console.log(this.notes);
      //清除input框框
      this.newNote.summary = "";
      this.newNote.content = "";
      this.newNote.date = "";
    },
    //跳出modal確認是否刪除=>selectNote
    selectNote(note) {
     
      this.noteSelected.summary = note.summary;
      this.noteSelected.content = note.content;
    },
    //找出index 後splice
    deleteNote() {
      var found = false;
      for (var i = 0; i < this.notes.length; i++) {
        if (this.notes[i].summary == this.noteSelected.summary) {
          found = true;
          break;
        }
      }
      if (found) {
        this.notes.splice(i, 1);
      }
      // 隱藏式窗
      $("#deleteModal").modal("hide");
    },
    saveNotes(){
      localStorage.setItem('notes',JSON.stringify(this.notes));
    }
  },
});

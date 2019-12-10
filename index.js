// 今后考虑用 deep copy 优化
function getArchiveData() {
  return jsyaml.load(archiveYaml).archives;
}

function getVisibleMap() {
  var visibleMap = {};
  getArchiveData().forEach(archive => visibleMap[archive.date] = false);
  return visibleMap;
}

function getTodayDate() {
  // 获取当前日期
  var nowDate = new Date();

  var nowMonth = nowDate.getMonth() + 1;
  var nowDay = nowDate.getDate();

  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }
  if (nowDay >= 0 && nowDay <= 9) {
    nowDay = "0" + nowDay;
  }

  // yyyyMMdd
  return String(nowDate.getFullYear()) + String(nowMonth) + String(nowDay);
}

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
});

new Vue({
  el: "#container",
  data: {
    searchText: '',
    archiveList: getArchiveData(),
    visibleMap: getVisibleMap(),
    isSearching: false
  },
  computed: {
    filteredArchiveList: function () {
      var searchText = this.searchText;
      var archiveList = getArchiveData();
      if (searchText == '') {
        this.isSearching = false;
        return archiveList;
      }

      this.isSearching = true;
      var reg = new RegExp(searchText, "ig");

      var resultList = [];

      var i;
      for (i in archiveList) {
        var resultArchive = {};
        var tmpAchievements = [];

        var j;
        for (j in archiveList[i].achievements) {
          if (reg.test(archiveList[i].achievements[j])) {
            tmpAchievements.push(archiveList[i].achievements[j]);
          }
        }

        resultArchive["date"] = archiveList[i].date;
        resultArchive["achievements"] = tmpAchievements;
        if (tmpAchievements.length > 0) {
          resultList.push(resultArchive);
        }
      }

      return resultList;
    }
  },
  methods: {
    toggleVisible: function (date) {
      this.$set(this.visibleMap, date, !this.visibleMap[date]);
    },
    collapseAll: function () {
      Object.keys(this.visibleMap).forEach(key => {
        this.visibleMap[key] = false;
      });
    },
    expandAll: function () {
      Object.keys(this.visibleMap).forEach(key => {
        this.visibleMap[key] = true;
      });
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  }

});

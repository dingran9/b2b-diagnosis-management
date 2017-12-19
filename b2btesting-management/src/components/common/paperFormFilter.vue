<template>
  <div class="pap-f-d">
    <hr>
    <div style="margin: 15px 0">
      <p class="pap-f-p">
        <span>区&nbsp;&nbsp;&nbsp;域:</span>
        <el-select v-model="provinceValue" placeholder="请选择省份" class="pap-f-sel" @change="getCity()">
          <el-option
            v-for="item in provinceResult"
            :key="item.id"
            :label="item.areaname"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="cityValue" placeholder="请选择市" class="pap-f-sel" @change="getDistrict()">
          <el-option
            v-for="item in cityResult"
            :key="item.id"
            :label="item.areaname"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="districtValue" placeholder="请选择县/区" class="pap-f-sel" @change="clearGroupPeriod()">
          <el-option
            v-for="item in districtResult"
            :key="item.id"
            :label="item.areaname"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <p class="pap-f-p">
        <span>学&nbsp;&nbsp;&nbsp;段:</span>
        <el-select v-model="groupPeriod" multiple placeholder="请选择学段" style="width: 240px"
                   @change="getDistrictSchool()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>
      <p class="pap-f-p">
        <span>学&nbsp;&nbsp;&nbsp;校:</span>
        <el-select v-model="schoolValue" placeholder="请选择学校" @change="useSidGetGradeList()">
          <el-option
            v-for="item in schoolList"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
        </el-select>
      </p>
      <p class="pap-f-p">
        <span>学&nbsp;&nbsp;&nbsp;年:</span>
        <el-radio-group v-model="grondRadio" v-on:change="increment">
          <!--<el-radio v-for="(item,index) in groundCode" :key='item.groupId' class="radio" v-bind:label=item.groupId>-->
          <el-radio v-for="(item,index) in groundCode" :key='item.groupIden' class="radio" v-bind:label=item.groupIden>
            {{item.groupName}}
          </el-radio>
        </el-radio-group>
      </p>
      <p class="pap-f-p" v-if="$store.state.paperFormFilter_data.showFlag" v-on:change="increment">
        <span>上下册:</span>
        <el-radio class="radio" v-model="topFloor" label="0">上册</el-radio>
        <el-radio class="radio" v-model="topFloor" label="1">下册</el-radio>
      </p>
    </div>
    <hr>

  </div>

</template>

<script>



  export default {
    data() {
      return this.$store.state.paperFormFilter_data;
    },
    mounted: function () {
      this.getProvince()
      this.$store.state.paperFormFilter_data.showFlag = Boolean(this.$route.path == '/addPaperForm')
      this.increment()
    },
    methods: {
      getArea(send) {
        let url = this.rootUrl + 'areaManager/getArea?requestId=123';
        return this.$http.post(url, send)
      },
      //获取所有省份
      getProvince() {
        this.getArea({parentId: 0})
          .then(({body: {httpCode, result}}) => {
            console.log(httpCode)
            if (httpCode === '200') {
              this.$set(this, 'provinceResult', result);
            } else {
              this.$message('获取省列表失败');
            }
          })
      },
      //获取所有市
      getCity() {
        this.cityResult = []
        this.cityValue = ''
        this.districtResult = []
        this.districtValue = ''
        if(!this.provinceValue)return;
        this.getArea({parentId: this.provinceValue})
          .then((res) => {
            this.cityResult = res.body.result;
          });
      },
      //获取所有县/区
      getDistrict(data) {
        this.districtResult = []
        this.districtValue = ''
        if (this.cityValue.length < 1) return;
        this.getArea({parentId: this.cityValue})
          .then((res) => {
            this.districtResult = res.body.result;
          });
      },
      clearGroupPeriod() {
        this.groupPeriod = []
        this.schoolValue = ''
        this.grondRadio = ''
        this.groundCode = []
      },
      areaChange(val) {
        console.log(val)
      },
      //获取所有县/区下的所有学校
      getDistrictSchool() {
        this.schoolList = []
        this.schoolValue = ''
        this.grondRadio = ''
        this.groundCode = []
        if (this.groupPeriod.length != 0) {
          this.$http.post(this.rootUrl + 'groupManager/getSchoolByStageAndArea?requestId=123', {
            "groupAreaProvinceId": this.provinceValue,
            "groupAreaDistrictId": this.districtValue,
            "groupAreaCityId": this.cityValue,
            "groupPeriod": this.groupPeriod
          }).then((res) => {
            this.schoolList = res.body.result;
            this.schoolValue = ''
          });
        }
      },
      //获取学校下左右的年级
      useSidGetGradeList() {
        if (this.schoolValue != '') {
          this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=123', {"groupId": this.schoolValue}).then((res) => {
            this.groundCode = res.body.result;
          }, (res) => {
            console.log(res);
          });
        }
      },
      increment() {
        let letThis = this
        let schoolName = ''
        this.schoolList.forEach(function (item) {
          if (item.groupId == letThis.schoolValue) {
            return schoolName = item.groupName
          }
        })
        let someDate = {
          schoolValue: this.schoolValue,
          grondRadio: this.grondRadio,
          topFloor: this.topFloor,
          schoolName: schoolName
        }
        this.$emit('increment', someDate)
      },
      handleItemChange(val) {
        console.log('active item:', val);
      },
    }
  };
</script>
<style>
  .pap-f-d span {
    /*color: #97a8be;*/
    font-size: 16px;
  }

  .pap-f-d .pap-f-sel {
    width: 120px;
  }

  .pap-f-p {
    margin: 15px 0;
  }
</style>

<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 学校管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加学校</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-steps :space="300" :align-center="true" :center="true" :active="active" finish-status="success">
      <el-step title="填写学校基本信息"></el-step>
      <el-step title="开通学年"></el-step>
      <el-step title="选择学科教学版本"></el-step>
    </el-steps>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-form :rules="rules" ref="basicInfoForm" :model="form" label-width="100px">
      <div v-show="active == 1">
        <el-form-item label="所在区域">
          <area-select @change="areaChange"></area-select>
        </el-form-item>
        <el-form-item label="学校名称:" prop="schoolName">
          <el-col :span="6">
            <el-select v-model="form.schoolName" placeholder="请选择">
              <el-option
                v-for="school in schoolList"
                :key="school.id"
                :label="school.name"
                :value="school">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学校地址:" prop="schoolAddress">
          <el-col :span="6">
            <el-input v-model="form.schoolAddress"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('basicInfoForm')"
                     :disabled="(!form.schoolName || !form.schoolAddress ) ">下一步
          </el-button>
          <el-button @click="resetForm('basicInfoForm')">重置</el-button>
        </el-form-item>
      </div>
      <div v-show="active==2" :model="form" rules="null" ref="gradeForm" label-width="100px" class="demo-ruleForm">

        <el-form-item :value="stage_grade[0].stageCode"
                      v-model="form.gradeCodes">
          <el-checkbox :indeterminate="isIndeterminatep" v-model="checkAllp"
                       @change="handleCheckAllChangep"></el-checkbox>
          <span v-if="form.grades[stage_grade[0].anotherName].length!=0"
                style="background:#ffc365;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[0].stageName}}</span>
          <span v-if="form.grades[stage_grade[0].anotherName].length==0"
                style="background:#ccc;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[0].stageName}}</span>
          <el-checkbox-group v-model="form.grades[stage_grade[0].anotherName]" @change="isShowErrorp">
            <el-checkbox v-for="grade in stage_grade[0].gradeList" :key='grade.gradeCode' :label="grade.gradeCode"
                         name="type"
                         :value="grade.gradeCode"><!--,gradeName:grade.gradeName-->
              <span :class='{active:selectActive}'>{{grade.gradeName}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :value="stage_grade[1].stageCode"
                      v-model="form.gradeCodes">
          <el-checkbox :indeterminate="isIndeterminatej" v-model="checkAllj"
                       @change="handleCheckAllChangej"></el-checkbox>
          <span v-if="form.grades[stage_grade[1].anotherName].length!=0"
                style="background:#ffc365;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[1].stageName}}</span>
          <span v-if="form.grades[stage_grade[1].anotherName].length==0"
                style="background:#ccc;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[1].stageName}}</span>
          <el-checkbox-group v-model="form.grades[stage_grade[1].anotherName]" @change="isShowErrorj">
            <el-checkbox v-for="grade in stage_grade[1].gradeList" :key='grade.gradeCode' :label="grade.gradeCode"
                         name="type"
                         :value="grade.gradeCode"><!--,gradeName:grade.gradeName-->
              <span :class='{active:selectActive}'>{{grade.gradeName}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :value="stage_grade[2].stageCode"
                      v-model="form.gradeCodes">
          <el-checkbox :indeterminate="isIndeterminates" v-model="checkAlls"
                       @change="handleCheckAllChanges"></el-checkbox>
          <span v-if="form.grades[stage_grade[2].anotherName].length!=0"
                style="background:#ffc365;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[2].stageName}}</span>
          <span v-if="form.grades[stage_grade[2].anotherName].length==0"
                style="background:#ccc;color:#fff;padding:6px 12px;border-radius:4px;">{{stage_grade[2].stageName}}</span>
          <el-checkbox-group v-model="form.grades[stage_grade[2].anotherName]" @change="isShowErrors">
            <el-checkbox v-for="grade in stage_grade[2].gradeList" :key='grade.gradeCode' :label="grade.gradeCode"
                         name="type"
                         :value="grade.gradeCode"><!--,gradeName:grade.gradeName-->
              <span :class='{active:selectActive}'>{{grade.gradeName}}</span></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-show="isChangeGrades">
          <div class="el-form-item__error">至少选择一个选项</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"
                     :disabled="!(form.grades.primary.length+form.grades.junior.length+form.grades.senior.length)">下一步
          </el-button>
          <el-button @click="active--">上一步</el-button>
        </el-form-item>

      </div>
      <div v-show="active==3" ref="selectTestVersionForm">
        <el-form-item label="选择教材版本">
          <div v-for="(grade,index) in form.selectGrades" :key="grade.code">
            {{grade.code | gradeCodeFilter}}
            <el-tag
              :key="tag"
              v-for="(group,$index) in grade.groupMaterial"
              :closable="true"
              :close-transition="false"
              @close="removeSubject($index,grade,index)"
              style="margin-left:10px;"
            >
              {{group.subjectName}}-{{group.materialVersion}}
            </el-tag>
            <el-button type="primary" size="small" @click="addDSubject(grade,index)"><i class="el-icon-plus"></i> 添加
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('')">完成</el-button>
          <el-button @click="active--">上一步</el-button>
        </el-form-item>

      </div>
    </el-form>
    <el-dialog title="添加学科及教学版本" v-model="dialogVisible" size="tiny">
      <el-form>
        <h4 style="margin-bottom:20px;text-align: center;">{{gradeInfo.code | gradeCodeFilter}}<!--|gradeCodeFilter-->
          <!--{{willAddsubjectIndex.gradeName}}--></h4>
        <el-form-item label="选择学科">
          <el-select v-model="dialog.subject" placeholder="请选择学科"
                     @change="getBookTypeVersion(gradeInfo.code,dialog.subject)">
            <el-option v-for='subject in subjectResult' :key='subject' :label="subject.subject_name" :value="subject"
                       :disabled="subject.disabledBol">
              <!--{{subject.subject_name}}-->
            </el-option>
          </el-select>
        </el-form-item>
        <!--{{dialog.subject}}-->
        <el-form-item label="选择版本">
          <el-select v-model="dialog.version" placeholder="请选择版本">
            <el-option v-for="type in bookTypeResult" :key='type.book_type' :label="type.book_type" :value="type">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {Loading} from 'element-ui';
  import stage_grade_subject from '../../../static/jsons/stage_grade_subject'
  import areaSelect from '../common/areaSelect.vue'

  export default {
    name: 'addSchool',
    components: {areaSelect},
    data() {
      return {
        schoolList: [],
        provinceResult: null,//获取省份
        cityResult: null,//获取市
        districtResult: null,//获取区/县
        subjectResult: null,//学年下所有学科
        stage_grade: stage_grade_subject,//获取学段、学年
        bookTypeResult: null,//教材版本
        subjectChoose: {},
        groupMaterial: [],//学科、教材版本集合
        gradeInfo: {},//学年
        selectActive: false,//是否选中学年，默认未选中
        isChangeGrades: false,
        form: {
          schoolName: '',//学校名称
          region: '',//省份
          city: '',//市
          district: '',//县
          schoolAddress: '',//学校地址
          stageCodes: [],//选取的学段
          delivery: false,
          grades: {
            primary: [],//小学
            junior: [],//初中
            senior: []//高中
          },
          selectGrades: [],
          childGroupBeanList: [],//学校下年级集合
        },
        dialog: {
          version: null,
          subject: null,
        },
        rules: {
          schoolName: [
            {required: true, message: '请输入学校名称', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择所在省份', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择所在市', trigger: 'blur'}
          ],
          district: [
            {required: true, message: '请选择所在县/区', trigger: 'blur'}
          ],
          schoolAddress: [
            {required: true, message: '请输入学校地址', trigger: 'blur'}
          ]
        },
        active: 1,
//        active: 2,
        dialogVisible: false,
        willAddsubjectIndex: 0,//将要添加的index
        isIndeterminatep: false,
        isIndeterminatej: false,
        isIndeterminates: false,
        checkAllp: false,
        checkAllj: false,
        checkAlls: false,
      }
    },
    mounted() {

    },
    methods: {
      //根据学年获取学科
      getSubject(gradeCode) {
        this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=' + Math.random(), {
          "gradeCode": gradeCode
        }).then((res) => {
          //添加禁用标记
          let xxx = res.body.result
          let this_ = this;
          xxx.forEach(function (a) {
            if (this_.subjectChoose[gradeCode] == undefined) {
              return
            }
            //给每个学科加上disable属性，为true或为false
            if (this_.subjectChoose[gradeCode].indexOf(a.subject_name) != -1) {
              a.disabledBol = true
            }
            else {
              a.disabledBol = false
            }
          })
          this.subjectResult = xxx;
          this.dialog.subject = null;
          this.dialog.version = null;
        });
      },
      //获取学校列表
      getSchoolList(send) {
        let url = this.rootUrl + 'groupManager/getBaseSchoolByStageAndArea?requestId=123';
        return this.$http.post(url, send)
      },
      //下一步验证是否存在
      canNext(send) {
        let url = this.rootUrl + 'groupManager/schoolManagerList?requestId=123';
        return this.$http.post(url, send)
      },
      areaChange(val) {
        this.$set(this, 'schoolList', [])
        this.form.schoolName = '';
        if (val[2]) {
          this.area = val;
          //选择了县
          this.getSchoolList({
            "pId": val[2].id,
            "pageNum": 1,
            "pageSize": 100000
          })
            .then(({body: {result, httpCode}}) => {
              if (httpCode === '200') {
                this.$set(this, 'schoolList', result.list || [])
              }
            })
        }

      },
      get() {
        this.selectActive = !this.selectActive;
      },
      /*选择教材版本的添加按钮*/
      addDSubject(grade, index) {
        let gradeCode = grade.code;//取出年级
        let grades = this.form.selectGrades[index];

        if (gradeCode) {
          this.willAddsubjectIndex = index;//记录index
          this.gradeInfo = grades;
          /*记录选择学科*/
          this.subjectChoose[gradeCode] = "";
          grade.groupMaterial.forEach((a) => {
            this.subjectChoose[gradeCode] += a.subjectName + ",";
          })
          this.dialogVisible = true;//显示dialog
          this.getSubject(gradeCode);
        }
      },
      //根据学年、学科获取教材版本
      getBookTypeVersion(gradeCode, subject) {
        this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=' + Math.random(), {
          "gradeCode": gradeCode,
          "subjectCode": subject.subject_code
        }).then((res) => {
          this.dialog.version = null;
          this.bookTypeResult = res.body.result;
        });
      },
      /*添加学科及教学版本的确定按钮*/
      addSubject() {
        let grade = this.form.selectGrades[this.willAddsubjectIndex];
        let childGroupBeanList = this.form.childGroupBeanList[this.willAddsubjectIndex];
        console.log(grade);
//     grade.groupMaterial=[];
        let version = this.dialog.version;
        let subject = this.dialog.subject;
        let group = {
          subjectIden: subject.subject_code,
          subjectName: subject.subject_name,
          versionCode: version.ctb_code,
          materialVersion: version.book_type
        };

        if (grade) {
          grade.groupMaterial.push(group);//添加数据
          childGroupBeanList.groupMaterial.push(group);//添加数据
          this.dialogVisible = false;//关闭dialog
        }
      },
      onSubmit() {
        if (this.active == 1) {//基本信息提交
          this.loading = Loading.service();
          this.canNext({
            groupExternalSchoolId: this.form.schoolName.id
          })
            .then(({body: {result, httpCode}}) => {
              this.loading.close();
              if (httpCode === '200' && result && result.list && result.list.length) {
                this.$confirm('该学校已存在,请选择其他学校添加', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
              } else {
                this.active = 2;
              }
            })
            .catch(() => {
              this.loading.close();
            })

        } else if (this.active == 2) {//开通学年
          if (this.form.grades.senior.length + this.form.grades.junior.length + this.form.grades.primary.length) {
            //选择了年级
            let selectGrades = this.form.grades.primary.concat(this.form.grades.junior).concat(this.form.grades.senior);
            selectGrades.sort(function (a, b) {
              return a - b
            });
            let str = '';
            if (this.form.grades.primary.length > 0) {
              str += '1,';
            }
            if (this.form.grades.junior.length > 0) {
              str += '2,';
            }
            if (this.form.grades.senior.length > 0) {
              str += '3,';
//              this.form.stageCodes.push('3');
            }
            let stageCodes = [];
            stageCodes = str.split(',');
            stageCodes.pop();
            this.form.stageCodes = stageCodes;
            this.form.selectGrades = selectGrades.map(item => ({code: item, groupMaterial: []}));
            this.form.childGroupBeanList = selectGrades.map(item => ({groupIden: item, groupMaterial: []}));
            this.active++;
          }
          /*if(this.form.grades.primary){
            //this.form.selectGrades=this.form.grades.primary
            this.active++;
          }*/ else {
            this.isChangeGrades = true;
          }
        } else if (this.active == 3) {
          //完成
          let {area} = this;
          let url = this.rootUrl + 'groupManager/addSchoolInfo?requestId=' + Math.random();
          this.$http.post(url, {
            "groupName": this.form.schoolName.name,
            groupExternalSchoolId:this.form.schoolName.id,
            "groupAreaProvinceId": area[0].id,
            "groupAreaProvinceName": area[0].areaname,
            "groupAreaCityId": area[1].id,
            "groupAreaCityName":  area[1].areaname,
            "groupAreaDistrictId": area[2].id,
            "groupAreaDistrictName":  area[2].areaname,
            "groupAddress": this.form.schoolAddress,
            "groupPeriod": this.form.stageCodes,
            "childGroupBeanList": this.form.childGroupBeanList
          }).then((res) => {
            if (res.body.result == true && res.body.httpCode == '200') {
              this.$notify({
                title: '成功',
                message: '学校创建成功',
                type: 'success'
              });
              this.$router.push('/schoolMange')
            }
          });
        }
      },
      resetForm(formName) {
        // this.$refs[formName].resetFields();
        this.form.schoolName = "";
        this.form.region = "";
        this.form.city = "";
        this.form.district = "";
        this.form.schoolAddress = "";
      },

      removeSubject(index, grade, num) {//删除学科
        grade.groupMaterial.splice(index, 1)
        this.form.childGroupBeanList[num].groupMaterial.splice(index, 1);//dhl
      },
      //开通学段学年全选按钮
      /*
      * p结尾是小学,j结尾是初中,s结尾是高中
      * 失败代码,为了套element
      * */
      handleCheckAllChangep(event) {
        let arr = []
        arr = event.target.checked ? this.stage_grade[0].gradeList : [];
        this.form.grades[this.stage_grade[0].anotherName] = arr.map(function (e) {
          return e.gradeCode
        })
        this.isIndeterminatep = false;
      },
      isShowErrorp(value) {
        let checkedCount = value.length;
        this.checkAllp = checkedCount === this.stage_grade[0].gradeList.length;
        this.isIndeterminatep = checkedCount > 0 && checkedCount < this.stage_grade[0].gradeList.length;
        this.isChangeGrades = !(this.form.grades.senior.length + this.form.grades.junior.length + this.form.grades.primary.length);
      },
      handleCheckAllChangej(event) {
        let arr = []
        arr = event.target.checked ? this.stage_grade[1].gradeList : [];
        this.form.grades[this.stage_grade[1].anotherName] = arr.map(function (e) {
          return e.gradeCode
        })
        this.isIndeterminatej = false;
      },
      isShowErrorj(value) {
        let checkedCount = value.length;
        this.checkAllj = checkedCount === this.stage_grade[1].gradeList.length;
        this.isIndeterminatej = checkedCount > 0 && checkedCount < this.stage_grade[1].gradeList.length;
        this.isChangeGrades = !(this.form.grades.senior.length + this.form.grades.junior.length + this.form.grades.primary.length);
      },
      handleCheckAllChanges(event) {
        let arr = []
        arr = event.target.checked ? this.stage_grade[2].gradeList : [];
        this.form.grades[this.stage_grade[2].anotherName] = arr.map(function (e) {
          return e.gradeCode
        })
        this.isIndeterminates = false;
      },
      isShowErrors(value) {
        let checkedCount = value.length;
        this.checkAlls = checkedCount === this.stage_grade[2].gradeList.length;
        this.isIndeterminates = checkedCount > 0 && checkedCount < this.stage_grade[2].gradeList.length;
        this.isChangeGrades = !(this.form.grades.senior.length + this.form.grades.junior.length + this.form.grades.primary.length);
      },
    }
  }
</script>
<style>
  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  .active {
    background: #f00;
    padding: 2px;
    color: #fff;
  }
</style>

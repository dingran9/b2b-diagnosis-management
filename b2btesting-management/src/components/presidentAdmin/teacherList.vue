<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 教师管理</el-breadcrumb-item>
        <el-breadcrumb-item>教师列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="tableData.length >0 && $route.path =='/teacherList'" type="primary" style="position: absolute;right:0;top: -10px;" @click="exportList()"><i class="el-icon-plus"></i>批量导出</el-button>
    </div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio-group v-model="grondRadio" @change=" getSubject()">
          <el-radio class="radio"  v-bind:label=null  >全部</el-radio>
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p" >
        <span class="comflter-p-span">学科:</span>
        <el-radio-group v-model="subjectRadio" @change="getTeacherManage()">
          <el-radio class="radio"  v-bind:label=null  >全部</el-radio>
          <el-radio v-for="(item,index) in subjectlist" :key = 'item.subject_code' class="radio"  v-bind:label=item.subject_code>{{item.subject_name}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <hr>
    <div style="margin: 15px 0;width: 40%">
      <el-input placeholder="请输入内容" v-model="input5" >
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="教师名称" value="userName"></el-option>
          <el-option v-if="$route.path == '/proAdminTeaMange'" label="学校名称" value="userSchoolName"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click="getTeacherManage()"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border v-loading="loading2" element-loading-text="拼命加载中"  style="width: 100%">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="userName" label="姓名" width="125">
      </el-table-column>
      <el-table-column prop="userAccount" label="教师ID">
      </el-table-column>
      <!--<el-table-column prop="userSex" label="性别" >-->
      <!--</el-table-column>-->
      <el-table-column prop="userGradeName" label="年级" width="125">
      </el-table-column>
      <el-table-column prop="userSubjectName" label="学科" width="125">
      </el-table-column>
      <el-table-column prop="pageNum" label="所带班级" width="105">
      </el-table-column>
      <!--<el-table-column prop="userPhone" label="手机号" width="155">-->
      <!--</el-table-column>-->
      <el-table-column label="操作" v-if="($route.path == '/teacherList')">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="danger"
                     @click="deleteTeacher(0, scope.row)">解绑</el-button>
          <el-button size="small" type="danger"
                     @click="deleteTeacher(1, scope.row)">离职</el-button>
          <el-button size="small" type="danger"
                     @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[currentRootPageSize, currentRootPageSize*2]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal">
      </el-pagination>
    </div>
    <el-dialog title='' v-model="dialogFormVisible">
      <p>{{form.titleGradeId|gradeCodeFilter}}{{form.titleSubject|subjectFilter}}老师{{form.userName}}</p>
      <el-form ref="form" :model="form" label-width="80px" >
        <el-form-item label="年级:" >
          <el-radio-group v-model="form.userGradeId" @change="changeGroup()">
            <el-radio  v-for="(item,index) in dgroundCode" :key = 'item.groupId' class="radio"  v-bind:label=item.groupIden  >{{item.groupName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学科:" v-show="dsshowFlag">
          <el-radio-group v-model="form.userSubject" @change="getNoClass()">
            <el-radio v-for="(item,index) in dsubjectlist" :key = 'item.subjectId' class="radio"  v-bind:label=item.subjectId>{{item.subjectName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班级:" >
          <span v-if="dclassList.length == 0" style="color: red">(暂无班级可选)</span>
          <el-checkbox-group v-model="form.classBeanList">
            <el-checkbox v-for="(item,index) in dclassList" :key="item.groupId" v-bind:label=item.groupId name="type">{{item.groupName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="(form.classBeanList < 1) " type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import md5 from 'MD5'
  export default {
    data() {
      return {
        groundCode: [
          {code:11,name:'一年级'},
          {code:12,name:'二年级'},
          {code:13,name:'三年级'},
          {code:14,name:'四年级'},
          {code:15,name:'五年级'},
          {code:16,name:'六年级'},
          {code:21,name:'七年级'},
          {code:22,name:'八年级'},
          {code:23,name:'九年级'},
          {code:31,name:'高一'},
          {code:32,name:'高二'},
          {code:33,name:'高三'},
        ],
        grondRadio: null,
        subjectRadio: null,
        subjectlist:[],
        paperListData:[],
        input5: '',
        select: 'userName',
        tableData: [],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        userSchoolId: null,
        loading2:false,   //加载动画
        dialogFormVisible:false,  //模态框打开的标识
        form: {    //模态框能数据
          titleGradeId: null,
          titleSubject: null,
          userName:'',
          userId:null,
          userGradeId: null,
          userSubject: false,
          classBeanList: [],
        },
        dsshowFlag:null,  //学科显示标识
        dgroundCode:[],   //年级集合
        dsubjectlist: [], //学科集合
        dclassList: [],   //班级集合
        tdclassList: [],  //老师已教班级集合
        checkTground:null,  //所选老师的年级
        multipleSelection:[] // 所选择的老师实体
      }
    },
    mounted(){
      this.userSchoolId = JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId
      this.getTeacherManage()
      if(this.$route.path == '/proAdminTeaMange'){
        return false
      }else {
        this.useSidGetGradeList()
      }
    },
    methods: {
      //根据学年获取学科
      getSubject: function () {
        this.subjectRadio = ' ';
        this.currentPage = 1;
          if(this.grondRadio){
            this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123',{"gradeCode":this.grondRadio}).then((res) => {
              this.subjectlist=res.body.result;
              this.subjectRadio = ' ';
            }, (res) => {
              console.log(res);
            });
          }else{
            this.subjectlist = []
          }
      },
      //根据年级和学科获取教师列表
      getTeacherManage: function () {
        this.tableData = [];
        let parms = {
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "userSchoolId":this.userSchoolId,
          "userSubjectIden":this.subjectRadio,
          "userGradeIden":this.grondRadio,
        }
        if(this.input5 != '' && this.input5!= null){
          switch (this.select){
            case "userName":
              parms.userName = this.input5
              break;
            case "userSchoolName":
              parms.userSchoolName = this.input5
              break;
          }
        }
        this.postSearch(parms);
      },
      postSearch: function (parm) {
          this.loading2 = true
        this.$http.post(this.rootUrl + 'userManager/getTeacherManagerList?requestId=123',parm
        ).then((res) => {
          this.loading2 = false
          try {
            this.tableData=res.body.result.list;  //学生列表
            this.dataTotal=res.body.result.total;  //学生总数
            this.tableData.forEach(function (e) {
              let className = ''
              e.classBeanList.forEach(function (m) {
                className += m.className+ ','
              })
              e.pageNum = className.slice(0,className.length-1)
            })
          }catch (e){
            console.log(e.message);
          }
        }, (res) => {
          console.log(res);
        });
      },
      //导出
      exportList: function () {
        if(this.subjectRadio == null && this.grondRadio!=null){
          window.location.href=''+this.rootUrl +'userManager/exportExcel/'+this.userSchoolId +'?userGradeIden='+this.grondRadio+''
        }
        if(this.subjectRadio == null && this.grondRadio==null){
          window.location.href=''+this.rootUrl +'userManager/exportExcel/'+this.userSchoolId +''
        }
        if(this.subjectRadio != null && this.grondRadio!=null){
          window.location.href=''+this.rootUrl +'userManager/exportExcel/'+this.userSchoolId +'?userGradeIden='+this.grondRadio+'&userSubjectIden='+this.subjectRadio+''
        }
      },
      handleSizeChange(val) {
        this.currentPageSize = val
        this.getTeacherManage()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTeacherManage()
      },
      //获取学校当前开通的年级
      useSidGetGradeList() {
        this.dgroundCode = []
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=123',{"groupId":this.userSchoolId}).then((res) => {
          this.dgroundCode = res.body.result;
          this.form.userSubject = '';
        }, (res) => {
          console.log(res);
        });
      },
      //根据 学年获取学科和班级
      getSubjectAndClass: function () {
        if (this.form.userGradeId != null) {
          this.$http.post(this.rootUrl + 'groupManager/getSubjectByGradeId?requestId=123', {
            "groupIden": this.form.userGradeId,
            "groupParentId": this.userSchoolId,
          }).then((res) => {
            this.dsubjectlist = res.body.result;
            this.form.userSubject = '';
          }, (res) => {
            console.log(res);
          });
        }

      },
      //打开修改模态框
      handleEdit(index, row){
        let constThis = this
        this.tdclassList = []
        this.dialogFormVisible = true;
        this.useSidGetGradeList()
        this.dclassList = []
        this.form.classBeanList = []
        this.form.userGradeId = null
        row.classBeanList.forEach(function (e) {
          constThis.tdclassList.push({'groupName':e.className,'groupId':e.classId})
        })
        this.form.userId = row.userId
        this.form.userName = row.userName

        this.form.titleSubject = row.userSubjectId
        this.form.userSubject = row.userSubjectId
        this.form.titleGradeId = row.userGradeIden
        this.checkTground= row.userGradeIden
        this.dsshowFlag = (row.userSubjectId<1)
      },
      //修改年级
      changeGroup(){
          /*先值空班级*/
        if(this.checkTground == this.form.userGradeId){
          let classBeanList = [];
          this.tdclassList.forEach(function (e) {
            classBeanList.push(e.groupId)
          })
          this.form.classBeanList = classBeanList
        }else {
          this.form.classBeanList = []
        }
        this.dclassList = []
          /*如果已经绑定学科直接获取未绑定的班级,否则就获取学科*/
        if(this.dsshowFlag){
          this.getSubjectAndClass()
        }else{
          this.getNoClass()
        }
      },
      //修改老师信息
      onSubmit(){
        let GradeId
        this.dgroundCode.forEach((e)=>{
          if(this.form.userGradeId == e.groupIden){
            GradeId = e.groupId
          }
        })
        //修改教师
        this.$http.post(this.rootUrl + 'userManager/updateTeacherManagerGroup?requestId=123',{
          "userId":this.form.userId,
          "userType":2,
          "userSubject":this.dsshowFlag?this.form.userSubject:this.form.titleSubject,
          "userSchoolId":this.userSchoolId,
          "userGradeId":GradeId,
          "classBeanList":this.form.classBeanList.map(function (item) {
            return {classId:item}
          })
        }).then((res) => {
          if(res.body.code == 'Success' && res.body.httpCode == '200'){
            this.dialogFormVisible = false;
            this.$message('修改成功');
            this.getTeacherManage()
          }else {
            this.dialogFormVisible = false;
            this.$message('修改失败');
          }
        }, (res) => {
          console.log(res);
        });
      },
      //获取未绑定的班级
      getNoClass:function() {
        if(this.form.userGradeId == null){
          return
        }
        let GradeId
        this.dgroundCode.forEach((e)=>{
          if(this.form.userGradeId == e.groupIden){
            GradeId = e.groupId
          }
        })
        if(this.form.userSubject == null){
          this.getSubjectAndClass()
        }
        this.$http.post(this.rootUrl + 'groupManager/getNoClassList?requestId=123',{
          "schoolId":this.userSchoolId,
          "gradeId":GradeId,
          "gradeIden":this.form.userGradeId,
          "subjectIden":this.dsshowFlag?this.form.userSubject:this.form.titleSubject
        }).then((res) => {
            if(this.checkTground == this.form.userGradeId){
              this.dclassList = this.tdclassList.concat(res.body.result);
            }else{
              this.dclassList = res.body.result
            }
        }, (res) => {
          console.log(res);
        });
      },
      //重置密码
      resetPassword(index, row){
        this.$http.post(this.rootUrl + 'authorize/resetUserPwd?requestId=123',{"userId":row.userId,"userName":row.userName,"userPassword":md5('123456')}
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('重置成功');
            this.dialogManaUser = false
          }
//          this.tableData1=res.body.result;
//          this.dataTotal=res.body.result.total;
        }, (res) => {
          console.log(res);
        });
      },
      //删除老师
      deleteTeacher(operatingType, row){

        let parm = {
          'operatingType':operatingType,
          "userId":row.userId,
          "userType":2
        }
        this.$http.post(this.rootUrl + 'userManager/delTeacherManagerGroup?requestId=123',parm
        ).then((res) => {
          if(res.body.code == 'Success' && res.body.httpCode == '200'){
            this.$message('操作成功');
            this.getTeacherManage()
          }
        }, (res) => {
          console.log(res);
        });
      }
    }
  }
</script>
<style>
  .comflter {
    margin: 15px 0;
  }
  .comflter-p {
    margin: 15px 0;
    padding-left: 70px;
    position: relative;
  }
  .comflter-p-span{
    position: absolute;
    top: 0;
    left: 0;
  }
  .comflter-p .demand{
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>

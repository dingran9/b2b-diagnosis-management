<template>
  <div class="syncCoach long20171102">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
      <div class="title">
        <span>课中测试</span>

        <router-link to="/main/newTest">
          <button>新建课中测</button>
        </router-link>
        <a class="download" href="http://211.157.179.213:8866/upload/answeringMachine.rar">下载答题检测器</a>
      </div>
      <div class="choclass">
        <div class="choose">
          <p style="font-size: 18px">筛选班级：</p>
          <el-select v-model="value" placeholder="全部" @change="getCurrclass">
            <el-option
              v-for="item in options"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId">
            </el-option>
          </el-select>
        </div>
        <div class="choose chstats">
          <p style="font-size: 18px">状态：</p>
          <el-select v-model="value2" placeholder="全部" @change="getCurrSta">
            <el-option
              v-for="ite in statusC"
              :key="ite.statusCode"
              :label="ite.statusName"
              :value="ite.statusCode">
            </el-option>
          </el-select>
        </div>
        <div class="reporank"><a @click="getUpdate($event,0)" class="curr">最近建立<span>  ↓</span></a><a
          @click="getUpdate($event,1)">题目数量<span>  ↓</span></a></div>
        <div class="chodate">

          <el-input
            placeholder="搜索测试"
            icon="search"
            v-model="input2"
            :on-icon-click="handleIconClick">
          </el-input>

        </div>
      </div>
    </section>
    <!--试卷列表-->
    <section class="reportContent">
      <article class="courseT clearfix" v-show="isShowlist">
        <a v-for="kez in keLists"><h3>{{kez.inClassTestName}}</h3>
          <div class="finte clearfix"><a
            @click="getClassTestDetail(kez.inClassTestCode,kez.paperCode,kez.recordNumber)">查看测试题</a><a class="red"
                                                                                                        @click="continueTest(kez.inClassTestCode,kez.teacherCode,kez.status,kez.equipmentType,kez.classCode,kez.className,kez.questionCount,kez.source,kez.paperCode,kez.inClassTestName,kez.recordNumber)"
                                                                                                        v-show="kez.status == 1">继续测试</a><a
            v-show="kez.status == 0"
            @click="beginTest(kez.inClassTestCode,kez.classCode,kez.className,kez.inClassTestName,kez.source,kez.recordNumber,kez.paperCode)">开始测试</a><a
            v-show="kez.status == 2"
            @click="checkReport(kez.inClassTestCode,kez.classCode,kez.studentCount,kez.paperCode,kez.source,kez.inClassTestName)">查看报告</a>
          </div>
          <div class="goonte clearfix"><p>{{kez.className}}<span> {{kez.questionCount}} </span>题</p>
            <p v-html="kez.createTime"></p></div>
          <label @click="showdelelt(kez.inClassTestName,kez.inClassTestCode)" @mouseover="addDelete($event)"
                 @mouseout="removeDelete($event)"><i>...</i></label></a>
      </article>
    </section>


    <!--点击按钮提示-->
    <div class="alterOuter" style="display:none;">
      <!--点击删除提示-->
      <div class="alterBody" style="display:none">
        <div class="title">提示</div>
        <p>确认删除<span>{{testName}}</span>吗？<br/>报告也会被删除</p>
        <div>
          <button @click="cancle">取消</button>
          <button @click="deleteCurrtest">删除</button>
        </div>
      </div>
      <!--点击继续提示-->
      <div class="alterBody closBt" style="display:none">
        <div class="title">提示<a @click="closeW($event)"></a></div>
        <p>确认要继续<span>{{testName}}</span>吗？</p>
        <div>
          <button @click="rightOvertest">立即结束测试</button>
          <button @click="contests">继续测试</button>
        </div>
      </div>
      <!--点击开始没有测试中的提示-->
      <div class="alterBody closBt" style="display:none;">
        <div class="title">绑定答题器</div>
        <ul class="ansma clearfix">
          <li><a class="curr" @click="getAnswerMachine($event)"></a><span>手机APP</span></li>
          <li><a @click="getAnswerMachine($event)"></a><span>答题器</span><input type="text" v-model="denum"
                                                                              placeholder="请输入设备接收器号"
                                                                              v-show="noneAns"><a class="howf"
                                                                                                  @mouseover="overdevice($event)"
                                                                                                  @mouseout="outdevice($event)"
                                                                                                  v-show="noneAns">如何找到设备？
            <div></div>
          </a></li><!--<li><a @click="getAnswerMachine($event)"></a><span>智能手表</span></li>-->
        </ul>
        <div>
          <button @click="cancle" style="background: #b3b3b3">取消</button>
          <button @click="beginDevice(1)">开始</button>
        </div>
      </div>
      <!--点击开始测试如果有测试中的提示-->
      <div class="alterBody begint" style="display:none">

        <div class="title">提示</div>
        <p>确有未完成的课中测试：<span>{{noneName}}</span>，请结束测试后重试。</p>
        <div>
          <button @click="cancle" style="background:#1fd094">确定</button>
        </div>
      </div>


      <!--点击查看测试题提示-->
      <div class="alterBody closBt fintest" :class="{isFull:isFullScreen}" style="display: none;">

        <div class="title">
          <div id="touchFullScreen_style" @click="fullScreen"></div>

          共<span>{{testsLen}}</span>道题
          <a @click="closeW($event)"></a>
        </div>
        <div class="scrohei medias" :class="{heightstyle:isFullScreen}">
          <div class="chonav clearfix">
            <a class="curr" @click="slideTests($event,'all')">全部（{{testsLen}}）</a><a v-for="tes in testsCount"
                                                                                     @click="slideTests($event,tes.questionBookName)">{{tes.questionBookName}}（{{tes.num}}）</a>
          </div>

          <div class="testQalls">
            <ul class="teslist" v-for="(tests,index) in testAll">
              <li v-for="(tro,index) in tests"><h3 v-html="index+1 + '、' + tro.baseName" class="stemLong"></h3>
                <p v-for="que in tro.questionOption" v-html="que.optionKey + '.' + que.optionValue"
                   class="optionLong"></p></li>
            </ul>

          </div>


        </div>
      </div>
      <!--未找到答题器设备提示-->
      <div class="alterBody begint" style="display:none">
        <div class="title">提示</div>
        <p>未开启“答题监视器”，或者您的设备码输入有误，请检查后重试。</p>
        <div>
          <button @click="confirm" style="background:#1fd094">确定</button>
        </div>
      </div>
      <!--点击开始没有测试中的提示-->
      <div class="alterBody closBt" style="display:none;">
        <div class="title">绑定答题设备</div>
        <ul class="ansma clearfix">
          <li><a class="curr" @click="getAnswerMachine($event)"></a><span>手机APP</span></li>
          <li style="display: none;"></li>
          <li style="display: none;"></li>
          <li><a @click="getAnswerMachine($event)"></a><span>酷神笔</span></li>
        </ul>
        <div style="margin-top: 50px;">
          <button @click="cancle" style="background: #b3b3b3">取消</button>
          <button @click="beginDevice(2)">开始</button>
        </div>
      </div>



      <!--点击paper查看测试题提示-->
      <div class="alterBody closBt fintest" :class="{isFull:caseFullScreen}" style="display: none;">

        <div class="title">
          <span style="font-size: 40px">试卷详情（考试号：<strong>{{recordC}}</strong>）</span>
          <div id="casetouchFullScreen_style" @click="casefullScreen"></div>
          <a @click="closeW($event)"></a>
        </div>
        <div class="scrohei medias" :class="{heightstyle:caseFullScreen}">
          <div class="testQalls">

            <ul class="teslist testInfo">

              <li v-for="(pa,index) in paperdetail">
                <h3 style="font-size: 40px;" v-html="index+1 + '、'+ pa.stem"></h3>
                <template v-show="pa.componentQuestions.length==0">
                  <p style="font-size: 40px; line-height: 40px" v-for="que in pa.quesOption" v-html="que.optionKey + '、' + que.optionValue"></p>
                </template>
                <template v-show="pa.componentQuestions.length!=0">
                  <template v-for="(comp,ind) in pa.componentQuestions">
                    <h3  v-html="comp.stem" style="text-indent: 15px; margin:20px 0 10px 0;"></h3>
                    <p v-for="cod in comp.quesOption" v-html="cod.optionKey +'、' + cod.optionValue"></p>
                  </template>
                </template>
              </li>


            </ul>

          </div>


        </div>
      </div>

    </div>


    <template>
      <div class="block" v-show="isShowlist">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=pageNum
          :page-sizes="[10, 20, 50]"
          :page-size=pageSize
          layout="total, prev, pager, next, jumper"
          :total=testPaperData.total>
        </el-pagination>
      </div>
    </template>


    <div v-show="isShownone" class="nodata">
      暂无数据
    </div>

  </div>
</template>
<script>
  import $ from '../../../static/js/jquery-3.2.1.min.js'
  import canvasGround from '../common/canvasGround.vue';
  import colseScreen from '../../../static/img/colseScreen.png';
  import allScreen from '../../../static/img/allScreen.png';

  export default {
    components: {
      canvasGround
    },
    data() {
      return {
        data: {
          localData: null,//从localstorage得到的数据
          baseinfo: null
        },
        keLists: [],
        pageNum: 1,
        pageSize: 10,
        testPaperData: {total: 0},
        options: [],
        value: '',
        value2: '',
        classCode: null,
        status: null,        //数字
        timeSort: null,    //	时间排序 0倒序,1正
        numSort: null,      //	数量排序 0倒序,1正
        inClassTestName: null,
        countTime: 0,
        countNum: 0,
        statusC: [{'statusCode': null, 'statusName': '全部'}, {
          'statusCode': '0',
          'statusName': '未开始'
        }, {'statusCode': '1', 'statusName': '进行中'}, {'statusCode': '2', 'statusName': '已出报告'}],
        input2: '',
        testAll: [],
        testsCount: [],
        testsRows: [],
        testsLen: '',
        deviceType: 0,
        testName: '',
        testCode: '',
        isShowlist: true,
        isShownone: false,
        noneName: '',
        denum: '',
        currNum: '',
        noneAns: false,
        testCodes: '',
        testClassC: '',
        paperdetail: [],
        source: '',
        paperC: '',
        recordC: '',
        // 控制开启全屏还是关闭全屏
        isFullScreen: false,
        // 控制全屏开个 开始测试
        caseFullScreen: false,
      }
    },
    mounted() {

      this.data.localData = this.localData.get("webTeacherUser");
      this.data.baseinfo = this.localData.get('baseinfo')
      this.data.saveCode = this.localData.get('saveCode')
      this.data.deviceType = this.localData.get('equipmentType')
      this.data.devicenum = this.localData.get('devicenum')

      this.getKezhongtlist()
      this.getTeachercla()
    },
    methods: {
      openFullGreen() {
        console.log('开启全屏');
        var docElm = document.documentElement;

        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }

        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }

        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }

        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }

      },
      confirm() {
        $('.alterOuter').find('.alterBody').eq(5).hide()
      },
      checkReport(testC, classC, stunum, paperC, souC,nametestC) {

        let para = {
          'inClassTestCode': testC
        }
        let params = {
          'inClassTestCode': testC,
          'classCode': classC,
          'studentCount': stunum,
          'paperCode': paperC,
          'source': souC,
          'inClassTestName': nametestC
        }

        this.$ajax.reportVerification(para)
          .then((res) => {
            if (res.httpCode == 200) {
              if (res.result == true) {
                this.$router.push({path: '/questionStorage/reportDetail_duoheyi', query: params})
              }
              else {
                this.$message('尚未有人答题！');
              }
            } else {
              this.$message('判断是否有人答题接口失败,请刷新页面重试');
            }
          })
      },
      rightOvertest() {
        let params1 = {
          "inClassTestCode": this.testCodes,
          "teacherCode": this.data.localData.userId,
          "status": 2,
          "equipmentType": this.data.deviceType,
          "classCode": this.testClassC
        }
        this.$ajax.getTeststepone(params1)
          .then((res) => {

            if (res.httpCode == 200) {
              $('.alterOuter').hide().find('.alterBody').hide()
              this.noneName = ''
              this.getKezhongtlist()
            } else {
              this.$message('结束测试失败,请刷新页面重试');
            }
          })
      },
      cancle() {
        $('.alterOuter').hide().find('.alterBody').hide()
      },
      deleteCurrtest() {
        let params = {
          'inClassTestCode': this.testCode
        }

        this.$ajax.getDeleteTest(params)
          .then((res) => {

            if (res.httpCode == 200) {
              $('.alterOuter').hide().find('.alterBody').hide()
              this.getKezhongtlist()
              this.noneName = ''
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      showdelelt(testName, testCode) {
        this.testName = testName
        this.testCode = testCode
        $('.alterOuter').show().find('.alterBody').eq(0).show()
      },

      beginDevice(type) {

        if (this.deviceType == 1 && this.denum == '') {
          this.$message('请输入答题器设备号！');
        }
        if (this.deviceType == 1 && this.denum != '') {
          this.beginAnswer()
        }
        if (this.deviceType != 1) {
          this.localData.set('equipmentType', this.deviceType)
          this.localData.set('devicenum', this.denum)
          let spnum = {
            'id': 1,
            'tn': ''
          }
          if (type == 1) {
            this.$router.push({path: '/main/classroomTest', query: spnum})
          }
          else {
            //this.$router.push({path: '/main/testPaperInfo', query: spnum})
          }
        }
      },
      beginAnswer() {
        let params = {
          'baseId': this.denum
        }
        this.$ajax.getMachine(params)
          .then((res) => {
            if (res.code == 'OK') {
              this.localData.set('equipmentType', this.deviceType)
              this.localData.set('devicenum', this.denum)
              let spnum = {
                'id': 1,
                'tn': ''
              }
              this.$router.push({path: '/main/classroomTest', query: spnum})
            } else {
              $('.alterOuter').find('.alterBody').eq(5).show()
            }
          })
      },
      getAnswerMachine(event) {
        let elc = event.currentTarget
        let ind = $(elc).parent().index()
        $(elc).addClass('curr').parent().siblings().find('>a').removeClass('curr')
        this.deviceType = ind
        if (this.deviceType == 1) {
          this.noneAns = true
        }
        else {
          this.noneAns = false
        }
      },
      beginTest(testC, classC, classN, testNameC, type, record,paperC) {
        this.getKezhongtlist()
        if (this.noneName != '') {
          $('.alterOuter').show().find('.alterBody').eq(3).show()
        }
        else {
          this.localData.set('baseinfo', {'inClassTestCode': testC, 'classCode': classC, 'className': classN})
          this.localData.set('testName', testNameC)
          this.localData.set('saveCode', testC)
          this.localData.set('record', record)
          if (type == 2) {
            //$('.alterOuter').show().find('.alterBody').eq(6).show()
            //this.fullScreen()
            this.localData.set('paperCode',paperC)
            let spnum = {
              'id': 1,
              'tn': ''
            }
            this.$router.push({path: '/main/testPaperInfo', query: spnum})
          }
          else {
            $('.alterOuter').show().find('.alterBody').eq(2).show()
          }
        }
      },
      overdevice(event) {
        let elc = event.currentTarget
        $(elc).find('div').show()
      },
      outdevice(event) {
        let elc = event.currentTarget
        $(elc).find('div').hide()
      },
      closeW(event) {

        if (this.isFullScreen) {
          this.fullScreen();
        }

        if (this.caseFullScreen) {
          this.casefullScreen();
        }

        let elc = event.currentTarget
        $(elc).parents('.alterBody').hide().parent().hide()
      },
      slideTests(event, name) {allScreen.png
        colseScreen.png
        let elc = event.currentTarget
        let ind = $(elc).index()
        let arr = this.testsRows
        let arrnew = []

        if (name != 'all') {
          this.testAll.splice(1)
          $.each(arr, function (i, ele) {
            if (ele.questionBookName == name) {
              arrnew.push(ele)
            }
          })
          this.testAll.push(arrnew)

          $(elc).addClass('curr').siblings().removeClass('curr')
          $('.testQalls').find('.teslist').hide().eq(1).show()
        }
        else {
          $(elc).addClass('curr').siblings().removeClass('curr')
          $('.testQalls').find('.teslist').hide().eq(0).show()
        }
      },
      getClassTestDetail(testC, paperC, recordC) {

        let self = this
        if (paperC == null) {
          let params = {
            'inClassTestCode': testC
          }
          $('.alterOuter').show().find('.alterBody').eq(4).show()
          $('.chonav').find('a').eq(0).addClass('curr').siblings().removeClass('curr')
          this.testAll = []

          this.$ajax.getbaseQuestion(params)
            .then((res) => {
              let arr = res.result.rows
              this.testsLen = res.result.rows.length
              if (res.httpCode == 200) {
                $.each(arr, function (i, ele) {
//                if(ele.source == "1" || ele.source == "web"){//易教
                  ele.questionOption = eval(self.strToUrl(ele.questionOption))
                  ele.baseName = self.strToUrl(ele.baseName)
//                }else{
                  ele.questionOption = eval(ele.questionOption);
//                }
                })
                this.testsCount = res.result.count
                this.testsRows = arr
                this.testAll.push(arr)
              } else {
                this.$message('获取试卷列表失败,请刷新页面重试');
              }
            })
        }
        else {
          this.recordC = recordC

          $('.alterOuter').show().find('.alterBody').eq(7).show()
          let params2 = {
            'paperCode': paperC
          }
          this.$ajax.getResourcePaper(params2).then((res) => {
            if (res.httpCode == 200) {
              //this.localData.set('paperCode',code)
              let newarr = []
              let arr = res.result.paperSystemQusetionType
              for (let i in arr) {
                let arrPa = arr[i].typeList
                for (let j in arrPa) {
                  let arrList = arrPa[j].list
                  for (let k in arrList) {
                    let comlist = arrList[k].componentQuestions
                    arrList[k].stem = this.strToUrl(arrList[k].stem)
                    if (comlist.length == 0) {
                      arrList[k].quesOption = eval(this.strToUrl(arrList[k].quesOption))
                    }
                    else {
                      for (let m in comlist) {
                        comlist[m].stem = this.strToUrl(comlist[m].stem)
                        comlist[m].quesOption = eval(this.strToUrl(comlist[m].quesOption))
                      }
                    }
                    newarr.push(arrList[k])
                  }
                }
              }
              this.paperdetail = newarr
            }
          })
        }
      },
      continueTest(TestCode, erCode, status, Type, classC, classN, currNum, source, paperC, testName, record) {
        this.localData.set('baseinfo', {
          'inClassTestCode': TestCode,
          'classCode': classC,
          'className': classN,
          'equipmentType': Type
        })
        this.localData.set('saveCode', TestCode)
        this.testCodes = TestCode
        this.testClassC = classC
        this.currNum = currNum
        this.source = source
        this.localData.set('paperCode', paperC)
        this.localData.set('testName', testName)
        this.localData.set('record', record)
        $('.alterOuter').show().find('.alterBody').eq(1).show()
      },
      contests() {
        let params = {
          "inClassTestCode": this.testCodes
        }
        let parm = {
          'testCode': this.testCodes
        }
        //this.fullScreen()

        this.$ajax.getBaseId(parm)
          .then((res) => {
            if (res.httpCode == 200) {
              this.localData.set('devicenum', res.baseId)
            } else {
              //this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })


        this.$ajax.getContinuetest(params)
          .then((res) => {
            if (res.httpCode == 200) {
              let spnum = {
                'id': res.result.sout,
                'tn': this.currNum
              }

              if (this.source == 2) {
//
                this.$router.push({path: '/main/testPaperInfo', query: spnum})
              }
              else {
                this.$router.push({path: '/main/classroomTest', query: spnum})
              }
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      addDelete(event) {
        let evl = event.currentTarget
        $(evl).find('i').html('').parents('a').addClass('delesy')
      },
      removeDelete(event) {
        let evl = event.currentTarget
        $(evl).find('i').html('...').parents('a').removeClass('delesy')

      },
      getTeachercla() {
        let sendData = {
          "userId": this.data.localData.userId
        }
        this.$ajax.getTeacherClass(sendData)
          .then((res) => {

            if (res.httpCode == 200) {
              let all = [{'groupId': null, 'groupName': '全部'}]
              this.options = all.concat(res.result)
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getKezhongtlist() {
        let self = this
        let sendData = {
          "teacherCode": this.data.localData.userId,       //写死的
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          'classCode': this.classCode,
          'status': this.status,        //数字
          'timeSort': this.timeSort,    //	时间排序 0倒序,1正
          'numSort': this.numSort,      //	数量排序 0倒序,1正
          'inClassTestName': this.inClassTestName
        }

        this.$ajax.getKezhongtlist(sendData)
          .then((res) => {

            if (res.httpCode == 200) {

              let arr = res.result.rows
              let selclass = []

              $.each(arr, function (i, ele) {
                let date = new Date(arr[i].createTime)
                arr[i].createTime = '<span style="color:#F66">' + date.toLocaleString().split(' ')[0].replace(/\//g, '-') + '</span> ' + date.toLocaleString().split(' ')[1].substring(0, 2) + '<span style="color:#F66">' + date.toLocaleString().split(' ')[1].substring(2, 12).split(':')[0] + ':' + date.toLocaleString().split(' ')[1].substring(2, 12).split(':')[1] + '</span>'
                arr[i].studentCount = res.result.number[i].studentCount
                if (ele.status == 1) {
                  self.noneName = ele.inClassTestName
                }
              })
              this.keLists = arr

              this.testPaperData = res.result
              this.isShowlist = true
              this.isShownone = false
            } else {
              this.isShowlist = false
              this.isShownone = true
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getKezhongtlist()
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getKezhongtlist();
      },
      handleIconClick(ev) {
        this.inClassTestName = $(ev.currentTarget).next().val()
        this.getKezhongtlist();
      },
      getCurrclass(val) {
        this.classCode = val
        this.getKezhongtlist()
      },
      getCurrSta(val) {
        this.status = val
        this.getKezhongtlist()
      },
      getUpdate(event, type) {
        let elc = event.currentTarget

        $(elc).addClass('curr').siblings().removeClass('curr').find('span').html(' ↓')
        if (type == 0) {
          this.numSort = null
          this.countNum = 0
          if (this.countTime % 2 == 0) {
            this.timeSort = 1
            $(elc).find('span').html(' ↑')
          }
          else {
            this.timeSort = null
            $(elc).find('span').html(' ↓')
          }
          this.getKezhongtlist()
          this.countTime++
        }
        if (type == 1) {
          this.timeSort = null
          this.countTime = 0
          if (this.countNum % 2 == 0) {
            this.numSort = 1
            $(elc).find('span').html(' ↑')
          }
          else {
            this.numSort = null
            $(elc).find('span').html(' ↓')
          }
          this.getKezhongtlist()
          this.countNum++
        }
      },

      // 全屏 继续测试
      fullScreen() {

        if (!this.isFullScreen) {
          this.isFullScreen = true
          $("#touchFullScreen_style").attr("style", "background-image:url("+colseScreen+")");

          this.clonsefullScreen()
        } else {
          this.isFullScreen = false
          $("#touchFullScreen_style").attr("style", "background-image:url("+allScreen+")");

          this.openfullScreen()
        }

      },

      // 全屏 开始测试
      casefullScreen() {

        if (!this.caseFullScreen) {
          this.caseFullScreen = true
          $("#casetouchFullScreen_style").attr("style", "background-image:url("+colseScreen+")");
          this.clonsefullScreen()
        } else {

          this.caseFullScreen = false
          $("#casetouchFullScreen_style").attr("style", "background-image:url("+allScreen+")");

          this.openfullScreen()
        }

      },

      /// 开启全屏
      openfullScreen() {

        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        //FireFox
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        //Chrome等
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        //IE11
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }

      },

      /// 关闭全屏
      clonsefullScreen() {

        var docElm = document.documentElement;

        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }

        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }

        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }

        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }

      }

    }

  }
</script>
<style lang="scss">
  .ansma {
    text-align: left;
    padding-top: 18px;
    li {
      height: 20px;
      line-height: 20px;
      color: #3d4051;
      margin: 18px 0 0 70px;

      * {
        float: left;
      }
      input {
        width: 374px;
        height: 38px;
        line-height: 38px;
        border: 1px solid #e1e5ec;
        border-radius: 4px;
        margin-left: 28px;
        color: #3d4051;
        text-indent: 15px;
        font-size: 16px;
        padding-right: 118px;
      }
      a:first-child {

        width: 18px;
        height: 18px;
        border-radius: 100%;
        border: 1px solid #d5f3e6;
        position: relative;
        margin: 1px 10px 0 0;
        &.curr:after {
          position: absolute;
          content: "";
          left: 4px;
          top: 4px;
          background: #1fd094;
          width: 8px;
          height: 8px;
          border-radius: 100%;
        }
      }

    }

    li:nth-child(2) {
      a, span {
        margin-top: 6px;
      }
      margin-bottom: 30px;
      position: relative;
      a.howf {
        position: absolute;
        color: #1fd094;
        font-size: 14px;
        width: 108px;
        right: 70px;
        top: 4px;
        div {
          position: absolute;
          left: 110px;
          top: -94px;
          width: 340px;
          height: 202px;
          border-radius: 0;
          border: none;
          display: none;
          background: url('../../../static/img/teacherC.png') no-repeat;
        }
      }
    }
  }

  .curst {
    font-size: 16px;
    height: 36px;
  }

  .el-pagination {
    margin-top: 30px;
    margin-bottom: 30px;
    * {
      vertical-align: middle;
    }
    .el-pager li {
      min-width: 34px;
      line-height: 34px;
      margin-top: 2px;
      @extend .curst
    }
    .el-pager li.active {
      background: #1fd094;
      border: none;
    }
    .btn-next, .btn-prev {
      height: 36px;
      margin-top: 2px;
    }
    .el-select .el-input {
      width: 142px;
    }
    .el-select .el-input input {
      height: 36px;
      font-size: 16px;
    }
    .el-select {
      vertical-align: top;
    }
    button, span {
      line-height: 36px;
      @extend .curst
    }
    .el-pagination__jump {
      padding-left: 20px;
      margin-top: 2px;
    }
    .el-pagination__editor {
      min-width: 36px;
      vertical-align: top;
      margin: 0 10px;
      @extend .curst
    }
  }

  .el-input {

  }

</style>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';
  @import "../../../static/css/findselected";

  h2, h3 {
    font-weight: normal;
  }

  a {
    cursor: pointer;
  }

  .lef {
    float: left;
  }

  .rig {
    float: right;
  }

  .clearfix:after {
    clear: both;
    content: ' ';
    display: block;
    font-size: 0;
    line-height: 0;
    visibility: hidden;
    width: 0;
    height: 0
  }

  .nodata {
    font-size: 16px;
    margin-top: 300px;
  }

  .download {
    float: right;
    margin: 10px 20px 0 0;
    color: #4c6175
  }

  .syncCoach {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 9px 58px 9px 38px;
        background: white;
        border-bottom: 1px solid #e1e5ec;

        span {
          color: #4c6175;
          font-size: 24px;
          float: left;
          height: 40px;
          line-height: 40px;
        }
        button {
          float: right;
          width: 140px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          background: #1fd094;
          letter-spacing: 1px;
          outline: none;
          cursor: pointer;
        }
      }
      .rig {
        float: right;
      }

      .reporank, .chodate {
        @extend .rig
      }
      .choclass {
        background: #fff;
        overflow: hidden;
        height: 90px;
      }
      .chodate {
        padding: 25px 0;
        input {
          width: 298px;
        }
      }
      .reporank {
        margin: 25px 29px 0 60px;
        height: 36px;
        line-height: 36px;
        a {
          display: inline-block;
          width: 80px;
          margin-right: 18px;
          font-size: 16px;
          color: #3d4051;
          letter-spacing: .5px;
          cursor: pointer;
          &.curr {
            color: #1fd094;
          }
        }
      }
      .choose {
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 26px 40px;
        text-align: left;
        float: left;
        p {
          display: inline-block;
          color: #505050;
          letter-spacing: .5px;
          margin-right: 4px;
        }
        .select {
          input {
            background: #f0f4fb;
            width: 178px;

          }
        }
      }
      .chstats {
        padding: 25px 0;

      }
    }
    .reportContent {
      overflow: hidden;
      .nodata {
        height: 100px;
        line-height: 100px;
        font-size: 20px;
        background: #fff;
        margin: 20px;
      }
      /*    .report{
            border:4px solid #ffffff;
            &:hover{
              border:4px solid #00d1b2;
            }
            &.active{
              border:4px solid #1fd094;
            }
          }*/

    }

    .SmallreportList {
      .content {
        overflow: hidden;
        background: #ecf2f7;
        padding: 40px;
        .everyone {
          width: 130px;
          /*height:60px;*/
          background: #ffffff;
          float: left;
          margin-left: 40px;
          /*margin-top:20px;*/
          margin-bottom: 40px;
          cursor: pointer;
          .head {
            background: #1fd094;
            height: 30px;
            color: #fff;
            line-height: 30px;
          }
          .canvas {
            height: 80px;
            width: 80px;
            margin-top: 10px;
          }
          .foot {
            /*background:blue;*/
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .el-dialog { //单独设定，不考虑与content的层级关系
        width: 50%;
        height: 50%; //相对于浏览器的比例，因为其遮罩是浏览器的100%
        .el-dialog__header {
          background: #d3f2e5;
          padding: 0;
          height: 60px;
          line-height: 60px;
          position: relative;
          button {
            position: absolute;
            right: 24px;
            top: 22px;
            cursor: pointer;
          }
        }
        .el-dialog__body {
          padding: 0px;
          height: 90%;
          background: #ecf2f7;
          overflow: auto;

        }
        .el-dialog__footer {
          height: 0px;
          text-align: center;
          padding-top: 20px;
          button:nth-last-child(1) {
            margin-left: 50px;
          }
        }
      }
    }
  }

  .courseT {
    margin-top: 20px;
    > a {
      @extend .lef;
      width: 360px;
      height: 200px;
      background: #fff;
      margin: 0 0 20px 20px;
      position: relative;
      overflow: hidden;
      &:hover {
        box-shadow: 0 0 25px #cee0f5;
        transition: .3s;
      }
      &.delesy {
        box-shadow: 0 0 15px #f5b6c4;
      }
    }
    h3 {
      height: 98px;
      line-height: 98px;
      font-size: 18px;
      color: #505050;
    }
    label {
      position: absolute;
      right: -44px;
      top: -44px;
      display: block;
      width: 88px;
      height: 88px;
      border-radius: 100%;
      background: #1fd094;
      box-shadow: -3px 3px 15px #dae6f0;
      &:hover {
        background: #f66;
        transition: .3s;
        i {
          left: 15px;
          top: 52px;
          background: url('../../../static/img/deleB.png') no-repeat 3px bottom;
        }
      }
      i {
        display: block;
        position: absolute;
        width: 40px;
        height: 22px;
        left: 8px;
        top: 34px;
        color: #fff;
        font-size: 40px;
        color: #fff;
        letter-spacing: 1px;
      }
    }
  }

  .finte {
    display: block;
    a {
      width: 140px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      font-size: 18px;
      color: #fff;
      letter-spacing: .5px;
    }
    a {
      background: #67efc1;
      cursor: pointer;
      transition: .2s;
      display: inline-block;
    }
    a:first-child {
      @extend .lef;
      margin-left: 23px;
      &:hover {
        background: #1fd094;
      }
    }
    a:last-child {
      @extend .rig;
      margin-right: 22px;
      &:hover {
        background: #1fd094;
      }
    }
    a.red {
      background: #f66;
      &:hover {
        background: #f66;
      }
    }
  }

  .goonte {
    border-top: 1px solid #e1e5ec;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    color: #999;
    p:first-child {
      @extend .lef;
      margin-left: 22px;
    }
    p:last-child {
      @extend .rig;
      margin-right: 22px;
    }
    p {
      span {
        color: #f66;
      }
    }
  }

  .fos {
    font-size: 18px;
  }


</style>
<style lang="scss">
  .long20171102 {
    .stemLong {
      font-size: 18px;
      line-height: 40px;
      * + p {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .optionLong {
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 10px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  @media (max-height: 768px) {
    .alterOuter {
      .alterBody.fintest {
        width: 600px;
        height: 400px;
        margin-top: -200px;
        margin-left: -300px;
      }
      .alterBody {
        .scrohei.medias {
          height: 320px;
        }
      }
    }
  }

  .alterOuter {

    .testInfo {
      li:first-child {
        border-top: none
      }
    }
  }

  #touchFullScreen_style {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 24px;
    margin-right: 65px;
    line-height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("../../../static/img/allScreen.png");
    cursor: pointer;
  }

  #casetouchFullScreen_style {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 24px;
    margin-right: 65px;
    line-height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("../../../static/img/allScreen.png");
    cursor: pointer;
  }

  .isFull {
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
  }

  .heightstyle {
    height: 100% !important;
    padding-bottom: 70px !important;

  }

</style>


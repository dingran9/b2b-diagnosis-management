<template>
  <div class="newTest20171103">
    <section class="header clearfix" v-if="true">
      <a @click="goBack" v-show="isBack"></a>
      <a @click="goInput" v-show="isInput"></a>
      <span><label>课中测试</label> > <label>新建课中测试</label></span>
    </section>

    <!--学科列表-->
    <section class="newContent">
      <div class="stepnum clearfix">
        <el-input v-model="input" placeholder="请输入测试名称，限10个字以内" style="width: 940px; margin:220px 0 20px 0;"
                  :maxlength="10"></el-input>
        <el-select v-model="value" placeholder="请选择测试班级" @change="sendVal()" style="width: 940px; margin-bottom: 60px;">
          <el-option
            v-for="item in options"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
        </el-select>
        <a @click="chooseTestti($event)">下一步</a>
      </div>
      <div class="chooseT clearfix"  style="display: none;">
        <div class="tiku clearfix"><h3><a @click="getCurrTestTitle($event)">我的题库</a><a class="curr" @click="getCurrTestTitle($event)">易教试卷</a></h3><p v-show="isMytiku"><a class="checkhas" @click="checkhas($event)">查看已选<span class="cholen">{{chooselens}}</span><span style="display: none;">（0）</span></a><a @click="saveTestinfo">保存</a><a @click="beginTest(1)" v-show="isBegin" style="background: #1fd094;color:#fff">开始测试</a><a v-show="isError">开始测试</a></p><p v-show="istesttiku"><a @click="savePaperinfo" style="background: #d3f2e5;">保存</a><a @click="beginTest(2)" v-show="isTestBegin" style="background: #1fd094;color:#fff">开始测试</a><a v-show="isTestError">开始测试</a></p></div>
        <div class="tlists clearfix">

          <div class="myTiku clearfix" style="display: none;">
            <div class="letil">
              <a v-for="spe in questions" @click="getQuestionT($event,spe.questionBookCode)"
                 href="javascript:void(0,0)">{{spe.name}}</a>
            </div>
            <div class="tikulists">
              <ul class="tidetail clearfix" v-for="(tot,ind) in totalTiku" style="display: none;">
                <li v-for="(tval,index) in tot" :id="tval.baseCode">
                  <div class="tinum">
                    <h3 v-html="index+1 + '、' + tval.baseName" class="stemLong"></h3>
                    <p v-for="ans in tval.questionOption" v-html="ans.optionKey + '.' + ans.optionValue"
                       class="optionLong"></p>
                  </div>
                  <div class="acknow">
                    <div class="spot clearfix"><span v-for="kon in tval.knowledges" :id="kon.id">{{kon.name}}</span>
                    </div>
                    <a
                      @click="addTest($event,tval.baseName,tval.questionOption,tval.baseCode,tval.questionBookName)">添加</a>
                    <a class="cancle" @click="cancleTest($event,tval.baseName,tval.baseCode)">取消</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="myTiku clearfix">
            <testPaperList></testPaperList>
          </div>
        </div>

      </div>
      <!--点击查看测试题提示-->
      <div class="alterOuter" style="display: none;">
        <div class="alterBody closBt fintest" style="display: none">
          <div class="title">已选<span>{{chooselens}}</span>道题<a class="close" @click="closeW($event)"></a></div>
          <div class="scrohei">

            <template>
              <div class="chonav clearfix">
                <a v-for="(tha,index) in checkedtitles" @click="slideCurrstatus($event,tha.title)"
                   :class="{'curr':!index}">{{tha.title}}（{{tha.arr.length}}）</a>
              </div>
              <div class="alltests">
                <ul class="teslist" v-for="tatin in totalTests" :id="tatin[0].questionBookName" style="display: none;">
                  <li v-for="(ad,index) in tatin" :id="ad.baseCode"><h3 v-html="ad.sout + '.' + ad.baseName"
                                                                        class="stemLong"></h3>
                    <p v-for="quo in ad.questionOption" v-html="quo.optionKey + '.' + quo.optionValue"
                       class="optionLong"></p>
                    <div class="operaB">

                      <div class="hoRank" @mouseover="rullRankover($event)" @mouseout="rullRankout($event)">
                        <span>调整顺序为</span>
                        <div class="showTonum">
                          <a v-for="ite in ranks" @click="chooseTestrank(ad.sout,ite)">第{{ite}}题</a>
                        </div>
                      </div>
                      <a @click="deleteCurr($event,ad.sout,ad.baseCode)">删除</a>
                    </div>
                  </li>
                </ul>
              </div>
            </template>

          </div>
        </div>
        <!--点击开始测试提示-->
        <div class="alterBody closBt isBegin" style="display: none;">
          <div class="title">提示<a></a></div>
          <p>本次测试共<span>9</span>题，立刻开始<span>初二（7）班</span>课中测？</p>
          <div>
            <button @click="">取消</button>
            <button @click="">开始</button>
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
        <!--未找到答题器设备提示-->
        <div class="alterBody begint" style="display:none">
          <div class="title">提示</div>
          <p>未开启“答题监视器”，或者您的设备码输入有误，请检查后重试。</p>
          <div>
            <button @click="confirm" style="background:#1fd094">确定</button>
          </div>
        </div>
        <!--点击开始测试如果有测试中的提示-->
        <div class="alterBody begint" style="display: none;">
          <div class="title">提示</div>
          <p>确有未完成的课中测试：<span>{{noneName}}</span>，请结束测试后重试。</p>
          <div>
            <button @click="cancle" style="background:#1fd094">确定</button>
          </div>
        </div>

        <!--点击开始测试 试卷-->
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

      </div>
    </section>
    <!--加载loading-->
    <div class="loading" style="display: none;"></div>
  </div>
</template>
<script>
  import $ from '../../../static/js/jquery-3.2.1.min.js'
  import testPaperList from '../newCreatTest/testPaperList.vue';
  import colseScreen from '../../../static/img/colseScreen.png';
  import allScreen from '../../../static/img/allScreen.png';

  export default {
    props: [],
    components: {
      testPaperList
    },
    data() {
      return {
        data: {
          localData: null,//从localstorage得到的数据
          baseinfo: null
        },
        options: [],
        value: '',
        questions: [],
        input: '',
        questionlist: [],
        type: '',
        addTests: [],
        whichTest: [],
        deviceType: 0,
        classCode: '',
        className: '',
        teacherCode: '',
        teacherName: '',
        gradeCode: '',
        inClassTestName: '',
        subjectCode: '',
        baseCode: '',
        sout: '',
        totalTiku: [],
        chooselens: '（' + 0 + '）',
        totalTests: [],
        ranks: [],
        value5: '',
        isBegin: false,
        isError: true,
        checkedtitles: [],
        deviceUrl: '../../static/img/teacherc.png',
        opcode: '',
        isBack: true,
        isInput: false,
        denum: '',
        nClasscode: '',
        nClassname: '',
        noneAns: false,
        noneName: '',
        isCancle: '',
        canCode: '',
        isMytiku: false,
        istesttiku: true,
        isTestBegin: false,
        isTestError: true,
        // 控制开启全屏还是关闭全屏
        isFullScreen: false,
        // 控制全屏开个 开始测试
        caseFullScreen: false,
      }
    },
    mounted() {
      this.data.localData = this.localData.get("webTeacherUser")
      this.data.baseinfo = this.localData.get('baseinfo')
      this.data.saveCode = this.localData.get('saveCode')

      this.getTeachercla()
    },
    methods: {
      getCurrTestTitle(event) {
        let elc = event.currentTarget
        let ind = $(elc).index()
        $(elc).addClass('curr').siblings().removeClass('curr')
        $('.tlists').find('.myTiku').hide()
        $('.tlists').find('.myTiku').eq(ind).show()
        if (ind == 1) {
          this.isMytiku = false
          this.istesttiku = true
        }
        else {
          this.isMytiku = true
          this.istesttiku = false
        }
      },
      confirm() {
        $('.alterOuter').find('.alterBody').eq(3).hide()
      },
      goBack() {
        this.$router.push({path: '/questionStorage/questionTest'})
      },
      goInput() {
        $('.stepnum').show()
        $('.chooseT').hide()
        this.isBack = true
        this.isInput = false
      },
      deleteCurr(event, delei, baseC) {
        let elc = event.currentTarget
        let delearr = this.addTests

        $.each(delearr, function (i, ele) {
          if (delei == i + 1) {
            delearr.splice(i, 1)
          }
        })
        $.each(delearr, function (m, eles) {
          eles.sout = m + 1
        })
        this.addTests = delearr

        this.checkhas()
        this.isBegin = false
        this.isError = true

        let mObj = $('.tikulists').find('li')
        $.each(mObj, function (i, ele) {
          if (mObj.eq(i).attr('id') == baseC) {
            mObj.eq(i).find('a.cancle').hide().prev().show()
          }
        })
        $('.alltests').find('.teslist').hide()
        $('.alltests').find('.teslist').eq(0).show()
      },
      beginTest(type) {

        //this.fullScreen()

        $('.loading').show()
        let self = this
        let sendData = {
          "teacherCode": this.data.localData.userId
        }


        this.$ajax.getKezhongtlist(sendData)
          .then((res) => {

          console.log(res)
            if (res.httpCode == 200) {

              let arr = res.result.rows
              $.each(arr, function (i, ele) {
                if (ele.status == 1) {
                  self.noneName = ele.inClassTestName
                }
              })
              $('.loading').hide()
              if (this.noneName == '') {
                this.localData.set('baseinfo', {
                  'inClassTestCode': this.data.saveCode,
                  'classCode': this.nClasscode,
                  'className': this.nClassname
                })

                if (type == 1) {
                  $('.alterOuter').show().find('.alterBody').eq(2).show()
                }
                else {
                  //$('.alterOuter').show().find('.alterBody').eq(5).show()
                  this.localData.set('testName', this.input)
                  this.localData.set('equipmentType', 3)
                  let spnum = {
                    'id': 1,
                    'tn': ''
                  }
                  this.$router.push({path: '/main/testPaperInfo', query: spnum})
                }
              }
              else {
                $('.alterOuter').show().find('.alterBody').eq(4).show()
              }
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
      overdevice(event) {
        let elc = event.currentTarget
        $(elc).find('div').show()
      },
      outdevice(event) {
        let elc = event.currentTarget
        $(elc).find('div').hide()
      },
      chooseTestrank(orig, now) {
        let arr = this.addTests;
        var arrnew = [];
        for (var j = 0; j < arr.length; j++) {
          if (j != orig - 1) {
            arrnew.push(arr[j]);
          }
        }
        arrnew.splice(now - 1, 0, arr[orig - 1])

        $.each(arrnew, function (m, eles) {
          eles.sout = m + 1
        })
        this.addTests = arrnew
        this.totalTests = []
        this.totalTests.push(arrnew)

        if (orig == now) {
          this.checkhas()
          this.isBegin = false
          this.isError = true
        }
        this.checkhas()
        $('.alltests').find('.teslist').hide()
        $('.alltests').find('.teslist').eq(0).show()
        $('.showTonum').hide()

      },
      rullRankover(event) {
        let elc = event.currentTarget
        let arr = this.addTests
        $(elc).find('.showTonum').show()
      },
      rullRankout(event) {
        let elc = event.currentTarget
        let arr = this.addTests
        $(elc).find('.showTonum').hide()
      },
      getRank() {
        this.ranks = []
        let lens = this.addTests.length
        for (let i = 1; i <= lens; i++) {
          this.ranks.push(i)
        }
      },
      getTeachercla() {

        let sendData = {
          "userId": this.data.localData.userId
        }

        this.$ajax.getTeacherClass(sendData)
          .then((res) => {
            if (res.httpCode == 200) {
              this.options = res.result
              this.value = this.options[0].groupId
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      chooseTestti(event) {
        let elc = event.currentTarget

        if (this.input != '' && this.value != '') {
          let params = {
            "classCode": this.value,
            "inClassTestName": this.input,
            "teacherCode": this.data.localData.userId
          }
          this.$ajax.getCheckname(params).then((res) => {
            if (res.httpCode == 200) {
              this.questions = []
              this.totalTiku = []
              this.getQuestions()

              $(elc).parent().hide().next().show()
              this.isBack = false
              this.isInput = true
            }
            if (res.httpCode == 40007) {
              this.$message('测试名称已存在，请重新输入！');
            }
          })
        }
        else {
          this.$message('测试名称或者班级不能为空，请输入!');
        }
      },
      getQuestions() {
        let self = this

        let sendData = {
          'teacherCode': this.data.localData.userId
        }
        this.$ajax.getQuestiontest(sendData)
          .then((res) => {
            if (res.httpCode == 200) {
              let arrTotal = res.result.rows

              $.each(arrTotal, function (i, ele) {
                self.getQuestionlist(ele.questionBookName, ele.questionBookCode)
              })
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getQuestionlist(name, type) {
        let self = this
        let sendData = {
          'questionBookCode': type
        }
        this.$ajax.getQuestionlist(sendData)
          .then((res) => {

            if (res.httpCode == 200) {
              let quesarr = res.result.rows

              $.each(quesarr, function (i, ele) {
                if (typeof(ele.knowledges) == 'string') {
                  ele.knowledges = JSON.parse(ele.knowledges);
                }
//                if(ele.source == "1" || ele.source == "web"){//易教
                ele.questionOption = eval(self.strToUrl(ele.questionOption))
                ele.baseName = self.strToUrl(ele.baseName);
//                }else{
                ele.questionOption = eval(ele.questionOption);
//                }
              })

              this.totalTiku.push(quesarr)
              this.questions.push({
                'name': name.substr(0, 12)
              })

              $('.tikulists').find('.tidetail').eq(0).show()
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getQuestionT(event, type) {
        let elc = event.currentTarget
        $(elc).css('background', '#d3f2e5').siblings().css('background', '#fff')
        $('.tikulists').find('.tidetail').eq($(elc).index()).show().siblings().hide()
      },
      addTest(event, title, answer, baseC, bookN) {

        let elc = event.currentTarget
        $(elc).hide().next().css('display', 'block')
        $('a.checkhas').find('span.cholen').show().next().hide()

        this.addTests.push({
          'questionBookName': bookN,
          'baseName': title,
          'questionOption': answer,
          'baseCode': baseC,
          'sout': this.addTests.length + 1,
          'titlename': '全部'
        })

        $.each(this.addTests, function (m, eles) {
          eles.sout = m + 1
        })

        this.totalTests = []
        this.totalTests.push(this.addTests)
        this.chooselens = '（' + this.addTests.length + '）'

        this.isBegin = false
        this.isError = true
      },
      cancleTest(event, title, baseC) {
        let elc = event.currentTarget
        let arr = this.addTests
        let newstr = []

        $(elc).hide().prev().css('display', 'block')
        $.each(arr, function (ele, i) {
          if (i.baseName != title) {
            newstr.push(i)
          }
        })

        this.addTests = newstr
        $.each(this.addTests, function (m, eles) {
          eles.sout = m + 1
        })
        this.chooselens = '（' + this.addTests.length + '）'
        this.isBegin = false
        this.isError = true

        this.isCancle = true
        this.canCode = baseC
      },
      slideCurrstatus(event, tiname) {
        let elc = event.currentTarget
        let ind = $(elc).index()
        $(elc).addClass('curr').siblings().removeClass('curr')

        let ulobj = $('.alltests').find('.teslist')
        if (ind == 0) {
          $('.alltests').find('.teslist').hide()
          $('.alltests').find('.teslist').eq(0).show()
        }
        else {
          for (let i = 1; i < ulobj.length; i++) {
            if (ulobj.eq(i).attr('id') == tiname) {
              ulobj.eq(i).show().siblings().hide()
            }
          }
        }
      },
      checkhas() {
        let self = this
        this.chooselens = '（' + this.addTests.length + '）'

        if (this.addTests.length != 0) {
          let map = {}
          let classArr = this.addTests
          let arrse = []
          let newarr =
            [
              {
                'title': '全部',
                'arr': this.addTests
              }
            ]

          if (this.isCancle == true) {
            let newTe = $('.alltests').find('.teslist').eq(0).find('li')
            $.each(newTe, function (k, eleck) {
              if (newTe.eq(k).attr('id') == self.canCode) {
                newTe.eq(k).remove()
              }
            })
            this.isCancle == false
          }

          $('.alterOuter').show().find('div:first-child').show()
          $('.alltests').find('.teslist').eq(0).show()
          this.getRank()

          for (let i = 0; i < classArr.length; i++) {
            if (map[classArr[i].questionBookName]) {
              map[classArr[i].questionBookName].push(classArr[i]);
            } else {
              map[classArr[i].questionBookName] = [];
              map[classArr[i].questionBookName].push(classArr[i]);
            }
          }
          for (let obj in  map) {
            newarr.push({
              'title': obj,
              'arr': map[obj]
            });
            this.totalTests.push(map[obj])
          }
          this.checkedtitles = newarr

          $('.chonav').find('a').eq(0).addClass('curr').siblings().removeClass('curr')
        }
        else {
          this.$message('您还未选择测试题！')

          $('a.checkhas').find('span.cholen').hide().next().show()
          $('.alterOuter').hide().find('div:first-child').hide()
          $('.alltests').find('.teslist').eq(0).hide()
        }
      },
      cancle() {
        $('.alterOuter').hide().find('.alterBody').hide()
      },
      beginDevice(type) {
        this.localData.set('testName', this.input)
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
            this.$router.push({path: '/main/testPaperInfo', query: spnum})
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
              //this.localData.set('Currsout',1)
              let spnum = {
                'id': 1,
                'tn': ''
              }
              this.$router.push({path: '/main/classroomTest', query: spnum})

            } else {
              $('.alterOuter').find('.alterBody').eq(3).show()
            }
          })
      },
      closeW(event) {
        let elc = event.currentTarget
        $(elc).parents('.alterBody').hide().parent().hide()
      },
      saveTestinfo() {
        let listarr = []
        let addarr = this.addTests
        let self = this
        let optarr = this.options

        $.each(optarr, function (i, ele) {
          if (ele.groupId == self.value) {
            self.opcode = ele.groupName

            self.nClasscode = ele.groupId
            self.nClassname = ele.groupName
          }
        })
        let params = {
          'classCode': this.value,
          'className': this.opcode,
          'teacherCode': this.data.localData.userId,
          'teacherName': this.data.localData.userName,
          'gradeCode': this.data.localData.userGradeIden,
          'inClassTestName': this.input,
          'subjectCode': this.data.localData.userSubject,
        }
        $.each(addarr, function (i, ele) {
          listarr.push({
            'baseCode': ele.baseCode,
            'sout': ele.sout
          })
        })
        params.list = addarr

        this.$ajax.getclassTestSave(params)
          .then((res) => {

            if (res.httpCode == 200) {
              this.isBegin = true
              this.isError = false
              this.localData.set('saveCode', res.result)
            }
            if (res.httpCode == 40007) {
              this.$message('测试名称已存在！')
            }
            if (res.httpCode == 40002) {
              this.$message('请选择测试题！')
            }
            else {
              //this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })

      },
      sendVal(evl) {

      },
      savePaperinfo() {
        let self = this
        let optarr = this.options

        $.each(optarr, function (i, ele) {
          if (ele.groupId == self.value) {
            self.opcode = ele.groupName
            self.nClasscode = ele.groupId
            self.nClassname = ele.groupName
          }
        })
        let params = {
          'classCode': this.value,
          'className': this.opcode,
          'teacherCode': this.data.localData.userId,
          'teacherName': this.data.localData.userName,
          'gradeCode': this.data.localData.userGradeIden,
          'inClassTestName': this.input,
          'subjectCode': this.data.localData.userSubject,
          "source": 2,
          "paperCode": this.localData.get('paperCode'),
          'questionCount': this.localData.get('questionCount')
        }

        this.$ajax.getTestPaperSave(params).then((res) => {

          if (res.httpCode == 200) {
            this.isTestBegin = true
            this.isTestError = false
            this.localData.set('saveCode', res.result.inClassTestCode)
            this.localData.set('record', res.result.recordNumber)
          }
          if (res.httpCode == 40007) {
            this.$message('测试名称已存在！')
          }
          if (res.httpCode == 40002) {
            this.$message('请选择测试题！')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .stepnum{
    input{
      font-size:60px;
      height: 100px;
      line-height: 100px;
      border-radius: 8px;
    }
  }
  .el-select-dropdown{
    li{
      height: 82px;
      line-height: 20px;
      span{
        font-size:40px;
      }
    }


  }
</style>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';
  @import "../../../static/css/findselected";

  .lef {
    float: left;
  }

  .rig {
    float: right;
  }

  .back {
    background: #fff;
  }

  .fos {
    font-size: 18px;
  }

  .hei {
    height: 40px;
    line-height: 40px;
  }

  h2, h3 {
    font-weight: normal;
  }

  a {
    cursor: pointer;
  }

  $color: #1fd094;
  .let {
    letter-spacing: .6px;
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

  .header {
    overflow: hidden;
    margin: 20px 18px;
    box-sizing: border-box;
    padding: 25px 40px;
    @extend .back;
    color: #4c6175;
    span {
      font-size: 18px;
      @extend .lef;
      @extend .hei;
      label:last-child {
        color: #1fd094;
      }
    }
    a {
      @extend .lef;
      background: url('../../../static/img/arrle.png') no-repeat left center;
      width: 19px;
      height: 40px;
      margin-right: 18px;
    }
  }

  .tikulists {
    height: 100%;
  }

  .newContent {
    @extend .back;
    height: 85%;
    margin: 30px 18px 0 18px;
    .stepnum {
      width: 900px;
      margin: 0 auto;

      a {
        cursor: pointer;
        width: 340px;
        @extend .hei;
        background: #1fd094;
        color: #fff;
        display: block;
        border-radius: 50px;
        margin: 0 auto;
        font-size:60px;
        height: 90px;
        line-height: 90px;
      }
    }
  }

  .tiku {
    @extend .fos;
    border-bottom: 1px solid #e1e5ec;
    padding: 13px 48px 13px 40px;
    h3 {
      @extend .lef;
      @extend .fos;
      @extend .hei;
      @extend .let;
      a {
        color: #999;
        margin-right: 40px;
        &.curr {
          color: $color;
        }
      }
    }
    p {
      @extend .rig;
      @extend .hei;
      overflow: hidden;
      a {
        @extend .lef;
        width: 140px;
        border-radius: 20px;
        margin-left: 58px;
        @extend .let;
        span {
          color: $color;
        }
      }
      a:nth-child(2) {
        background: #d3f2e5;
      }
      a:last-child {
        background: #ddd;
        color: #fff;
      }
    }

  }

  .chooseT {
    height: 92%;
  }

  .tlists {
    height: 100%;
  }

  .letil {
    @extend .lef;
    width: 270px;
    border-right: 1px solid #e1e5ec;
    height: 100%;

    a {
      display: block;
      height: 50px;
      line-height: 50px;
      padding-left: 59px;
      text-align: left;
      position: relative;
      color: #505050;
      &:first-child {
        background: #d3f2e5;
      }
      &:before {
        content: '';
        position: absolute;
        left: 39px;
        top: 20px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: $color;
      }
    }
  }

  .tidetail {
    overflow-Y: scroll;
    height: 100%;

    li {
      padding: 34px 0;
      text-align: left;
      border-top: 5px solid #f0f4fb;
      overflow: hidden;
      &:first-child {
        border-top: none;
      }
    }
    .tinum {
      @extend .lef;
      width: 48%;
      margin-left: 37px;

      h3 {
        @extend .fos;
        margin-bottom: 8px;
        word-break: break-all;
      }
      p {
        padding-left: 28px;
        * {
          display: inline-block;
        }
      }

    }
    .acknow {
      @extend .rig;
      width: 38%;
      margin-right: 0;
    }
  }

  .acknow {
    span {
      @extend .lef;
      height: 30px;
      line-height: 30px;
      background: #d3f2e5;
      padding: 0 16px;
      margin: 0 10px 10px 0;
      border-radius: 20px;
    }
    a {
      display: block;
      clear: both;
      @extend .hei;
      width: 140px;
      background: $color;
      color: #fff;
      font-size: 18px;
      text-align: center;
      border-radius: 20px;
      margin: 90px auto 0 auto;
      @extend .let;
      &.cancle {
        background: #f66;
        display: none;
      }
    }
  }

  .operaB {
    text-align: right;
    position: relative;
    > a, span, .hoRank {
      @extend .hei;
      width: 140px;
      display: inline-block;
      text-align: center;
      color: #fff;
      border-radius: 20px;
      letter-spacing: .5px;
    }
    > a {

      background: #f66;
      margin-left: 40px;
    }

    .hoRank {
      position: absolute;
      right: 185px;
      top: 0;
      height: 50px;
      span {
        position: absolute;
        right: 0;
        top: 0;
        background: $color;
        z-index: 20;
      }
      .showTonum {
        display: none;
        position: absolute;
        width: 140px;
        right: 0;
        top: 50px;
        text-align: center;
        box-shadow: 0 0 15px #d7dce2;
        border-radius: 2px;
        z-index: 500;
        background: #fff;
        a {
          display: block;
          font-size: 16px;
          color: #505050;

          height: 30px;
          line-height: 30px;
          &:hover {
            background: #d3f2e5;
          }
        }
      }
    }
  }

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

  .myTiku {
    height: 100%;
  }

  @media (max-height: 768px) {
    .alterOuter {
      .fintest {
        width: 600px;
        margin-left: -300px;
        height: 400px;
        margin-top: -200px;
      }
      .alterBody {
        .scrohei {
          height: 333px;
        }
      }
    }
  }


</style>
<style lang="scss">
  .newTest20171103 {
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

  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    background: url('../../../static/img/loading.gif') no-repeat;
    background-size: 100% 100%;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
  }
</style>

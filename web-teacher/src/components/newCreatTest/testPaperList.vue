<template>
  <div class="" style="height: 100%;">
    <div class="letil">
      <div class="treeView">
        <el-tree
          :data="treeData"
          :load="loadNode1"
          @node-click="nodeClick"
          lazy
        >
        </el-tree>

      </div>

      <ul class="paperList">
        <li v-for="(pa,index) in paperdetail">
          <h3 v-html="index+1 + '、'+ pa.stem"></h3>
          <template v-show="pa.componentQuestions.length==0">
            <p v-for="que in pa.quesOption" v-html="que.optionKey + '、' + que.optionValue"></p>
          </template>
          <template v-show="pa.componentQuestions.length!=0">
            <template v-for="(comp,ind) in pa.componentQuestions">
              <h3 v-html="comp.stem" style="text-indent: 15px"></h3>
              <p v-for="cod in comp.quesOption" v-html="cod.optionKey +'、' + cod.optionValue"></p>
            </template>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import $ from '../../../static/js/jquery-3.2.1.min.js'

  export default {
    components: {},
    data() {
      return {
        treeData: [],

        data: {
          localData: null,
        },
        materialVersion: '',
        versionCode: '',
        paperlists: [],
        paperdetail: [],
        childItems: [],
        unitstas: [],
        code: '0'

      }
    },


    mounted() {
      this.data.localData = this.localData.get("webTeacherUser");
      $('.paperList').width($(document).width() - 913)
      this.getMaterialType();


    },
    methods: {
      loadNode1(node, resolve) {
        if (node.level === 0) {
          return resolve([]);
        }
        let code = node.data.data.code;

        function addChild(result, flag) {
          if (Array.isArray(result)) {
            return resolve(
              result.map(item => ({
                label: item.name.substr(0,100),
                data: item,
                isLeaf: flag,

              }))
            );
          }
          return resolve([]);
        }
        if (node.level == 1) {
          this.getbookType(code, (result) => {
            addChild(result, true)
          })
        }
        //满足示例化树 三级结构
        else if (node.level == 2 && node.data.data.isleaf) {
          this.getTestDetail(code, (result) => {
            addChild(result, false)
          })
        }
        //满足示例化树 三级结构
        else if (node.level == 3 && !node.data.data.isleaf) {
          this.getpaperDetail(node.data.data.id, node.data);
          return resolve([]);
        }
        //满足示例化树 四级结构
        else if (node.level == 2 && !node.data.data.isleaf) {
          this.getbookType(code, (result) => {
            addChild(result, true)
          })
          }
        //满足示例化树 四级结构
        else if (node.level == 3 && node.data.data.isleaf) {
          this.getTestDetail(code, (result) => {
            addChild(result, false)
          })
        }
        //满足示例化树 四级结构
        else if (node.level == 4) {
            this.getpaperDetail(node.data.data.id, node.data);
            return resolve([]);
        }

      },
      nodeClick(data) {
        if (data.nextData) {
          this.paperdetail = data.nextData;
        }
      },
      getMaterialType() {
        let senData = {
          "gradeId": this.data.localData.userGradeIden,
          "subjectId": this.data.localData.userSubject,
          "schoolId": this.data.localData.userSchoolId,
        }
        this.$ajax.getmaterialVersion(senData)
          .then((res) => {
            if (res.httpCode == 200) {
              this.materialVersion = res.result.materialVersion;
              this.versionCode = res.result.versionCode;
              this.getbookType(0, (result) => {
                if (Array.isArray(result)) {
                  result.map(item => {
                    this.treeData.push({
                      label: item.name.substr(0,100),
                      data: item,
                      children: [],
                      isLeaf: true
                    })

                  })
                }
              })
            }
            else {
            }
          })
      },
      getbookType(code, fn) {
        let params = {
          "gradeCode": this.data.localData.userGradeIden,
          "subjectCode": this.data.localData.userSubject,
          "booktypeCode": this.versionCode,
          "productsIds": 'ff808081602a3ada01602af5d6bc000d',
          "code": code
        }
        this.$ajax.getbookTypeVersionAndUnit(params).then((res) => {
          if (res.httpCode == 200) {
            if (this.code == 0) {
              fn && fn(res.result);
            }
          }
        })
      },
      getTestDetail(code, fn) {

        let param = {
          'unitCode': code,
          "paperType": "p_056"
        }
        this.$ajax.getPaperByUnit(param).then((res) => {
          if (res.httpCode == 200) {
            fn && fn(res.result)
          }
        })
      },


      getpaperDetail(code, nodeData) {
        let params = {
          'paperCode': code
        }
        this.$ajax.getResourcePaper(params).then((res) => {
          if (res.httpCode == 200) {
            this.localData.set('paperCode', code)
            let newarr = []
            let arr = res.result.paperSystemQusetionType
            let num = 0
            for (let i in arr) {
              let arrPa = arr[i].typeList
              for (let j in arrPa) {
                let arrList = arrPa[j].list
                num = num + arrList.length
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
            this.localData.set('questionCount', num)
            this.paperdetail = newarr;
            nodeData.nextData = newarr;
          }
        })
      }
    }
  }
</script>
<style lang="scss">

  .el-tree {
    text-align: left;
    border: none;
    .el-tree-node__expand-icon {
      border: none;
      display: inline-block;
      margin:0 0 0 40px;
      background: url(../../../static/img/folder.png) no-repeat;
      width: 20px;
      height: 20px;
    }
    .el-tree-node__expand-icon.expanded {
      transform: rotate(0);
    }
    .el-tree-node__expand-icon.is-leaf {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1FD094;
    }
    .el-tree-node.is-current {
      & > .el-tree-node__content {
        background: #d3f2e5;


        /*.el-tree-node__label {*/
          /*white-space: nowrap;*/
          /*text-overflow: ellipsis;*/
          /*overflow: hidden;*/
          /*width: 250px;*/

        /*}*/


      }
    }
    .el-tree-node{
      .el-tree-node__label{
        font-size:22px;
        color:#505050;
        padding-left:10px;
      }
      & > .el-tree-node__content {
        height: 52px;
        line-height: 52px;
      }

    }





  }

</style>
<style lang="scss" scoped>
  $color: #1fd094;
  .myTiku {
    height: 100%;

  }

  .lef {
    float: left;
  }

  .letil {
    width: 100%;
    height: 100%;
    a, dd h3 {
      height: 50px;
      line-height: 50px;
    }
    dd h3 {
      font-weight: normal;
      font-size: 16px;
    }
    a {
      display: block;
      width: 100%;
      padding-left: 70px;
      text-align: left;
      position: relative;
      color: #505050;
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

  .tikulists {
    height: 100%;
  }

  .treeView {
    @extend .lef;
    width: 520px;
    height: 100%;
    border-right: 1px solid #e1e5ec;
    li {
      cursor: pointer;
      * {
        &.curr {
          background-color: #d3f2e5;
        }
      }
      > a {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAABmElEQVQ4jeWTPWsUURSGn3PvmZmNO7uJ0WyCEkgjiOAfEAvBwl4txMLKQrCzyR/wD4iVaGEj+BOsBQuXVBYWaYQk5MNV/Nhdzc7OnGOxiAiZDWvr0x7eh3O555XO43tP2neu3h5/OABAGimS6tftK+s3/Meou7b5lHLnM5hRSxCS1SUO7j5CYyO7XJnnfSsmw/4hcXkhz188eDt8tXHry/beLs5UoRA4CYhIV62qPqrIhQVJJ1MF3x8Sz67QuX/95XjnE5JEkBqbAy5IliDzzXXtlQMuJad4du4aJYa5//UU2j4J1ZAGZW/0nZveZRCto2Zj2iiLzVZ96hgWsxwGRuXVUHNtsll94+Hum2mL1CICw2KEnRbmRNG5kNKzQ5733mEYU/7ySFQipRvp8hlSIlq5kUlkJZvH8Jm3jBIoqpJ9B8MJM+aP5T8UKkxKEEUQpt7wkUQJBPlTI5VUG66RcQD7B6GJUwKSKqIx0ySqVCdabOX9GVW/qUCEJLYI7oXo6tL5ZK1zsfw5srr+T8MBEZGYJF6833r9C6jgjzj1iDHgAAAAAElFTkSuQmCC);
        background-position: 40px 17px;
        background-repeat: no-repeat;
        &:before {
          background: none;
        }
      }
      .listnav {
        dd h3 {
          position: relative;
          text-align: left;
          text-indent: 86px;
          &:before {
            background: $color;
            content: '';
            position: absolute;
            left: 68px;
            top: 20px;
            width: 10px;
            height: 10px;
            border-radius: 100%;
          }
        }
        p {
          font-size: 14px;
          text-indent: 10px;
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px 0 75px;
        }
      }
    }
  }

  .paperList {
    @extend .lef;
    padding: 20px;
    width: 70%;
    height: 96%;
    overflow: hidden;
    overflow-y: scroll;
    text-align: left;
    h3 {
      font-weight: normal;
      margin: 25px 0 20px 0;
      font-size:30px;
      img {
        vertical-align: middle !important;
      }
    }
    p {
      margin-bottom: 10px;
      text-indent: 37px;
      font-size:30px;
    }

  }


</style>

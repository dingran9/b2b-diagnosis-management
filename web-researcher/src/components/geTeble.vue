<template>
  <div class="ge-table-wrap" ref="wrap">
    <div class="ge-table" :style="{width:tableWidth}">
      <div class="ge-table-header">
        <div class="ge-table-cell ge-tebel-header-cell"
             :style="cellCommonStyle"
             v-for="(title,index) in titleDataList">
          <slot name="header" :text="title.text">{{title.text}}</slot>
        </div>
      </div>
      <div class="ge-table-body">
        <div class="ge-table-body-col"
             v-for="colData in tableData">
          <div class="ge-table-cell ge-tebel-body-cell"
               :style="{width:cellWidth + 'px'}"
               v-for="(title,index) in titleDataList">
            <template v-if="type == 0 && colData.length">
              <div v-if="!title.children"
                   class="ge-table-sub-cell"
                   :title="colData[0][title.keyword]"
                   :style="computerHeight(colData)">
                <slot name="body"
                      :text="colData[0][title.keyword]"
                      :title="title"
                      :cellData="colData[0]">
                  {{colData[0][title.keyword]}}
                </slot>
              </div>
              <div
                v-else=""
                class="ge-table-sub-cell"
                v-for="cellData in colData"
                :style="heightStyle">
                <slot name="body"
                      :title="title"
                      :cellData="cellData"
                      :text="cellData[title.keyword]"
                >
                  {{cellData[title.keyword]}}
                </slot>
              </div>
            </template>
            <template v-else-if="type == 1">
              <div
                class="ge-table-sub-cell"
                :title="colData[title.keyword]"
                :style="heightStyle">
                <slot name="body"
                      :title="title"
                      :cellData="colData"
                      :text="colData[title.keyword]"
                >
                  {{colData[title.keyword]}}
                </slot>
              </div>
            </template>
          </div>
        </div>
        <div class="ge-table-body-col" v-if="!tableData.length">
          <div class="ge-table-cell ge-tebel-body-cell" :style="Object.assign({width:tableWidth},heightStyle)">
            暂无数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    creted() {
    },
    mounted() {
      this._setWidth();
    },
    data() {
      return {
        cellHeight: 50,
        wrapWidth: 0,
      };
    },
    computed: {
      heightStyle() {
        return {
          height: this.cellHeight + 'px',
          'line-height': this.cellHeight + 'px',
        }
      },
      cellCommonStyle() {
        return {
          width: this.cellWidth + 'px',
          height: this.cellHeight + 'px',
          'line-height': this.cellHeight + 'px',
        }
      },
      colNum() {
        return this.titleDataList.length;
      },
      cellWidth() {
        return Math.max((this.wrapWidth || 1200) / this.colNum, 120);
      },
      tableWidth() {
        return this.colNum * (this.cellWidth) + 1 + 'px';
      }
    },
    props: {
      tableData: {
        default() {
          return [[]]
        }
      },
      titleDataList: {
        default() {
          return [{text: '学校', keyword: 'school',},
            {text: '班级', keyword: 'grade', children: true},
            {text: '出勤率', keyword: 'school', children: true},
            {text: '平均作答时间( 分钟 )', keyword: 'school', children: true},
            {text: '平均作答率', keyword: 'school', children: true}]
        }
      },
      type: {
        default: 0
      }
    },
    methods: {
      computerHeight(colData) {
        let h = colData.length * this.cellHeight + 'px';
        return {
          height: h,
          'line-height': h,
        }
      },
      _setWidth() {
        this.timer = setTimeout(() => {
          this.wrapWidth = this.$refs.wrap.clientWidth - 2;
          this._setWidth();
        }, 100)
      }
    },
    filters: {},
    beforeDestroy() {
      clearTimeout(this.timer);
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../static/css/commonVariable.scss";

  %last_no_border {
    border-bottom: 1px solid #fff;
    &:last-child {
      border-bottom: 0 none;
    }
  }

  .ge-table-wrap {
    overflow: auto;
    .ge-table {
      font-size: 0px;
      text-align: center;
      .ge-table-header {
        .ge-tebel-header-cell {
          color: #fff;
          background: $table_head_bg;
        }
      }
      .ge-table-body {
        .ge-table-body-col {
          @extend %last_no_border;
          &:nth-of-type(2n) {
            .ge-tebel-body-cell {
              background: $table_body_second_bg;
            }
          }
          .ge-tebel-body-cell {
            background: $table_body_first_bg;
          }
        }

      }
      .ge-table-cell {
        min-width: 120px;
        display: inline-block;
        font-size: 18px;
        border-right: 1px solid #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis; /*文字隐藏后添加省略号*/
        white-space: nowrap; /*强制不换行*/
        -ms-text-overflow: ellipsis;
        &:last-child {
          border-right: 0 none;
        }
      }
      .ge-table-sub-cell {
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis; /*文字隐藏后添加省略号*/
        white-space: nowrap; /*强制不换行*/
        -ms-text-overflow: ellipsis;
        @extend %last_no_border;
      }
    }
  }

</style>
<style lang="scss">

</style>

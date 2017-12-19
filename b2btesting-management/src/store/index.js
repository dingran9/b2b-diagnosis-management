import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex);
Vue.use(VueResource);

const state = {
  examPush_grondRadio: '', //校长_考试推送年级
  examPush_paperListData: [], //校长_考试推送试卷列表
  paperFormFilter_data: {      //试卷组卷,筛选条件组件数据,目前值用到了showFlog这个属性,
    options: [
      {
        value: '1',
        label: '小学'
      }, {
        value: '2',
        label: '初中'
      }, {
        value: '3',
        label: '高中'
      }
    ],
    provinceResult: [],
    cityResult: [],
    districtResult: [],
    provinceValue: '',
    cityValue: '',
    districtValue: '',
    groupPeriod: [],
    schoolValue: '',
    schoolList: [],
    groundCode: [],
    grondRadio: '',
    topFloor: '',
    showFlog: ''
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})

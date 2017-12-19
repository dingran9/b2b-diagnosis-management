import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


export default new Vuex.Store({
  state:{
    loading:false
  },
  modules:{
    module1:{
      state:{
        loading:112
      }
    }
  }
})

webpackJsonp([4],{"1bJ7":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"chart",staticClass:"hchart",staticStyle:{margin:"auto"}})},r=[],o={render:a,staticRenderFns:r};e.a=o},"4LUm":function(t,e,n){var a=n("p6yC");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("6ef82e90",a,!0)},"7Nks":function(t,e,n){"use strict";e.a={"Unit 3":{chuqin:[{segment:"北京市东直门中学",peopleCount:1,percentage:98,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:88,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:95,sn:3}],pingjunzuoda:[{segment:"北京市东直门中学",peopleCount:1,percentage:22,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:17,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:18,sn:3}],zuodalv:[{segment:"北京市东直门中学",peopleCount:1,percentage:92,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:84,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:90,sn:3}]},"Unit 2":{chuqin:[{segment:"北京市东直门中学",peopleCount:1,percentage:98,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:88,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:95,sn:3}],pingjunzuoda:[{segment:"北京市东直门中学",peopleCount:1,percentage:22,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:17,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:15,sn:3}],zuodalv:[{segment:"北京市东直门中学",peopleCount:1,percentage:92,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:84,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:90,sn:3}]},"期中测试":{chuqin:[{segment:"北京市东直门中学",peopleCount:1,percentage:98,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:96,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:98,sn:3}],pingjunzuoda:[{segment:"北京市东直门中学",peopleCount:1,percentage:21,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:19,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:22,sn:3}],zuodalv:[{segment:"北京市东直门中学",peopleCount:1,percentage:96,sn:1},{segment:"北京第二十五中学",peopleCount:1,percentage:91,sn:2},{segment:"北京汇文中学",peopleCount:1,percentage:97,sn:3}]}}},"7b5Y":function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,"",""])},"9FSI":function(t,e,n){"use strict";function a(t){n("iDkg"),n("UN0v")}var r=n("ODxl"),o=n("1bJ7"),s=n("VU/8"),i=a,c=s(r.a,o.a,i,"data-v-18975bbe",null);e.a=c.exports},"9ZrK":function(t,e,n){"use strict";var a=["#ff7878","#ffb955","#ffdf00","#7d97ba","#88c6d8","#4dbebf","#2fc2a5","#86df4c","#50d88f","#44b773"];e.a={components:{},props:{chartData:{default:function(){return[]}},title:{}},creted:function(){},mounted:function(){this.init()},data:function(){return{chart:null}},methods:{init:function(){var t=this.getData(),e=t.data,n=t.categories,a=[{borderRadius:13,pointWidth:30,name:" ",data:e}];this.chart=Highcharts.chart(this.$refs.chart,{chart:{type:"column",plotBorderWidth:2,plotBorderColor:"rgba(127, 190, 208, 1)",width:800,height:400},credits:{enabled:!1},title:{text:this.title},subtitle:{text:"本次考试30分钟"},legend:{enabled:!1},xAxis:{categories:n,crosshair:!0,title:{text:""}},yAxis:{min:0,max:30,title:{text:"平均答题时间 (分钟)"}},tooltip:{headerFormat:'<span style="font-size:10px">{point.key}</span><table>',pointFormat:'<tr><td style="padding:0"><b>{point.y:.1f} 分钟</b></td></tr>',footerFormat:"</table>",shared:!0,useHTML:!0},plotOptions:{column:{pointPadding:.2,borderWidth:0},series:{dataLabels:{enabled:!0,format:" {y} 分钟"}}},series:a})},getData:function(){return{data:function(t){return t.map(function(t,e){return{y:t,color:a[e%a.length]}})}(this.chartData.map(function(t){return t.percentage})),categories:this.chartData.map(function(t){return t.segment})}}},computed:{},watch:{chartData:{deep:!0,handler:function(t){var e=this.getData();this.chart.update({series:[{data:e.data}],xAxis:{categories:e.categories}})}}},filters:{}}},Bngc:function(t,e,n){var a=n("HAH2");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("3db43f64",a,!0)},FiQ5:function(t,e,n){var a=n("7b5Y");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("bea79336",a,!0)},H29f:function(t,e,n){"use strict";function a(t){n("J6sX"),n("FiQ5")}Object.defineProperty(e,"__esModule",{value:!0});var r=n("wKEv"),o=n("r3xy"),s=n("VU/8"),i=a,c=s(r.a,o.a,i,"data-v-eb95da9c",null);e.default=c.exports},HAH2:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,"",""])},J6sX:function(t,e,n){var a=n("esUN");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("42a7649f",a,!0)},ODxl:function(t,e,n){"use strict";var a=["#ff7878","#ffb955","#ffdf00","#7d97ba","#88c6d8","#4dbebf","#2fc2a5","#86df4c","#50d88f","#44b773"];e.a={components:{},props:{chartData:{default:function(){return[]}},title:{}},creted:function(){},mounted:function(){this.init()},data:function(){return{chart:null}},methods:{init:function(){var t=this.getData(),e=t.data,n=t.categories,a=[{borderRadius:13,pointWidth:30,name:" ",data:e}];this.chart=Highcharts.chart(this.$refs.chart,{chart:{type:"column",plotBorderWidth:2,plotBorderColor:"rgba(127, 190, 208, 1)",width:800,height:400},credits:{enabled:!1},title:{text:this.title},legend:{enabled:!1},xAxis:{categories:n,crosshair:!0,title:{text:""}},yAxis:{min:0,max:100,title:{text:"人数占比 (%)"}},tooltip:{headerFormat:'<span style="font-size:10px">{point.key}</span><table>',pointFormat:'<tr><td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',footerFormat:"</table>",shared:!0,useHTML:!0},plotOptions:{column:{pointPadding:.2,borderWidth:0},series:{dataLabels:{enabled:!0,format:" {y} %"}}},series:a})},getData:function(){return{data:function(t){return t.map(function(t,e){return{y:t,color:a[e%a.length]}})}(this.chartData.map(function(t){return t.percentage})),categories:this.chartData.map(function(t){return t.segment})}}},computed:{},watch:{chartData:{deep:!0,handler:function(t){var e=this.getData();this.chart.update({series:[{data:e.data}],xAxis:{categories:e.categories}})}}},filters:{}}},Pk8G:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,"",""])},UN0v:function(t,e,n){var a=n("uFQQ");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("693ec3ae",a,!0)},VgJn:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"chart",staticClass:"hchart",staticStyle:{margin:"auto"}})},r=[],o={render:a,staticRenderFns:r};e.a=o},ZBzd:function(t,e,n){"use strict";function a(t){n("Bngc"),n("4LUm")}var r=n("9ZrK"),o=n("VgJn"),s=n("VU/8"),i=a,c=s(r.a,o.a,i,"data-v-401d9b71",null);e.a=c.exports},esUN:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,"",""])},iDkg:function(t,e,n){var a=n("Pk8G");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("4043ccc4",a,!0)},p6yC:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,".hchart>div{margin:auto}",""])},r3xy:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{"background-color":"#fff",padding:"30px 20px"}},[n("chart",{attrs:{"chart-data":t.fake.chuqin,title:"出勤率"}}),t._v(" "),n("time-chart",{attrs:{"chart-data":t.fake.pingjunzuoda,title:"平均作答时间(分钟)"}}),t._v(" "),n("chart",{attrs:{"chart-data":t.fake.zuodalv,title:"平均作答率"}})],1)},r=[],o={render:a,staticRenderFns:r};e.a=o},uFQQ:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,".hchart>div{margin:auto}",""])},wKEv:function(t,e,n){"use strict";var a=n("7Nks"),r=n("9FSI"),o=n("ZBzd");e.a={components:{Chart:r.a,TimeChart:o.a},props:{},created:function(){this.fake=a.a[this.localData.get("tempUnit").name]},mounted:function(){},data:function(){return{fake:a.a}},methods:{},computed:{},filters:{}}}});
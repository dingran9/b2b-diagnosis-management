import axios from 'axios'

export default (rootUrl) => ({
  //获取学生试卷答题情况
  getStudentQuestionDetail(send) {
    return axios.post(rootUrl + 'class/test/questionDetails', send)
  },
  getStudentQuestionDetail2(send) {
    return axios.post(rootUrl + 'class/test/getPaperAndAnswerResult', send)
  },
})

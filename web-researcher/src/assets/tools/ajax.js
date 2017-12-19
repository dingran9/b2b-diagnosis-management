import axios from 'axios';
import {localData, $user} from './index';
import {$copy} from "../vueexport";

const commonSend = () => {
  //单元测
  let user = $user().get();
  // console.log(user);
  if (localData.get('reportType') == 1) {
    let unit = localData.get('unit') || {};
    // console.log(unit);
    return {
      "unitCode": unit.unit,
      "districtId": user.userGroupAreaDistrictId,
      "semester": unit.year + '' + unit.xueqiType,
      "gradeCode": unit.grond,
      'subjectCode': user.userSubject || 2,
      "unitModels":unit.unitModels
    };
  }
  let all = localData.get('allArea') || {};
  // console.log(all);
  return {
    "releaseCode": all.code,
    "districtId": user.userGroupAreaDistrictId,
    "semester": all.year + '' + all.xueqi,
    "gradeCode": all.grond,
    'subjectCode': user.userSubject || localData.get('reportSubject'),
  };
}

export default {
  //获取试卷列表
  getPaperByUnit(send) {
    let demoSend = {
      "pageNum": 1,
      "pageSize": 1000,
    };
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), {'code': 'releaseCode'}, 'subjectCode'));
      return axios.post('teacher/diagnosis/getExamPaperByParameter', Object.assign(demoSend, send))
    }
    Object.assign(demoSend, $copy(commonSend(), 'unitCode'));
    return axios.post('manager/teacher/getDiagnosisPaperByPaper', Object.assign(demoSend, send || {}))
  },
  //  区域考列表接口
  areaExamList(send) {
    let demoSend = {
      "pageNum": 1,
      "examScope": 4,
      "pageSize": 10000,
    };
    Object.assign(demoSend, $copy(commonSend(), {groupAreaDistrictId: 'districtId'}, {examYear: 'semester'}, 'gradeCode', 'subjectCode'));
    return axios.post('teacher/diagnosis/areaExamList', Object.assign(demoSend, send || {}))
  },
  //单元能力结构分析
  getStageAbility(send) {
    let demoSend = {};
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', 'subjectCode'));
      return axios.post('stagereport/getStageAbility', Object.assign(demoSend, send || {}))
    } else {
      Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester', 'subjectCode'));
      return axios.post('researchreport/getUnitAbility', Object.assign(demoSend, send || {}))
    }
  },
  //知识点掌握情况
  getStageKnowledgeModule(send) {
    let demoSend = {};
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode"));
      return axios.post('stagereport/getStageKnowledgeModule', Object.assign(demoSend, send || {}))
    } else {
      Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester'));
      return axios.post('researchreport/getUnitKnowledgeModule', Object.assign(demoSend, send || {}))
    }
  },
  //获取教学成绩
  getStageTeachineAchievement(send) {
    let demoSend = {};
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode", "gradeCode"));
      return axios.post('stagereport/getStageTeachineAchievement', Object.assign(demoSend, send || {}))
    } else {
      Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester'));
      if (send.type == 3 || send.type == 4) {
        return axios.post('researchreport/getUnitTeachingAchievement', Object.assign(demoSend, send || {}))
      }else{
        Object.assign(demoSend, $copy(commonSend(), 'unitModels','gradeCode'));
        return axios.post('researchreport/getAreaUnitScore', Object.assign(demoSend, send || {}))
      }
    }
  },

  //单元测试题质量分析
  unitQualityofQuestionsReport(send) {
    let demoSend = {
      "paperCode": "21AB4BAF8EA24F2293ECB27F339C61F8"
    };
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode"));
      return axios.post('stagereport/stageQualityofQuestionsReport', Object.assign(demoSend, send || {}))
    } else {
      Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester'));
      return axios.post('researchreport/unitQualityofQuestionsReport', Object.assign(demoSend, send || {}))
    }
  },

  //学生参考情况
  unitAreaHappening(send) {
    let demoSend = {};
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode"));
      switch (send.type) {
        case 1:
          return axios.post('stagereport/stageAreaHappening', Object.assign(demoSend, send || {}));
        case 2:
          return axios.post('stagereport/stageAreaHappeningBySchool', Object.assign(demoSend, send || {}));
        case 3:
          return axios.post('stagereport/stageAreaHappeningByclass', Object.assign(demoSend, send || {}));
      }
    } else {
      Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester'));
      switch (send.type) {
        case 1:
          return axios.post('researchreport/unitAreaHappening', Object.assign(demoSend, send || {}));
        case 2:
          return axios.post('researchreport/unitAreaHappeningBySchool', Object.assign(demoSend, send || {}));
        case 3:
          return axios.post('researchreport/unitAreaHappeningByclass', Object.assign(demoSend, send || {}));
      }
    }


  },

  //教学进度
  teachingProgress(send) {
    let demoSend = {};
    Object.assign(demoSend, $copy(commonSend(), 'districtId', 'semester', 'gradeCode','unitModels'));
    switch (send.type) {
      case 1:
        return axios.post('researchreport/teachingProgressByArea', Object.assign(demoSend, send || {}));
      case 2:
        return axios.post('researchreport/teachingProgressBySchool', Object.assign(demoSend, send || {}));
      case 3:
        return axios.post('researchreport/teachingProgressByClass', Object.assign(demoSend, send || {}));
      case 4:
        return axios.post('researchreport/teachingProgressByTeacher', Object.assign(demoSend, send || {}));
    }

  },

  // 全区考教学进度
  stageTeachingProgressByArea(send) {
    let demoSend = {};
    Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode", "gradeCode"));
    return axios.post('stagereport/stageTeachingProgressByArea', Object.assign(demoSend, send || {}));
  },
  //学生成绩分布
  unitResultsDistribution(send) {
    let demoSend = {};
    if (localData.get('reportType') == 2) {
      Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', 'gradeCode','subjectCode'));
      switch (send.type) {
        case 1:
          return axios.post('stagereport/stageResultsDistribution', Object.assign(demoSend, send || {}));
        case 2:
          return axios.post('stagereport/stageResultsDistributionBySchool', Object.assign(demoSend, send || {}));
        case 3:
          return axios.post('stagereport/stageResultsDistributionByClass', Object.assign(demoSend, send || {}));
      }
      return axios.post('researchreport/unitResultsDistribution', Object.assign(demoSend, send || {}));

    }
    Object.assign(demoSend, $copy(commonSend(), 'unitCode', 'districtId', 'semester', 'gradeCode'));
    switch (send.type) {
      case 1:
        return axios.post('researchreport/unitResultsDistribution', Object.assign(demoSend, send || {}));
      case 2:
        return axios.post('researchreport/unitResultsDistributionBySchool', Object.assign(demoSend, send || {}));
      case 3:
        return axios.post('researchreport/unitResultsDistributionByClass', Object.assign(demoSend, send || {}));
    }
    return axios.post('researchreport/unitResultsDistribution', Object.assign(demoSend, send || {}));
  },

  //全区考标准分平均分变动
  getStandardScoreChange(send) {
    let demoSend = {};
    Object.assign(demoSend, $copy(commonSend(), 'releaseCode', 'districtId', 'semester', "subjectCode", "gradeCode"));
    return axios.post('stagereport/getStandardScoreChange', Object.assign(demoSend, send || {}));
  }

}

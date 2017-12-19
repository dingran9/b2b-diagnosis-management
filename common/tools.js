export var $regexp = ({
    isMobile: value => /^1[34578]\d{9}$/.test(value),
    isCode: value => /^\d{6}$/.test(value)
})
export var dataParse = (value) => {
    let time = new Date(parseInt(value));

    function minTen(num) {
        return num > 9 ? num : '0' + num;
    }

    return time.getFullYear() + "-" + minTen(time.getMonth() + 1) + "-" + minTen(time.getDate()) + " " + minTen(time.getHours()) + ":" + minTen(time.getMinutes());
}
export var localData = {
    get(name) {
        if (!name) return null;
        return JSON.parse(localStorage.getItem(name));
    },
    set(name, obj) {
        if (!name) return;
        localStorage.setItem(name, JSON.stringify(obj));
    },
    delete(name) {
        localStorage.removeItem(name);
    }
};
//会话缓存
export var sessionData = {
    get(name) {
        if (!name) return null;
        return JSON.parse(sessionStorage.getItem(name));
    },
    set(name, obj) {
        if (!name) return;
        sessionStorage.setItem(name, JSON.stringify(obj));
    },
    delete(name) {
        sessionStorage.removeItem(name);
    }
};

export var strToUrl = (str) => {
    if (!str || typeof str != "string") return "";
    str = str.toString();
    //如果已经是html格式  直接返回
    if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)) return str;
    return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function (w) {
        if (/mp3$/i.test(w)) {
            return '<audio src=' + w + ' controls />'
        } else {
            return '<img style=max-width:100%;vertical-align: middle;  src=' + w + ' />'
        }
    }).replace(/\n/g, '<br />').replace(/\\n/g, '<br />')
};

export var commonGrond = {
    '11': '一年级',
    '12': '二年级',
    '13': '三年级',
    '14': '四年级',
    '15': '五年级',
    '16': '六年级',
    '21': '七年级',
    '22': '八年级',
    '23': '九年级',
    '31': '高一',
    '32': '高二',
    '33': '高三',
    '24': '中考'
};

export var commonSubject = {
    '1': '语文',
    '2': '数学',
    '4': '物理',
    '3': '英语',
    '5': '化学',
    '6': '生物',
    '7': '历史',
    '8': '地理',
    '9': '政治',
    '10': '科学',
    '11': '信息技术',
    '12': '品德与生活',
    '13': '品德与社会',
    '14': '思想品德',
    '15': '心理学',
    '16': '习惯趣谈'
}


export const parseJSON = (str) => {
    try {
        return (eval("(" + str + ")"));
    } catch (e) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }
};
export const forEachQuestions = (paperData, cb, cb2, config = {}) => {
    Object.assign(config, {
        firstName: 'paperSystemQusetionType',
        secondName: 'typeList',
        thirdName: 'list',
        fourthName: 'componentQuestions'
    });
    try {
        paperData[config.firstName].map((questionCollection, indexOfQuestionCollection) => {
            questionCollection[config.secondName].map((questionType, indexOfQuestionType) => {
                questionType[config.thirdName].map((question, indexOfQuestion) => {
                    let indexWrap = {
                        firstIndex: indexOfQuestionCollection,
                        secondIndex: indexOfQuestionType,
                        thirdIndex: indexOfQuestion,
                    };
                    if (questionCollection.type != 6) {
                        cb && cb(question, questionCollection.type, indexWrap)
                    } else {
                        cb2 && cb2(question, questionCollection.type, indexWrap)
                        console.log(question);
                        question[config.fourthName].map((lolLevelQuestion, indexOfLolLevelQuestion) => {
                            indexWrap.fourthIndex = indexOfLolLevelQuestion;
                            cb && cb(lolLevelQuestion, questionCollection.type, indexWrap);
                        })
                    }
                })
            });

        })
    } catch (e) {
        console.log(e);
    } finally {
        return paperData;
    }
}

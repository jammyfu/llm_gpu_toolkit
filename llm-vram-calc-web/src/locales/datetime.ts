export const dateTimeLocale = {
  zh: {
    datePlaceholder: '选择出生日期',
    timePlaceholder: '选择出生时间',
    calculate: '排盘',
    title: '八字排盘系统',
    subtitle: '精准解析命理，智慧指引人生',
    baziInfo: '八字信息',
    dayunInfo: '大运信息',
    birthDateLabel: '出生日期',
    birthTimeLabel: '出生时间',
    genderLabel: '性别',
    male: '男',
    female: '女'
  },
  en: {
    datePlaceholder: 'Select Birth Date',
    timePlaceholder: 'Select Birth Time',
    calculate: 'Calculate',
    title: 'BaZi Calculator',
    subtitle: 'Precise Life Analysis',
    baziInfo: 'BaZi Information',
    dayunInfo: 'Life Cycles',
    birthDateLabel: 'Birth Date',
    birthTimeLabel: 'Birth Time',
    genderLabel: 'Gender',
    male: 'Male',
    female: 'Female'
  }
};

export type Locale = keyof typeof dateTimeLocale; 
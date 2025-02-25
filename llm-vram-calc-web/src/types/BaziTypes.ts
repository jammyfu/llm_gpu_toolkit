// 基本类型定义 - 从 .d.ts 文件移过来，并修正

export interface DaYunInfo {
  index: number;
  startYear: number;
  startAge: number;
  endYear?: number;
  endAge?: number; // 添加结束年龄
  ganZhi: string;
  gan: string;
  zhi: string;
  zhiSheng: number;
  xunKong: string | number;  // 支持两种类型
  shiShen: string;
  naYin: string;
  tenGod?: string;  // 添加十神属性
  lunarYearStart?: number;
  lunarYearEnd?: number;
}

export interface LiuNianInfo {
  year: number;
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string | number;
  hidden: {
    gan: string;
    type: string;
    shiShen: string;
  }[];
}

export interface LiuYueInfo {
  year: number;
  month: number;
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string | number;
  hidden: {
    gan: string;
    type: string;
    shiShen: string;
  }[];
}

export interface XiaoYunInfo {
  index: number;
  ganZhi: string;
  age: number;
  year: number;
  lunarYear: number;
}

export interface HiddenGanInfo {
  gan: string;
  type: string;
  shiShen: string;
}

export interface PillarInfo {
  gan: string;
  zhi: string;
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string;
  hidden: HiddenGanInfo[];
  tenGod?: string;   // 添加此属性
  wuXing?: string;   // 添加此属性
  diShi?: string;    // 添加此属性
}

export interface BaZiData {
  birth: {
    solar: {
      year: string;
      month: string;
      day: string;
      time: string;
    };
    lunar: {
      year: string;
      month: string;
      day: string;
      time: string;
    };
  };
  solarTerms: string;
  baziTitle: string;
  
  gender: '男' | '女';
  sect: 1 | 2;

  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo;
  ganZhi: string;
  riGan: string;
  dayun: string;
  daYun?: DaYunInfo[];
  startYun?: {
    year: number;
    month: number;
    day: number;
    age: string;
  };
  
  // 明确添加这些新属性
  liuNian?: LiuNianInfo[];
  liuYue?: LiuYueInfo[];
  xiaoYun?: XiaoYunInfo[];
  
  // 其他可能的属性
  daYunTitle?: string;
  liuNianTitle?: string;
  liuYueTitle?: string; 
  currentYun?: number;
} 
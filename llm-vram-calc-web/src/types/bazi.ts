export interface DaYun {
  period: number;
  ganZhi: string;
  startAge: number;
  startYear: number;
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
  riGan: string;
  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo;
  daYunTitle?: string;
  liuNianTitle?: string;
  liuYueTitle?: string;
  currentYun?: any;
  startYun?: {
    year: number;
    month: number;
    day: number;
  };
  daYun?: DaYunInfo[];
}

export interface HiddenGanInfo {
  gan: string;      // 藏干主字
  type: string;     // 气的类型
  shiShen: string;  // 十神
}

export interface PillarInfo {
  gan: string;
  zhi: string;
  tenGod: string;
  hidden: HiddenGanInfo[];  // 改为结构化数据
  naYin: string;
  xunKong: string;
  wuXing: string;
  diShi: string;
}

export interface DaYunInfo {
  period: number;
  ganZhi: string;
  startAge: number;
  startYear: number;
  tenGod: string;
  liuNian: LiuNianInfo[];
  naYin?: string;
  xunKong?: string;
}

interface LiuNianInfo {
  year: number;
  ganZhi: string;
} 
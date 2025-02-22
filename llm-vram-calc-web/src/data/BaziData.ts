// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BaZiData {
    birth: string;          // 出生日期（公历和阴历）
    solarTerms: string;     // 节气信息
    baziTitle: string;      // 八字标题（乾造/坤造/八字）
    riGan: string;          // 日干标题（元男/元女/日干）
    yearPillar: PillarInfo; // 年柱信息
    monthPillar: PillarInfo;
    dayPillar: PillarInfo;
    hourPillar: PillarInfo;
    daYunTitle?: string;    // 大运标题（可选）
    liuNianTitle?: string;  // 流年标题（可选）
    liuYueTitle?: string;   // 流月标题（可选）
    currentYun?: any;       // 当前运信息
    startYun?: {           // 起运时间
        year: number;
        month: number;
        day: number;
    };
    daYun?: DaYunInfo[];    // 大运信息
}

interface PillarInfo {
    gan: string;
    zhi: string;
    tenGod: string;
    hidden: string[];
}

interface DaYunInfo {
    startAge: number;
    startYear: number;
    tenGod: string;
    ganZhi: string;
    liuNian: LiuNianInfo[];
}

interface LiuNianInfo {
    year: number;
    ganZhi: string;
}
import { Lunar, Solar, EightChar, Yun, DaYun, LunarYear, LunarUtil } from 'lunar-typescript';
// 从新的类型文件导入
import { BaZiData, DaYunInfo, LiuNianInfo, LiuYueInfo, XiaoYunInfo, PillarInfo } from '../types/BaziTypes';

// 删除本地接口定义 (不再需要)

type EightCharMethod = {
  // 基础干支方法
  getYear: () => string;
  getMonth: () => string;
  getDay: () => string;
  getTime: () => string;
  
  // 天干方法
  getYearGan: () => string;
  getMonthGan: () => string;
  getDayGan: () => string;
  getTimeGan: () => string;
  
  // 地支方法
  getYearZhi: () => string;
  getMonthZhi: () => string;
  getDayZhi: () => string;
  getTimeZhi: () => string;
  
  // 十神方法
  getYearShiShenGan: () => string;
  getMonthShiShenGan: () => string;
  getDayShiShenGan: () => string;
  getTimeShiShenGan: () => string;
  
  // 藏干方法
  getYearHideGan: () => string[];
  getMonthHideGan: () => string[];
  getDayHideGan: () => string[];
  getTimeHideGan: () => string[];
  
  // 地支十神方法
  getYearShiShenZhi: () => string[];
  getMonthShiShenZhi: () => string[];
  getDayShiShenZhi: () => string[];
  getTimeShiShenZhi: () => string[];
  
  // 纳音方法
  getYearNaYin: () => string;
  getMonthNaYin: () => string;
  getDayNaYin: () => string;
  getTimeNaYin: () => string;
  
  // 五行方法
  getYearWuXing: () => string;
  getMonthWuXing: () => string;
  getDayWuXing: () => string;
  getTimeWuXing: () => string;
  
  // 旬空方法
  getYearXunKong: () => string;
  getMonthXunKong: () => string;
  getDayXunKong: () => string;
  getTimeXunKong: () => string;
  
  // 地势方法
  getYearDiShi: () => string;
  getMonthDiShi: () => string;
  getDayDiShi: () => string;
  getTimeDiShi: () => string;
};

interface PillarDetail {
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string;
  hidden: {
    gan: string;
    type: string;
    shiShen: string;
  }[];
}

export class BaZiUtil {
  private selectSect: number = 2; // 默认子时流派（晚子时算当天）

  /**
   * 设置子时流派
   * @param sect 2: 晚子时算当天, 1: 晚子时算明天
   */
  setSect(sect: number) {
    this.selectSect = sect;
  }

  /**
   * 核心排盘计算
   * @param lunar 阴历对象
   * @param solar 公历对象
   * @param gender 性别（1: 男, 0: 女, -1: 未指定）
   * @returns 排盘数据
   */
  public computeEightChar(lunar: Lunar, solar: Solar, gender: number, sect: number = 2): BaZiData {
    if (!lunar || !solar) {
      throw new Error('Invalid lunar or solar date');
    }

    console.log('Computing EightChar with:', {
      lunar: lunar.toString(),
      solar: solar.toString(),
      gender,
      sect
    });

    const bazi = lunar.getEightChar();
    if (!bazi) {
      throw new Error('Failed to create EightChar instance');
    }

    // 设置流派
    bazi.setSect(sect);
    
    console.log('EightChar instance:', {
      dayGan: bazi.getDayGan(),
      dayZhi: bazi.getDayZhi()
    });

    let currentYear: number,
      startYunSolar: Solar | undefined,
      daYun: DaYun[] = [],
      daYunSize: number = 0,
      currentYun: any = null;
    
    // 将这些变量声明在更高的作用域
    let startYunYear = 0;
    let startYunMonth = 0;
    let startYunDay = 0;
    let startAge = 0;

    if (gender !== -1) {
      const date = new Date();
      currentYear = date.getFullYear();
      const yun = bazi.getYun(sect);
      
      // 赋值给外部声明的变量
      startYunYear = yun.getStartYear();
      startYunMonth = yun.getStartMonth();
      startYunDay = yun.getStartDay();
      
      const birthYear = lunar.getYear();
      startAge = startYunYear - birthYear + 1;
      
      startYunSolar = yun.getStartSolar();
      daYun = yun.getDaYun();
      daYunSize = daYun.length;
      const currentLunar = Lunar.fromDate(date);

      const yZhi = currentLunar.getYearZhiByLiChun();
      const yHideGan = LunarUtil.ZHI_HIDE_GAN[yZhi];
      const yShiShenZhi = yHideGan.map(
        (h) => `${h}-${LunarUtil.SHI_SHEN[bazi.getDayGan() + h]}`
      );

      const mZhi = currentLunar.getMonthZhi();
      const mHideGan = LunarUtil.ZHI_HIDE_GAN[mZhi];
      const mShiShenZhi = mHideGan.map(
        (h) => `${h}-${LunarUtil.SHI_SHEN[bazi.getDayGan() + h]}`
      );

      const rZhi = currentLunar.getDayZhi();
      const rHideGan = LunarUtil.ZHI_HIDE_GAN[rZhi];
      const rShiShenZhi = rHideGan.map(
        (h) => `${h}-${LunarUtil.SHI_SHEN[bazi.getDayGan() + h]}`
      );

      currentYun = {
        daYunShiShen: "",
        daYunShiShenZhi: [],
        liuNianGanZhi: currentLunar.getYearInGanZhiByLiChun(),
        liuNianShiShen: LunarUtil.SHI_SHEN[
          bazi.getDayGan() + currentLunar.getYearGanByLiChun()
        ],
        liuNianShiShenZhi: yShiShenZhi,
        liuYueGanZhi: currentLunar.getMonthInGanZhi(),
        liuYueShiShen: LunarUtil.SHI_SHEN[
          bazi.getDayGan() + currentLunar.getMonthGan()
        ],
        liuYueShiShenZhi: mShiShenZhi,
        liuRiGanZhi: currentLunar.getDayInGanZhi(),
        liuRiShiShen: LunarUtil.SHI_SHEN[
          bazi.getDayGan() + currentLunar.getDayGan()
        ],
        liuRiShiShenZhi: rShiShenZhi,
      };

      for (let i = 0; i < daYunSize; i++) {
        const d = daYun[i];
        if (d.getStartYear() <= currentYear && currentYear <= d.getEndYear()) {
          if (d.getGanZhi()) {
            currentYun.daYunGanZhi = d.getGanZhi();
            currentYun.daYunShiShen =
              LunarUtil.SHI_SHEN[bazi.getDayGan() + d.getGanZhi().substr(0, 1)];
            const dZhi = d.getGanZhi().substr(1);
            const dHideGan = LunarUtil.ZHI_HIDE_GAN[dZhi];
            currentYun.daYunShiShenZhi = dHideGan.map(
              (h) => `${h}-${LunarUtil.SHI_SHEN[bazi.getDayGan() + h]}`
            );
          }
          break;
        }
      }
    }

    const data = {
      birth: {
        solar: {
          year: `${solar.getYear()}年`,
          month: `${solar.getMonth()}月`,
          day: `${solar.getDay()}日`,
          time: `${this.padding(solar.getHour())}:${this.padding(solar.getMinute())}`
        },
        lunar: {
          year: `${lunar.getYear()}年`,
          month: `${lunar.getMonthInChinese()}月`,
          day: `${lunar.getDayInChinese()}`,
          time: `${lunar.getTimeZhi()}时`
        }
      },
      solarTerms: this.getSolarTerms(lunar),
      baziTitle: this.getBaZiTitle(gender),
      riGan: this.getRiGan(gender),
      yearPillar: this.getPillarInfo(bazi, "year"),
      monthPillar: this.getPillarInfo(bazi, "month"),
      dayPillar: this.getPillarInfo(bazi, "day"),
      hourPillar: this.getPillarInfo(bazi, "hour"),
      ganZhi: `${bazi.getYear()} ${bazi.getMonth()} ${bazi.getDay()} ${bazi.getTime()}`,
      dayun: "",  // 初始化空字符串
      gender: gender === 1 ? '男' : '女',  // 直接设置性别
      sect: sect  // 设置派别
    } as BaZiData;  // 使用类型断言

    if (gender !== -1) {
      data.daYunTitle = "大运";
      data.liuNianTitle = "流年";
      data.liuYueTitle = "流月";
      data.currentYun = currentYun;
      data.startYun = {
        year: startYunSolar?.getYear() || 0,
        month: startYunSolar?.getMonth() || 0,
        day: startYunSolar?.getDay() || 0,
        age: `${startAge}岁${startYunMonth}个月`
      };
      data.daYun = daYun.map((d, index) => {
        const ganZhi = d.getGanZhi();
        const gan = ganZhi.charAt(0); // 取天干
        const zhi = ganZhi.charAt(1); // 取地支
        
        const xunKong = String(LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG]) || "";
        
        // 使用八字计算库给出的正确年份
        const startYear = d.getStartYear(); 
        const endYear = d.getEndYear(); 
        
        // 根据出生年计算虚岁
        const birthYear = solar.getYear(); // 使用公历出生年而不是农历年
        const startAge = startYear - birthYear + 1; // 虚岁计算
        const endAge = endYear - birthYear + 1; // 结束年龄
        
        console.log(`大运计算： 开始年 ${startYear}, 结束年 ${endYear}, 出生年 ${birthYear}, 开始年龄 ${startAge}, 结束年龄 ${endAge}`);
        
        // 计算农历年
        const startLunar = Lunar.fromDate(new Date(startYear, 0, 1));
        const endLunar = Lunar.fromDate(new Date(endYear, 11, 31));
        const lunarYearStart = startLunar.getYear();
        const lunarYearEnd = endLunar.getYear();

        // 正确计算十神
        const tenGod = LunarUtil.SHI_SHEN[`${bazi.getDayGan()}${gan}`] || "未知";
        
        return {
          index: index + 1,
          startYear: startYear,
          endYear: endYear,
          startAge: startAge,
          endAge: endAge,
          ganZhi,
          gan,
          zhi,
          zhiSheng: index + 1,
          xunKong,
          lunarYearStart,
          lunarYearEnd,
          shiShen: tenGod, // 使用相同的十神信息
          naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
          tenGod: tenGod  // 明确设置十神信息
        } as unknown as DaYunInfo;
      });
    }

    return data;
  }

  /**
   * 获取节气信息
   * @param lunar 阴历对象
   * @returns 节气字符串
   */
  private getSolarTerms(lunar: Lunar): string {
    const prevJieQi = lunar.getPrevJie();
    const jieQiSolar = prevJieQi.getSolar();
    const nextJieQi = lunar.getNextJie();
    const nextJieQiSolar = nextJieQi.getSolar();
    return `${prevJieQi.getName()}：${jieQiSolar.getMonth()}月${jieQiSolar.getDay()}日${this.padding(jieQiSolar.getHour())}:${this.padding(jieQiSolar.getMinute())}；${nextJieQi.getName()}：${nextJieQiSolar.getMonth()}月${nextJieQiSolar.getDay()}日${this.padding(nextJieQiSolar.getHour())}:${this.padding(nextJieQiSolar.getMinute())}`;
  }

  /**
   * 获取八字标题
   * @param gender 性别
   * @returns 标题
   */
  private getBaZiTitle(gender: number): string {
    if (gender === 1) return "乾造";
    if (gender === 0) return "坤造";
    return "八字";
  }

  /**
   * 获取日干标题
   * @param gender 性别
   * @returns 日干标题
   */
  private getRiGan(gender: number): string {
    if (gender === 1) return "元男";
    if (gender === 0) return "元女";
    return "日干";
  }

  /**
   * 提取单柱信息
   * @param bazi 八字对象
   * @param type 柱类型（year, month, day, hour）
   * @returns 柱信息
   */
  private getPillarInfo(bazi: EightChar, type: string): PillarInfo {
    // 直接使用 EightChar 类已知的可用方法
    let gan = "";
    let zhi = "";
    
    // 根据类型调用正确的方法
    switch(type) {
      case "year":
        gan = bazi.getYear().charAt(0);
        zhi = bazi.getYear().charAt(1);
        break;
      case "month":
        gan = bazi.getMonth().charAt(0);
        zhi = bazi.getMonth().charAt(1);
        break;
      case "day":
        gan = bazi.getDay().charAt(0);
        zhi = bazi.getDay().charAt(1);
        break;
      case "hour":
        gan = bazi.getTime().charAt(0);
        zhi = bazi.getTime().charAt(1);
        break;
      default:
        throw new Error(`Unknown pillar type: ${type}`);
    }
    
    const ganZhi = gan + zhi;
    
    // 替换 LunarUtil.DI_SHI，它可能不存在
    const diShi = (() => {
      // 地势映射
      const diShiMap: Record<string, string> = {
        '子': '临官', '丑': '帝旺', '寅': '衰', '卯': '病',
        '辰': '死', '巳': '墓', '午': '绝', '未': '胎',
        '申': '养', '酉': '长生', '戌': '沐浴', '亥': '冠带'
      };
      return diShiMap[zhi] || "未知";
    })();
    
    return {
      gan: gan,
      zhi: zhi,
      ganZhi: ganZhi,
      tenGod: LunarUtil.SHI_SHEN[bazi.getDayGan() + gan] || "",
      hidden: this.getHiddenGan(zhi, bazi.getDayGan()),
      naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
      xunKong: String(LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG]) || "未知",
      wuXing: LunarUtil.WU_XING_GAN[gan] || "未知",
      diShi: diShi,
      shiShen: LunarUtil.SHI_SHEN[`${bazi.getDayGan()}${gan}`] || "未知"
    };
  }

  /**
   * 格式化数字（补0）
   * @param n 数字
   * @returns 补0后的字符串
   */
  private padding(n: number): string {
    return (n < 10 ? '0' : '') + n;
  }

  /**
   * 处理阴历输入
   * @param year 年
   * @param month 月（闰月用负数）
   * @param day 日
   * @param hour 时
   * @param minute 分
   * @param gender 性别
   * @returns 排盘数据
   */
  computeLunar(year: number, month: number, day: number, hour: number, minute: number, gender: number): BaZiData | string {
    if (
      year < 1 ||
      year > 9999 ||
      (month >= 0 && (month < 1 || month > 12)) ||
      (month < 0 && (month < -12 || month > -1)) ||
      day < 1 ||
      day > 30 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return "输入错误";
    }
    const lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
    const solar = lunar.getSolar();
    return this.computeEightChar(lunar, solar, gender);
  }

  /**
   * 处理公历输入
   * @param year 年
   * @param month 月
   * @param day 日
   * @param hour 时
   * @param minute 分
   * @param gender 性别
   * @returns 排盘数据
   */
  computeSolar(year: number, month: number, day: number, hour: number, minute: number, gender: number): BaZiData | string {
    if (
      year < 1 ||
      year > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return "输入错误";
    }
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    if (!solar) {
      return "无效的公历日期";
    }
    const lunar = solar.getLunar();
    if (!lunar) {
      return "无法获取对应的阴历日期";
    }
    return this.computeEightChar(lunar, solar, gender);
  }

  /**
   * 主入口函数
   * @param input 输入字符串
   * @param isLunar 是否为阴历
   * @returns 排盘数据
   */
  compute(input: string, isLunar: boolean): BaZiData | string {
    const v = input.trim();
    if (!/^\s*\d{4}\s*\d{2}\s*\d{2}\s*\d{2}\s*\d{2}\s*[+-]?$/.test(v)) {
      return "输入格式错误";
    }

    if (isLunar) {
      let year = parseInt(v.substr(0, 4));
      let rest = v.substr(4);
      let leapMonth = false;
      if (rest.indexOf(" ") === 0) {
        leapMonth = true;
      }
      rest = rest.trim();
      let month = parseInt(rest.substr(0, 2), 10);
      if (leapMonth && LunarYear.fromYear(year).getLeapMonth() === month) {
        month = -month;
      }
      rest = rest.trim().substr(2);
      const day = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const hour = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const minute = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const gender = rest === "+" ? 1 : rest === "-" ? 0 : -1;
      return this.computeLunar(year, month, day, hour, minute, gender);
    } else {
      const year = parseInt(v.substr(0, 4));
      let rest = v.trim().substr(4);
      const month = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const day = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const hour = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const minute = parseInt(rest.substr(0, 2), 10);
      rest = rest.trim().substr(2);
      const gender = rest === "+" ? 1 : rest === "-" ? 0 : -1;
      return this.computeSolar(year, month, day, hour, minute, gender);
    }
  }

  /**
   * 获取流年信息
   * @param year 年份
   * @param dayGan 日干
   * @returns 流年信息
   */
  public getLiuNian(year: number, dayGan: string): LiuNianInfo {
    const lunar = Lunar.fromDate(new Date(year, 0, 1));
    const yearGan = lunar.getYearGanByLiChun();
    const yearZhi = lunar.getYearZhiByLiChun();
    const ganZhi = yearGan + yearZhi;
    
    // 修正 xunKong 的类型处理
    const xunKongValue = LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG];
    const xunKong = typeof xunKongValue === 'string' || typeof xunKongValue === 'number' 
      ? xunKongValue 
      : String(xunKongValue);
    
    // 确保十神信息正确计算
    const shiShen = LunarUtil.SHI_SHEN[`${dayGan}${yearGan}`] || "未知";
    console.log(`流年十神计算：日干=${dayGan}, 年干=${yearGan}, 结果=${shiShen}`);
    
    return {
      year,
      ganZhi,
      shiShen,
      naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
      xunKong,
      hidden: this.getHiddenGan(yearZhi, dayGan)
    };
  }

  /**
   * 获取流月信息
   * @param year 年份
   * @param month 月份
   * @param dayGan 日干
   * @returns 流月信息
   */
  public getLiuYue(year: number, month: number, dayGan: string): LiuYueInfo {
    const lunar = Lunar.fromDate(new Date(year, month - 1, 1));
    const monthGan = lunar.getMonthGan();
    const monthZhi = lunar.getMonthZhi();
    const ganZhi = monthGan + monthZhi;
    
    // 修正 xunKong 的类型处理
    const xunKongValue = LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG];
    const xunKong = typeof xunKongValue === 'string' || typeof xunKongValue === 'number' 
      ? xunKongValue 
      : String(xunKongValue);
    
    return {
      year,
      month,
      ganZhi,
      shiShen: LunarUtil.SHI_SHEN[dayGan + monthGan] || "未知",
      naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
      xunKong,  // 使用处理过的 xunKong 值
      hidden: this.getHiddenGan(monthZhi, dayGan)
    };
  }

  /**
   * 获取流日信息
   * @param date 日期
   * @param dayGan 日干
   * @returns 流日信息
   */
  public getLiuRi(date: Date, dayGan: string) {
    const lunar = Lunar.fromDate(date);
    const riGan = lunar.getDayGan();
    const riZhi = lunar.getDayZhi();
    const ganZhi = riGan + riZhi;
    
    return {
      date,
      ganZhi,
      shiShen: LunarUtil.SHI_SHEN[dayGan + riGan] || "未知",
      naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
      xunKong: LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG] || "未知",
      hidden: this.getHiddenGan(riZhi, dayGan)
    };
  }

  /**
   * 获取地支藏干信息
   * @param zhi 地支
   * @param dayGan 日干
   * @returns 藏干信息
   */
  private getHiddenGan(zhi: string, dayGan: string) {
    const hideGan = LunarUtil.ZHI_HIDE_GAN[zhi] || [];
    const hiddenGanTypes = ['本气', '中气', '余气'];
    
    return hideGan.map((h: string, i: number) => {
      return {
        gan: h,
        type: hiddenGanTypes[i] || '未知',
        shiShen: LunarUtil.SHI_SHEN[dayGan + h] || '未知'
      };
    });
  }

  /**
   * 获取小运信息
   * @param year 年份
   * @param dayGan 日干
   * @returns 小运信息
   */
  public getXiaoYun(year: number, dayGan: string): XiaoYunInfo {
    const lunar = Lunar.fromDate(new Date(year, 0, 1));
    const lunarYear = lunar.getYear();
    
    return {
      index: 1, // 索引，可根据需要调整
      ganZhi: lunar.getYearInGanZhi(),
      age: year - parseInt(dayGan, 10) + 1, // 简单计算年龄，实际应根据出生年计算
      year: year,
      lunarYear: lunarYear
    };
  }
}
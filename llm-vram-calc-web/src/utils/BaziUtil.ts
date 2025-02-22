import { Lunar, Solar, EightChar, Yun, DaYun, LunarYear, LunarUtil } from 'lunar-typescript';
import { BaZiData } from '../types/bazi';

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
  private computeEightChar(lunar: Lunar, solar: Solar, gender: number): BaZiData {
    if (!lunar || !solar) {
      throw new Error('Invalid lunar or solar date');
    }

    console.log('Computing EightChar with:', {
      lunar: lunar.toString(),
      solar: solar.toString(),
      gender
    });

    const bazi = lunar.getEightChar();
    if (!bazi) {
      throw new Error('Failed to create EightChar instance');
    }

    // 确保设置流派
    bazi.setSect(this.selectSect);
    
    console.log('EightChar instance:', {
      dayGan: bazi.getDayGan(),
      dayZhi: bazi.getDayZhi()
    });

    let currentYear: number,
      startYunSolar: Solar | undefined,
      daYun: DaYun[] = [],
      daYunSize: number = 0,
      currentYun: any = null;

    if (gender !== -1) {
      const date = new Date();
      currentYear = date.getFullYear();
      const yun = bazi.getYun(gender);
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

    const data: BaZiData = {
      birth: {
        solar: {
          year: `${solar.getYear()}年`,
          month: `${solar.getMonth()}月`,
          day: `${solar.getDay()}日`,
          time: `${this.padding(solar.getHour())}:${this.padding(solar.getMinute())}`,
        },
        lunar: {
          year: `${lunar.getYearInChinese()}年`,
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
    };

    if (gender !== -1) {
      data.daYunTitle = "大运";
      data.liuNianTitle = "流年";
      data.liuYueTitle = "流月";
      data.currentYun = currentYun;
      data.startYun = {
        year: startYunSolar?.getYear() || 0,
        month: startYunSolar?.getMonth() || 0,
        day: startYunSolar?.getDay() || 0,
      };
      data.daYun = daYun.map((d, index) => {
        const ganZhi = d.getGanZhi();
        return {
          period: index + 1,
          startAge: d.getStartAge(),
          startYear: d.getStartYear(),
          tenGod: LunarUtil.SHI_SHEN[bazi.getDayGan() + ganZhi.charAt(0)] || "",
          ganZhi: ganZhi,
          naYin: LunarUtil.NAYIN[ganZhi as keyof typeof LunarUtil.NAYIN] || "未知",
          xunKong: LunarUtil.XUN_KONG[ganZhi as keyof typeof LunarUtil.XUN_KONG] || "未知",
          hiddenGan: LunarUtil.ZHI_HIDE_GAN[ganZhi.charAt(1)]?.join('') || "未知",
          liuNian: d.getLiuNian().map(n => ({
            year: n.getYear(),
            ganZhi: n.getGanZhi()
          }))
        };
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
   * @param pillarType 柱类型（year, month, day, hour）
   * @returns 柱信息
   */
  private getPillarInfo(bazi: EightChar, pillarType: "year" | "month" | "day" | "hour") {
    if (!bazi) {
      throw new Error('Invalid EightChar instance');
    }

    try {
      let gan: string, zhi: string, tenGod: string, hideGan: string[], 
          shiShenZhi: string[], naYin: string, wuXing: string, 
          xunKong: string, diShi: string;

      // 根据柱类型调用对应的方法
      switch (pillarType) {
        case "year":
          gan = bazi.getYearGan();
          zhi = bazi.getYearZhi();
          tenGod = bazi.getYearShiShenGan();
          hideGan = bazi.getYearHideGan();
          shiShenZhi = bazi.getYearShiShenZhi();
          naYin = bazi.getYearNaYin();
          wuXing = bazi.getYearWuXing();
          xunKong = bazi.getYearXunKong();
          diShi = bazi.getYearDiShi();
          break;
        case "month":
          gan = bazi.getMonthGan();
          zhi = bazi.getMonthZhi();
          tenGod = bazi.getMonthShiShenGan();
          hideGan = bazi.getMonthHideGan();
          shiShenZhi = bazi.getMonthShiShenZhi();
          naYin = bazi.getMonthNaYin();
          wuXing = bazi.getMonthWuXing();
          xunKong = bazi.getMonthXunKong();
          diShi = bazi.getMonthDiShi();
          break;
        case "day":
          gan = bazi.getDayGan();
          zhi = bazi.getDayZhi();
          tenGod = "日主"; // 日柱天干十神固定为日主
          hideGan = bazi.getDayHideGan();
          shiShenZhi = bazi.getDayShiShenZhi();
          naYin = bazi.getDayNaYin();
          wuXing = bazi.getDayWuXing();
          xunKong = bazi.getDayXunKong();
          diShi = bazi.getDayDiShi();
          break;
        case "hour":
          gan = bazi.getTimeGan();
          zhi = bazi.getTimeZhi();
          tenGod = bazi.getTimeShiShenGan();
          hideGan = bazi.getTimeHideGan();
          shiShenZhi = bazi.getTimeShiShenZhi();
          naYin = bazi.getTimeNaYin();
          wuXing = bazi.getTimeWuXing();
          xunKong = bazi.getTimeXunKong();
          diShi = bazi.getTimeDiShi();
          break;
        default:
          throw new Error(`Invalid pillar type: ${pillarType}`);
      }

      // 修改藏干的显示格式
      const hiddenGanTypes = ['本气', '中气', '余气'];
      const hidden = hideGan.map((h: string, i: number) => {
        const shiShen = shiShenZhi[i] || '未知';
        const ganType = hiddenGanTypes[i] || '未知';
        return {
          gan: h,                    // 主字
          type: ganType,            // 气的类型
          shiShen: shiShen         // 十神
        };
      });

      return {
        gan,
        zhi,
        tenGod: String(tenGod || "未知"),
        hidden, // 返回结构化数据，让显示组件处理格式
        naYin: String(naYin || "未知"),
        xunKong: String(xunKong || "未知"),
        wuXing: String(wuXing || "未知"),
        diShi: String(diShi || "未知")
      };
    } catch (error) {
      console.error(`Error getting pillar info for ${pillarType}:`, error);
      return {
        gan: '错误',
        zhi: '错误',
        tenGod: '错误',
        hidden: [],
        naYin: '错误',
        xunKong: '错误',
        wuXing: '错误',
        diShi: '错误'
      };
    }
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
}
import { BaZiData, DaYunInfo, LiuNianInfo, LiuYueInfo, XiaoYunInfo } from '../types/BaziTypes';
import { Lunar, Solar } from 'lunar-typescript';
import dayjs from 'dayjs';
import { BaZiUtil } from './BaziUtil';

class BaziLogger {
  private static instance: BaziLogger;
  private baziUtil = new BaZiUtil();
  private cachedDaYun: DaYunInfo[] = [];
  private cachedLiuNian: LiuNianInfo[] = [];
  private cachedLiuYue: LiuYueInfo[] = [];
  private cachedXiaoYun: XiaoYunInfo[] = [];
  private cachedBaziData: BaZiData | null = null;

  /**
   * 显示完整的八字信息
   * @param solarDate 公历日期
   * @param time 时间字符串（格式：HH:mm）
   * @param gender 性别（1: 男, 0: 女）
   * @param sect 流派（默认值为2）
   */
  displayFullBazi(solarDate: Date, time: string, gender: string, sect: number = 2): BaZiData {
    const dayjsDate = dayjs(solarDate);
    const [hours, minutes] = time.split(':').map(Number);
    
    // 转换性别参数
    const genderNum = gender === '男' ? 1 : gender === '女' ? 0 : -1;
    
    console.log('原始输入参数:', { solarDate, time, gender });
    
    const solar = Solar.fromYmdHms(
      dayjsDate.year(),
      dayjsDate.month() + 1,
      dayjsDate.date(),
      hours,
      minutes,
      0
    );
    
    console.log('转换后的公历对象:', solar.toString());
    console.log('Solar对象详情:', {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: solar.getHour(),
      minute: solar.getMinute()
    });

    const lunar = solar.getLunar();
    console.log('对应的阴历日期:', lunar.toString());
    console.log('当前使用流派:', sect); // line 93
    const result = this.baziUtil.computeEightChar(lunar, solar, genderNum, sect);

    if (typeof result === 'string') {
      throw new Error(result);
    }

    // 添加四柱信息的日志输出
    console.log('四柱信息:', {
      年柱: `${result.yearPillar.gan}${result.yearPillar.zhi}`,
      月柱: `${result.monthPillar.gan}${result.monthPillar.zhi}`,
      日柱: `${result.dayPillar.gan}${result.dayPillar.zhi}`,
      时柱: `${result.hourPillar.gan}${result.hourPillar.zhi}`
    });

    // 添加大运信息的简洁输出
    if (result.daYun) {
      console.log('大运信息:', result.daYun.map(yun => ({
        大运: yun.ganZhi,
        起运年龄: yun.startAge,
        起运年份: yun.startYear
      })));
    }

    // 添加详细的四柱信息
    console.log('四柱详细信息:', {
      年柱: {
        天干: result.yearPillar.gan,
        地支: result.yearPillar.zhi,
        十神: result.yearPillar.tenGod,
        藏干: result.yearPillar.hidden.join(','),
        纳音: result.yearPillar.naYin,
        旬空: result.yearPillar.xunKong
      },
      月柱: {
        天干: result.monthPillar.gan,
        地支: result.monthPillar.zhi,
        十神: result.monthPillar.tenGod,
        藏干: result.monthPillar.hidden.join(','),
        纳音: result.monthPillar.naYin,
        旬空: result.monthPillar.xunKong
      },
      日柱: {
        天干: result.dayPillar.gan,
        地支: result.dayPillar.zhi,
        十神: result.dayPillar.tenGod,
        藏干: result.dayPillar.hidden.join(','),
        纳音: result.dayPillar.naYin,
        旬空: result.dayPillar.xunKong
      },
      时柱: {
        天干: result.hourPillar.gan,
        地支: result.hourPillar.zhi,
        十神: result.hourPillar.tenGod,
        藏干: result.hourPillar.hidden.join(','),
        纳音: result.hourPillar.naYin,
        旬空: result.hourPillar.xunKong
      }
    });

    // 缓存计算结果
    this.cachedDaYun = result.daYun || [];  // 添加默认空数组
    this.cachedLiuNian = this.generateLiuNianData(result);
    this.cachedLiuYue = this.generateLiuYueData(result);
    this.cachedXiaoYun = this.generateXiaoYunData(result);

    // 缓存结果
    this.cachedBaziData = {
      ...result,
      daYun: this.cachedDaYun,
      liuNian: this.cachedLiuNian,
      liuYue: this.cachedLiuYue,
      xiaoYun: this.cachedXiaoYun
    } as BaZiData;
    
    return this.cachedBaziData;
  }

  private generateLiuNianData(result: BaZiData): LiuNianInfo[] {
    if (!result.daYun || result.daYun.length === 0) {
      return [];
    }
    
    // 根据大运生成流年数据
    const liuNian: LiuNianInfo[] = [];
    const startYear = result.daYun[0].startYear;
    const endYear = result.daYun[result.daYun.length - 1].startYear + 9;
    
    for (let year = startYear; year <= endYear; year++) {
      const solar = Solar.fromYmd(year, 1, 1);
      const lunar = solar.getLunar();
      
      // 修复方法调用
      liuNian.push({
        year,
        ganZhi: lunar.getYearInGanZhi(),
        // 使用替代方法或直接获取值
        shiShen: this.getTenGodValue(lunar.getYearGan(), result.riGan),
        naYin: this.getNaYinValue(lunar.getYearGan(), lunar.getYearZhi()),
        xunKong: this.getXunKongValue(lunar.getYearGan(), lunar.getYearZhi()),
        hidden: this.getHiddenGanValue(lunar.getYearZhi())
      });
    }
    
    return liuNian;
  }
  
  private generateLiuYueData(result: BaZiData): LiuYueInfo[] {
    if (!result.daYun || result.daYun.length === 0) {
      return [];
    }
    
    const liuYue: LiuYueInfo[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let month = 1; month <= 12; month++) {
      const solar = Solar.fromYmd(currentYear, month, 1);
      const lunar = solar.getLunar();
      
      liuYue.push({
        year: currentYear,
        month,
        ganZhi: lunar.getMonthInGanZhi(),
        // 修复方法调用
        shiShen: this.getTenGodValue(lunar.getMonthGan(), result.riGan),
        naYin: this.getNaYinValue(lunar.getMonthGan(), lunar.getMonthZhi()),
        xunKong: this.getXunKongValue(lunar.getMonthGan(), lunar.getMonthZhi()),
        hidden: this.getHiddenGanValue(lunar.getMonthZhi())
      });
    }
    
    return liuYue;
  }
  
  private generateXiaoYunData(result: BaZiData): XiaoYunInfo[] {
    if (!result.daYun || result.daYun.length === 0) {
      return [];
    }
    
    const xiaoYun: XiaoYunInfo[] = [];
    
    // 为每个大运生成10个小运
    result.daYun.forEach((daYun, index) => {
      for (let i = 0; i < 10; i++) {
        const year = daYun.startYear + i;
        const age = daYun.startAge + i;
        const solar = Solar.fromYmd(year, 1, 1);
        const lunar = solar.getLunar();
        
        xiaoYun.push({
          index: i + 1,
          ganZhi: lunar.getYearInGanZhi(),
          age,
          year,
          lunarYear: lunar.getYear()
        });
      }
    });
    
    return xiaoYun;
  }

  public getLiuNianData(): LiuNianInfo[] {
    return this.cachedLiuNian;
  }

  public getLiuYueData(): LiuYueInfo[] {
    return this.cachedLiuYue;
  }

  public getXiaoYunData(): XiaoYunInfo[] {
    return this.cachedXiaoYun;
  }

  public getBaziData(): BaZiData | null {
    return this.cachedBaziData;
  }

  // 添加这些辅助方法以替代BaZiUtil中不可访问的方法
  private getTenGodValue(gan: string, riGan: string): string {
    // 实现十神计算逻辑，或从其他可用来源获取
    return '';
  }
  
  private getNaYinValue(gan: string, zhi: string): string {
    // 实现纳音计算逻辑
    return '';
  }
  
  private getXunKongValue(gan: string, zhi: string): string {
    // 实现旬空计算逻辑
    return '';
  }
  
  private getHiddenGanValue(zhi: string): any[] {
    // 实现藏干计算逻辑
    return [];
  }

  // 获取流年信息
  public getLiuNian(year: number, dayGan: string): LiuNianInfo[] {
    try {
      // 如果已有缓存数据，先尝试从缓存获取
      if (this.cachedBaziData && (this.cachedBaziData as any).liuNian) {
        const cachedLiuNian = (this.cachedBaziData as any).liuNian.find((ln: LiuNianInfo) => ln.year === year);
        if (cachedLiuNian) {
          return [cachedLiuNian];
        }
      }
      
      // 否则重新计算
      const liuNian = this.baziUtil.getLiuNian(year, dayGan);
      return [liuNian];
    } catch (error) {
      console.error(`获取${year}年流年信息出错:`, error);
      return [];
    }
  }
  
  // 获取小运信息
  public getXiaoYun(year: number, dayGan: string): XiaoYunInfo[] {
    try {
      // 如果已有缓存数据，先尝试从缓存获取
      if (this.cachedBaziData && (this.cachedBaziData as any).xiaoYun) {
        const cachedXiaoYun = (this.cachedBaziData as any).xiaoYun.filter((xy: XiaoYunInfo) => xy.year === year);
        if (cachedXiaoYun.length > 0) {
          return cachedXiaoYun;
        }
      }
      
      // 否则重新计算
      // 注意：BaziUtil中可能需要添加getXiaoYun方法
      const xiaoYun = this.baziUtil.getXiaoYun ? 
        this.baziUtil.getXiaoYun(year, dayGan) : 
        [{
          index: 1,
          ganZhi: "未知",
          age: 0,
          year: year,
          lunarYear: 0
        }];
      
      return Array.isArray(xiaoYun) ? xiaoYun : [xiaoYun];
    } catch (error) {
      console.error(`获取${year}年小运信息出错:`, error);
      return [];
    }
  }
  
  // 获取流月信息
  public getLiuYue(year: number, month: number, dayGan: string): LiuYueInfo[] {
    try {
      // 如果已有缓存数据，先尝试从缓存获取
      if (this.cachedBaziData && (this.cachedBaziData as any).liuYue) {
        const cachedLiuYue = (this.cachedBaziData as any).liuYue.find((ly: LiuYueInfo) => ly.year === year && ly.month === month);
        if (cachedLiuYue) {
          return [cachedLiuYue];
        }
      }
      
      // 否则重新计算
      const liuYue = this.baziUtil.getLiuYue(year, month, dayGan);
      return [liuYue];
    } catch (error) {
      console.error(`获取${year}年${month}月流月信息出错:`, error);
      return [];
    }
  }
  
  // 获取流日信息
  public getLiuRi(date: Date, dayGan: string): any {
    try {
      // 流日信息通常不缓存，直接计算
      return this.baziUtil.getLiuRi(date, dayGan);
    } catch (error) {
      console.error(`获取${date.toLocaleDateString()}流日信息出错:`, error);
      return [];
    }
  }
}

// 单例实例
const baziLogger = new BaziLogger();
export default baziLogger; 
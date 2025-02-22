import { BaZiData } from '../types/bazi';
import { Lunar, Solar } from 'lunar-typescript';
import dayjs from 'dayjs';
import { BaZiUtil } from './BaziUtil';

class BaziLogger {
  private baziUtil = new BaZiUtil();

  /**
   * 显示完整的八字信息
   * @param solarDate 公历日期
   * @param time 时间字符串（格式：HH:mm）
   * @param gender 性别（1: 男, 0: 女）
   */
  displayFullBazi(solarDate: Date, time: string, gender: string): BaZiData {
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
    
    const result = this.baziUtil.computeSolar(
      solar.getYear(),
      solar.getMonth(),
      solar.getDay(),
      solar.getHour(),
      solar.getMinute(),
      genderNum
    );

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

    return result;
  }
}

export default new BaziLogger(); 
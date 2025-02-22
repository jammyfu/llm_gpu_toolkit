import React from 'react';
import { Form, DatePicker, TimePicker, Radio, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { dateTimeLocale, Locale } from '../locales/datetime';
import zhCN from 'antd/locale/zh_CN';  // 导入 antd 的中文语言包
import 'dayjs/locale/zh-cn';  // 导入 dayjs 的中文语言包

interface BaZiInputProps {
  onCalculate: (date: Dayjs, time: string, gender: number) => void;
  locale?: Locale;  // 保持可选，但使用 Locale 类型
  defaultDate?: Dayjs | null;
}

const BaZiInput: React.FC<BaZiInputProps> = ({ 
  onCalculate, 
  locale = 'zh',  // 设置默认值
  defaultDate 
}) => {
  const [form] = Form.useForm();
  // 使用类型断言确保 locale 是有效的键
  const t = dateTimeLocale[locale as keyof typeof dateTimeLocale];

  // 使用 antd 的中文语言包
  const dateLocale = locale === 'zh' 
    ? zhCN.DatePicker
    : undefined;

  // 使用固定的中文验证消息
  const validationMessages = {
    date: '请选择出生日期',
    time: '请选择出生时间',
    gender: '请选择性别'
  };

  // 设置日期范围
  const disabledDate = (current: Dayjs) => {
    return current && (
      current.year() > 2200 || 
      current.year() < 1900
    );
  };

  // 组件挂载时设置默认值
  React.useEffect(() => {
    if (defaultDate) {
      form.setFieldsValue({ date: defaultDate });
    }
  }, [form, defaultDate]);

  const handleFinish = (values: any) => {
    const { date, time, gender } = values;
    const genderNum = gender === 'male' ? 1 : gender === 'female' ? 0 : -1;
    onCalculate(date, time.format('HH:mm'), genderNum);
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="inline"
      initialValues={{
        date: defaultDate,
        gender: 'male'
      }}
    >
      <Form.Item
        name="date"
        label={t.birthDateLabel}
        rules={[{ required: true, message: validationMessages.date }]}
      >
        <DatePicker 
          placeholder={t.datePlaceholder}
          locale={dateLocale}  // 使用中文语言包
          showTime={false}
          defaultPickerValue={dayjs().subtract(20, 'year')}
          showToday={false}
        />
      </Form.Item>

      <Form.Item
        name="time"
        label={t.birthTimeLabel}
        rules={[{ required: true, message: validationMessages.time }]}
      >
        <TimePicker 
          format="HH:mm"
          placeholder={t.timePlaceholder}
          locale={dateLocale}  // 使用中文语言包
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label={t.genderLabel}
        rules={[{ required: true, message: validationMessages.gender }]}
      >
        <Radio.Group>
          <Radio value="male">{t.male}</Radio>
          <Radio value="female">{t.female}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t.calculate}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BaZiInput;
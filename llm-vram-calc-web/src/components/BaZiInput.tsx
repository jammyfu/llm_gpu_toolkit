import React from 'react';
import { Form, DatePicker, TimePicker, Radio, Button, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { dateTimeLocale, Locale } from '../locales/datetime';
import zhCN from 'antd/locale/zh_CN';  // 导入 antd 的中文语言包
import 'dayjs/locale/zh-cn';  // 导入 dayjs 的中文语言包
import styled from 'styled-components';

interface BaZiInputProps {
  onCalculate: (date: Dayjs, time: string, gender: number) => void;
  locale: 'zh' | 'en';
  defaultDate: Dayjs | null;
  theme: { isDark: boolean }; // 添加 theme 属性
}

const StyledForm = styled(Form)`
  background-color: ${(props) => props.theme.isDark ? '#333' : '#fff'};
  color: ${(props) => props.theme.isDark ? '#fff' : '#000'};
  padding: 20px;
  border-radius: 8px;
  .ant-form-item {
    margin-bottom: 16px;
    .ant-form-item-label > label {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }
  }
  .ant-select {
    width: 100%;
  }
`;

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    background-color: ${(props) => props.theme.isDark ? '#444' : '#fff'};
    color: ${(props) => props.theme.isDark ? '#fff' : '#000'};
    border-color: ${(props) => props.theme.isDark ? '#555' : '#d9d9d9'};
  }

  .ant-radio-button-wrapper-checked {
    background-color: ${(props) => props.theme.isDark ? '#1890ff' : '#e6f7ff'};
    color: ${(props) => props.theme.isDark ? '#fff' : '#1890ff'};
    border-color: ${(props) => props.theme.isDark ? '#1d39c4' : '#91d5ff'};
  }
`;

const StyledPicker = styled.div`
  display: flex;
  gap: 16px;

  .ant-picker {
    background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
    border-color: ${(props) => props.theme.isDark ? '#434343' : '#d9d9d9'} !important;
    
    .ant-picker-input > input {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }

    .ant-picker-suffix {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }

    .ant-picker-clear {
      background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }
  }

  .ant-picker-dropdown {
    background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
    border-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;

    .ant-picker-panel {
      background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;

      .ant-picker-header {
        color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
        border-bottom-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;
      }

      .ant-picker-cell {
        color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;

        &-inner:hover {
          background: ${(props) => props.theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'} !important;
        }

        &-selected .ant-picker-cell-inner {
          background: ${(props) => props.theme.isDark ? '#1890ff' : '#e6f7ff'} !important;
        }
      }
    }

    .ant-picker-footer {
      border-top-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: ${(props) => props.theme.isDark ? 
      '#8fb82e' : // 深色模式下使用更深的绿色
      '#7c9a2e' // 浅色模式下使用更深的绿色
    } !important;
    border-color: ${(props) => props.theme.isDark ? 
      '#8fb82e' : 
      '#7c9a2e'
    } !important;
    color: #ffffff !important; // 统一使用白色文字
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); // 统一的文字阴影
    
    &:hover {
      background-color: ${(props) => props.theme.isDark ? 
        '#a9d134' : // hover 时变亮
        '#8fb82e'
      } !important;
      border-color: ${(props) => props.theme.isDark ? 
        '#a9d134' : 
        '#8fb82e'
      } !important;
      color: #ffffff !important;
    }

    &:active {
      background-color: ${(props) => props.theme.isDark ? 
        '#c4eb4d' : 
        '#a9d134'
      } !important;
      border-color: ${(props) => props.theme.isDark ? 
        '#c4eb4d' : 
        '#a9d134'
      } !important;
    }
  }
`;

const BaZiInput: React.FC<BaZiInputProps> = ({ 
  onCalculate, 
  locale = 'zh',  // 设置默认值
  defaultDate,
  theme
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
    <StyledForm
      form={form}
      onFinish={handleFinish}
      layout="inline"
      initialValues={{
        date: defaultDate,
        gender: 'male'
      }}
      theme={theme}
    >
      <StyledPicker>
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
      </StyledPicker>

      <Form.Item
        name="gender"
        label={t.genderLabel}
        rules={[{ required: true, message: validationMessages.gender }]}
      >
        <StyledRadioGroup theme={theme}>
          <Radio.Button value="male">♂️ {t.male}</Radio.Button>
          <Radio.Button value="female">♀️ {t.female}</Radio.Button>
        </StyledRadioGroup>
      </Form.Item>

      <Form.Item>
        <StyledButton type="primary" htmlType="submit">
          {t.calculate}
        </StyledButton>
      </Form.Item>
    </StyledForm>
  );
};

export default BaZiInput;
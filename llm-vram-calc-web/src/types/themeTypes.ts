export interface StatusColor {
  color: string;
  bg: string;
}

export type StatusColors = {
  "can-run": StatusColor;
  "barely-run": StatusColor;
  "cannot-run": StatusColor;
};

export interface ThemeInterface {
  isDark: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
} 
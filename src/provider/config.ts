import { ThemeConfig } from 'antd';

export const AELFDProviderTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2A4BF0',
    colorPrimaryHover: '#4564FF',
    colorPrimaryActive: '#2242E3',
  },
  components: {
    Input: {
      borderRadius: 12,
    },
    Table: {
      headerColor: '#919191',
      headerSplitColor: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Layout: {
      bodyBg: '#FFF',
    },
    Tooltip: {
      colorBgSpotlight: 'rgb(0 0 0 / 80%)',
      colorTextLightSolid: '#FFF',
      borderRadius: 4,
    },
    Button: {
      borderColorDisabled: '#FAFAFA',
      colorTextDisabled: '#B8B8B8',
      colorBgContainerDisabled: '#FAFAFA',
    },
  },
};

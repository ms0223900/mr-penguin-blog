declare module 'common-types' {
  import { SvgIconComponent } from '@mui/icons-material';
  import { SvgIconClassKey } from '@mui/material';
  interface SingleNav {
    title: string;
    icon?: SvgIconComponent | null;
    link?: string;
    subNavList: SingleNav[];
  }
}

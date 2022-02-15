declare module 'common-types' {
  import { SvgIconComponent } from '@mui/icons-material';
  import { SvgIconClassKey } from '@mui/material';
  interface SingleNav {
    title: string;
    icon?: SvgIconComponent | null;
    link?: string;
    subNavList: SingleNav[];
  }

  interface SinglePost {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    content: string;
    thumbnail?: Image;
  }

  interface Image {
    name?: string;
    src: string;
  }

  type ID = string | number;
}

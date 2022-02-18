declare module 'common-types' {
  import { SvgIconComponent } from '@mui/icons-material';
  import { SvgIconClassKey } from '@mui/material';

  interface TimeRecord {
    createdAt: string;
  }
  interface SingleNav {
    title: string;
    icon?: SvgIconComponent | null;
    link?: string;
    subNavList: SingleNav[];
  }

  interface SinglePost extends TimeRecord {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    content: string;
    thumbnail?: Image;
    tagList: string[];
  }

  interface Image {
    name?: string;
    src: string;
  }

  type ID = string | number;
}

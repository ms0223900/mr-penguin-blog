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
    content: string | null;
    thumbnail: Image | null;
    tagList: string[];
  }

  interface Image {
    name?: string;
    src: string;
  }

  type ID = string | number;
  type Callback = <Params>(...params: Params) => any;

  export interface StrapiResponseAttr<Attrs> {
    id: ID;
    attributes: Attrs;
  }

  export interface StrapiResponseWithSingleAttr<Data> {
    data: StrapiResponseAttr<Data>;
  }
  export interface StrapiResponseWithListAttr<Data> {
    data: StrapiResponseAttr<Data>[];
  }
}

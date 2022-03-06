import { ID, StrapiResponseWithSingleAttr } from 'common-types';

const QueriedHelpers = {
  // extractSingle: <Attr extends Record<string, any>>(
  //   queried: StrapiResponseWithSingleAttr<Attr>,
  //   attrKeyListForExtract: (keyof Attr)[]
  // ) => {
  //   const attrs = queried.data.attributes;
  //   interface Obj extends Attr { id: ID }
  //   const res: Obj = {
  //     id: queried.data.id,
  //   };
  //   attrKeyListForExtract.forEach((key) => {
  //     res[key] = attrs[key] as any;
  //   });
  //   return res;
  // },
  // extractList: () => {},
};

export default QueriedHelpers;

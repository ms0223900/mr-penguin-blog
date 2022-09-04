/* eslint-disable @next/next/no-img-element */
import { Image } from 'common-types';
import React, { memo } from 'react';

export interface ThumbnailImgProps
  extends Image,
    Omit<
      React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >,
      'src'
    > {}

const ThumbnailImg = (props: ThumbnailImgProps) => {
  return (
    <div className="img--wrapper thumbnail--wrapper">
      <img loading="lazy" alt={props.name || 'thumbnail'} {...props} />
    </div>
  );
};

export default memo(ThumbnailImg);

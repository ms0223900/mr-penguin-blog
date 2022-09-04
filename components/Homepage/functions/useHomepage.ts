/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { HomepageProps } from '../Homepage';
import { HomepageContainerProps } from '../HomepageContainer';
import convertToHomepageProps from './convertToHomepageProps';

export type UseHomepageOptions = HomepageContainerProps;

const useHomepage = ({ postListData }: UseHomepageOptions) => {
  const homepageProps = useMemo(
    (): HomepageProps =>
      convertToHomepageProps(postListData, postListData.slice(0, 5)),
    [JSON.stringify]
  );

  return { homepageProps };
};

export default useHomepage;

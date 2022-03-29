import useSearchByVal from 'lib/custom-hooks/useSearchByVal';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useEffect, useState } from 'react';
import SearchBar from './SearchBar';

const useSearch = (initVal = '') => {
  const { searchVal, handleSearchByVal } = useSearchByVal();
  const [val, setVal] = useState(initVal);
  // const { state, setState } = useContext(MainContext);

  const handleSearch = useCallback(() => {
    if (!val) return;

    handleSearchByVal(val);
  }, [val]);

  const handleChange = useCallback((e: any) => {
    setVal(e.target.value);
  }, []);

  useEffect(() => {
    // console.log(searchVal);
    if (!searchVal) {
      setVal('');
      return;
    }
    setVal(searchVal);
    // if(!router.query)
  }, [searchVal]);

  return {
    val,
    handleSearch,
    handleChange,
  };
};

const SearchBarContainer = () => {
  const { val, handleChange, handleSearch } = useSearch();
  return (
    <SearchBar value={val} onChange={handleChange} onSearch={handleSearch} />
  );
};

export default memo(SearchBarContainer);

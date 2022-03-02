import { Box } from '@mui/material';
import MainContext from 'context';
import { useRouter } from 'next/router';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import SearchBar from './SearchBar';

const useSearch = (initVal = '') => {
  const router = useRouter();
  const [val, setVal] = useState(initVal);
  const { state, setState } = useContext(MainContext);

  const handleSearch = useCallback(() => {
    setState({ searchVal: val });
    router.push({
      pathname: '/search/[searchVal]',
      query: {
        searchVal: val,
      },
    });
  }, [val]);

  const handleChange = useCallback((e: any) => {
    setVal(e.target.value);
  }, []);

  useEffect(() => {
    const searchVal = router.query.searchVal as string;
    console.log(searchVal);
    if (!searchVal) {
      setVal('');
      return;
    }
    setVal(searchVal);
    // if(!router.query)
  }, [router.query.searchVal]);

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

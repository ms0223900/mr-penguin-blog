import {
  CloseRounded,
  SearchOutlined,
  TurnRightOutlined,
} from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import { Callback } from 'common-types';
import useToggle from 'lib/custom-hooks/useToggle';
import React, { ChangeEvent, memo, useEffect, useRef } from 'react';
import styles from './search-bar.module.scss';

export interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
  onSearch: Callback;
}

const SearchBar = (props: SearchBarProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const { toggle, handleToggle, setToggle } = useToggle();
  const { value, onChange, onSearch } = props;
  // console.log(toggle);

  useEffect(() => {
    if (inputRef.current && toggle) {
      [...inputRef.current.getElementsByTagName('input')].forEach((el) =>
        el.focus()
      );
    }
  }, [toggle]);

  return (
    <Box
      className={styles['search-bar']}
      style={{
        position: toggle ? 'fixed' : 'relative',
      }}
    >
      <Box
        className={
          toggle
            ? styles['search-input--wrapper-expanded']
            : styles['search-input--wrapper']
        }
        display={'flex'}
        alignItems={'center'}
      >
        <TextField
          ref={inputRef}
          fullWidth={true}
          autoFocus={true}
          placeholder={'找所有文章(加上@可以利用標籤過濾)'}
          value={value}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          onChange={onChange}
          variant={'outlined'}
        />
        <Button onClick={onSearch}>
          <SearchOutlined />
        </Button>
      </Box>
      <Box className={styles['mobile-search-btn']} onClick={handleToggle}>
        {toggle ? <TurnRightOutlined /> : <SearchOutlined />}
      </Box>
    </Box>
  );
};

export default memo(SearchBar);

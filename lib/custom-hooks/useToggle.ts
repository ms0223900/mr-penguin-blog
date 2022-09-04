import { useState, useCallback } from 'react';

const useToggle = (initToggle = false) => {
  const [toggle, setToggle] = useState(initToggle);

  const handleToggle = useCallback(() => {
    setToggle((s) => !s);
  }, []);

  const handleClose = useCallback(() => {
    setToggle(false);
  }, []);

  return {
    toggle,
    setToggle,
    handleToggle,
    handleClose,
  };
};

export default useToggle;

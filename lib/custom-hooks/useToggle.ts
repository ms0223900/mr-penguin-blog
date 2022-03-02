import { useState, useCallback } from 'react';

const useToggle = (initToggle = false) => {
  const [toggle, setToggle] = useState(initToggle);

  const handleToggle = useCallback(() => {
    setToggle((s) => !s);
  }, []);

  return {
    toggle,
    setToggle,
    handleToggle,
  };
};

export default useToggle;

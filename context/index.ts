/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export interface InitState {
  searchVal: string;
}

export const initState: InitState = {
  searchVal: '',
};

const MainContext = createContext({
  state: initState,
  setState: (s: Partial<InitState>) => s,
});

export default MainContext;

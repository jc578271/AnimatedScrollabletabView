import {SharedValue, useSharedValue} from 'react-native-reanimated';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

interface ITab {
  title: string;
  content: JSX.Element | null;
}

interface IValue {
  animatedIndex: SharedValue<number>;
  tabs: ITab[]
}

const Context = createContext<IValue | null>(null);

export const useAnimatedScrollableView = () => useContext(Context) as IValue;


interface Props extends PropsWithChildren{
  tabs: ITab[]
}

export const AnimatedScrollableProvider = ({ tabs, children }: Props) => {
  const animatedIndex = useSharedValue(0);

  const value = useMemo(
    () => ({
      animatedIndex,
      tabs
    }),
    [animatedIndex, tabs],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export * from './AnimatedScrollableTabBar';
export * from './AnimatedScrollableContent';

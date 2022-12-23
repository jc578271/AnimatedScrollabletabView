import Animated, { SharedValue, useAnimatedRef, useSharedValue } from "react-native-reanimated";
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
  tabs: ITab[];
  scrollRef: React.RefObject<Animated.ScrollView>
}

const Context = createContext<IValue | null>(null);

export const useAnimatedScrollableView = () => useContext(Context) as IValue;


interface Props extends PropsWithChildren{
  tabs: ITab[]
}

export const AnimatedScrollableProvider = ({ tabs, children }: Props) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const animatedIndex = useSharedValue(0);

  const value = useMemo(
    () => ({
      scrollRef,
      animatedIndex,
      tabs
    }),
    [animatedIndex, tabs, scrollRef],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export * from './AnimatedScrollableTabBar';
export * from './AnimatedScrollableContent';

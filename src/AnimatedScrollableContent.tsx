import React, {memo, RefObject, useCallback, useState} from 'react';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {ScrollViewProps} from 'react-native';
import {useAnimatedWindow} from './context/AnimayedWindowContext';
import {useAnimatedScrollableView} from './index';
import {memoForwardRef} from './utils/memoForwardRef';

export const AnimatedScrollableContent = memoForwardRef(
  (props: ScrollViewProps, ref: RefObject<Animated.ScrollView>) => {
    const {width: windowWidth} = useAnimatedWindow();
    const {animatedIndex, tabs, scrollRef} = useAnimatedScrollableView();

    const onScroll = useAnimatedScrollHandler({
      onScroll: e => {
        animatedIndex.value = e.contentOffset.x / windowWidth.value;
      },
    });

    const staticIndex = useDerivedValue(
      () => Math.round(animatedIndex.value),
      [animatedIndex],
    );

    const timout = useCallback(
      (_prevIndex: number, _width: number) => {
        setTimeout(() => {
          scrollRef.current?.scrollTo({x: _prevIndex * _width, animated: true});
        }, 50);
      },
      [scrollRef],
    );

    /**
     * handle when rotate screen
     */
    useAnimatedReaction(
      () => ({_width: windowWidth.value, _index: staticIndex.value}),
      (cur, prev) => {
        const {_width} = cur;
        const _prevWidth = prev?._width;
        const _prevIndex = prev?._index || 0;
        if (_width != _prevWidth) {
          runOnJS(timout)(_prevIndex, _width);
        }
      },
    );

    return (
      <Animated.ScrollView
        ref={scrollRef}
        horizontal={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
        pagingEnabled={true}
        {...props}>
        {tabs.map((item, index) => (
          <Item
            animatedIndex={animatedIndex}
            content={item.content}
            index={index}
            windowWidth={windowWidth}
          />
        ))}
      </Animated.ScrollView>
    );
  },
);

const Item = memo(
  ({
    animatedIndex,
    content,
    index,
    windowWidth,
  }: {
    animatedIndex: SharedValue<number>;
    content: JSX.Element | null;
    index: number;
    windowWidth: SharedValue<number>;
  }) => {
    const animatedItemStyle = useAnimatedStyle(() => ({
      width: windowWidth.value,
    }));

    const [mounted, setMounted] = useState(false);

    /**
     * only mount if index == current index
     */
    useAnimatedReaction(
      () => animatedIndex.value,
      _aIndex => {
        if (index === _aIndex) {
          runOnJS(setMounted)(true);
        }
      },
    );

    return (
      <Animated.View style={[animatedItemStyle, {flex: 1}]}>
        {mounted ? content : null}
      </Animated.View>
    );
  },
);

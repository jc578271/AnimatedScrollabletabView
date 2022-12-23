import Animated, {
  interpolate,
  scrollTo,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue, useWorkletCallback
} from "react-native-reanimated";
import React, { memo, useCallback } from "react";
import { LayoutChangeEvent, TouchableOpacityProps, View } from "react-native";
import styled, { useTheme } from  'styled-components/native';
import { useAnimatedScrollableView } from "./index";
import { useAnimatedWindow } from "./context/AnimayedWindowContext";
import { memoForwardRef } from "./utils/memoForwardRef";

import { Fonts } from "@base/uikit";

interface ILayout {
  left: number;
  width: number;
}

export const AnimatedScrollableTabBar = memoForwardRef(() => {
  const _ref = useAnimatedRef<Animated.ScrollView>();

  const {width: windowWidth} = useAnimatedWindow();

  const {animatedIndex, tabs, scrollRef} = useAnimatedScrollableView();

  const itemLayout = useSharedValue<{[id: string]: ILayout}>({});

  const inputRange = useDerivedValue(
    () => Object.keys(itemLayout.value).map(i => parseInt(i)),
    [itemLayout],
  );

  const outputLeftRange = useDerivedValue(
    () => Object.values(itemLayout.value).map(i => i.left),
    [itemLayout],
  );

  const outputWidthRange = useDerivedValue(
    () => Object.values(itemLayout.value).map(i => i.width),
    [itemLayout],
  );

  const outputScrollRange = useDerivedValue(() => {
    return Object.values(itemLayout.value).map((item, index) => {
      return Math.max(item.left - (windowWidth.value - item.width) / 2, 0);
    });
  }, [itemLayout]);

  useAnimatedReaction(
    () => animatedIndex.value,
    _aIndex => {
      scrollTo(
        _ref,
        inputRange.value.length
          ? interpolate(_aIndex, inputRange.value, outputScrollRange.value)
          : 0,
        0,
        false,
      );
    },
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: inputRange.value.length
        ? interpolate(
            animatedIndex.value,
            inputRange.value,
            outputLeftRange.value,
          )
        : 0,
      width: inputRange.value.length
        ? interpolate(
            animatedIndex.value,
            inputRange.value,
            outputWidthRange.value,
          )
        : 0,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    minWidth: windowWidth.value,
  }));

  const onTabPress = useWorkletCallback(
    (index: number) => () => {
      scrollRef.current?.scrollTo({
        x: index * windowWidth.value,
        animated: true,
      });
    },
    [scrollRef.current],
  );

  return (
    <View>
      <Animated.ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        ref={_ref}>
        <Animated.View
          style={[animatedContainerStyle, {flexDirection: 'row', flex: 1}]}>
          {tabs.map((item, index) => (
            <TabView
              key={index}
              title={item.title}
              index={index}
              animatedIndex={animatedIndex}
              itemLayout={itemLayout}
              onPress={onTabPress(index)}
            />
          ))}
        </Animated.View>
        <SUnderline style={animatedStyles} />
      </Animated.ScrollView>
    </View>
  );
});

const TabView = memo(
  ({
    title,
    index,
    itemLayout,
    animatedIndex,
    ...rest
  }: {
    title: string;
    index: number;
    itemLayout: SharedValue<{[id: string]: ILayout}>;
    animatedIndex: SharedValue<number>;
  } & TouchableOpacityProps) => {
    const aLeft = useSharedValue(0);
    const aWidth = useSharedValue(0);

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        aLeft.value = e.nativeEvent.layout.x;
        aWidth.value = e.nativeEvent.layout.width;
      },
      [aLeft, aWidth],
    );

    useAnimatedReaction(
      () => ({_aLeft: aLeft.value, _aWidth: aWidth.value}),
      cur => {
        const {_aLeft, _aWidth} = cur;
        itemLayout.value = {
          ...itemLayout.value,
          [index.toString()]: {
            left: _aLeft,
            width: _aWidth,
          },
        };
      },
      [index],
    );

    const theme = useTheme();

    const animatedTextStyle = useAnimatedStyle(() => ({
      fontFamily:
        Math.round(animatedIndex.value) == index ? Fonts.Medium : Fonts.Normal,
      color:
        Math.round(animatedIndex.value) == index ? theme.grey1 : theme.grey2,
    }));

    return (
      <STabContainer {...rest} onLayout={onLayout}>
        <SText style={animatedTextStyle}>{title}</SText>
      </STabContainer>
    );
  },
);

const STabContainer = styled.TouchableOpacity`
  padding: 16px 20px;
  background-color: yellow;
  flex: 1;
  align-items: center;
`;

const SText = styled(Animated.Text)``;

const SUnderline = styled(Animated.View)`
  position: absolute;
  height: 2px;
  background-color: red;
  bottom: 0;
`;

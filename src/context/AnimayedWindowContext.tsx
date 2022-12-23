import {
  runOnUI,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
} from "react-native-reanimated";
import { Dimensions, ScaledSize } from "react-native";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";

interface Props {
  width: SharedValue<any>;
  height: SharedValue<any>;
}

const Context = createContext<Props | null>(null);

export const AnimatedWindowProvider = (props: PropsWithChildren) => {
  const window = useSharedValue(Dimensions.get("window"));

  const handleWindow = useWorkletCallback(
    ({ window: _window }: { window: ScaledSize }) => {
      window.value = _window;
    }
  );

  useEffect(() => {
    Dimensions.addEventListener("change", runOnUI(handleWindow));
  }, []);

  const width = useDerivedValue(
    () => (window.value ? window.value.width : 0),
    [window]
  );
  const height = useDerivedValue(
    () => (window.value ? window.value.height : 0),
    [window]
  );

  const value = useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export const useAnimatedWindow = () => {
  return useContext(Context) as Props;
};

// export const [AnimatedWindowProvider, useAnimatedWindow] = constate(useAnimatedWindowProvider, value => value)

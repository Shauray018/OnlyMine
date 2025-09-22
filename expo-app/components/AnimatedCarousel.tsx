// import {
//   FlatList,
//   FlatListProps,
//   ListRenderItem,
//   ViewProps,
//   ViewStyle,
//   useWindowDimensions,
// } from "react-native";
// import Animated, {
//   AnimatedSensor,
//   Extrapolation,
//   SensorType,
//   SharedValue,
//   ValueRotation,
//   interpolate,
//   measure,
//   useAnimatedRef,
//   useAnimatedScrollHandler,
//   useAnimatedSensor,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";

// const AnimatedFlatList =
//   Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);
// // Types
// type CarouselProps<T> = FlatListProps<T> & {
//   renderItem: ListRenderItem<T>;
//   onChange?: (index: number) => void;
//   style?: ViewStyle;
//   itemSize?: number;
//   renderOverlayComponent?: ListRenderItem<T>;
//   overlayComponentStyle?: ViewStyle;
//   cellStyle?: ViewStyle;
// };

// type AnimatedItemProps = ViewProps & {
//   scrollX: SharedValue<number>;
//   index: number;
// };
// type AnimatedWrapperProps = AnimatedItemProps & {
//   sensor: AnimatedSensor<ValueRotation>;
// };

// function clamp(value: number, min: number, max: number) {
//   "worklet";
//   return Math.min(Math.max(value, min), max);
// }

// function AnimatedWrapper({
//   scrollX,
//   index,
//   style,
//   sensor,
//   children,
// }: AnimatedWrapperProps) {
//   const rotateY = useDerivedValue(() => {
//     const { roll } = sensor.sensor.value;
//     const angle = clamp(roll, -Math.PI / 4, Math.PI / 4);
//     return withSpring(-angle);
//   });
//   const rotateX = useDerivedValue(() => {
//     const { pitch } = sensor.sensor.value;
//     // Compensate the "default" angle that a user might hold the phone at :)
//     // 40 degrees to radians
//     const angle = clamp(pitch, -Math.PI / 2, Math.PI) - 40 * (Math.PI / 180);
//     return withSpring(-angle);
//   });
//   const translateX = useDerivedValue(() => {
//     return withSpring(-rotateY.value * 50);
//   });
//   const translateY = useDerivedValue(() => {
//     return withSpring(rotateX.value * 50);
//   });
//   //@ts-ignore
//   const stylez = useAnimatedStyle(() => {
//     return {
//       overflow: "hidden",
//       zIndex: Math.floor(
//         interpolate(
//           scrollX.value,
//           [index - 1, index, index + 1],
//           [0, 10000, 0],
//           Extrapolation.CLAMP
//         )
//       ),
//       transform: [
//         {
//           perspective: 1000,
//         },
//         {
//           rotateY: `${interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [0, rotateY.value, 0],
//             Extrapolation.CLAMP
//           )}rad`,
//         },
//         {
//           rotateX: `${interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [0, rotateX.value, 0],
//             Extrapolation.CLAMP
//           )}rad`,
//         },
//         {
//           translateY: interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [0, translateY.value, 0],
//             Extrapolation.CLAMP
//           ),
//         },
//         {
//           translateX: interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [0, translateX.value, 0],
//             Extrapolation.CLAMP
//           ),
//         },
//         {
//           rotateZ: `${interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [15, 0, -15],
//             Extrapolation.CLAMP
//           )}deg`,
//         },
//         {
//           scale: interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [0.9, 1, 0.9],
//             Extrapolation.CLAMP
//           ),
//         },
//       ],
//     };
//   });

//   return <Animated.View style={[style, stylez]}>{children}</Animated.View>;
// }

// function AnimatedWrapperDetails({
//   scrollX,
//   index,
//   style,
//   children,
// }: AnimatedItemProps) {
//   const ref = useAnimatedRef();
//   const stylez = useAnimatedStyle(() => {
//     const measurements = measure(ref);
//     return {
//       opacity: interpolate(
//         scrollX.value,
//         [index - 1, index, index + 1],
//         [0, 1, 0],
//         Extrapolation.CLAMP
//       ),
//       transform: [
//         {
//           translateY: interpolate(
//             scrollX.value,
//             [index - 1, index, index + 1],
//             [measurements?.height ?? 100, 0, measurements?.height ?? 100],
//             Extrapolation.CLAMP
//           ),
//         },
//       ],
//     };
//   });
//   return (
//     <Animated.View style={[style, stylez]} ref={ref}>
//       {children}
//     </Animated.View>
//   );
// }

// export function Carousel<T>({
//   renderItem,
//   renderOverlayComponent,
//   overlayComponentStyle,
//   cellStyle,
//   itemSize = 0.65,
//   ...rest
// }: CarouselProps<T>) {
//   const { width } = useWindowDimensions();
//   const listItemSize = itemSize * width;

//   const scrollX = useSharedValue(0);
//   const onScroll = useAnimatedScrollHandler((e) => {
//     scrollX.value = e.contentOffset.x / listItemSize;
//   });
//   const sensor = useAnimatedSensor(SensorType.ROTATION, {
//     interval: 20,
//   });
//   return (
//     <AnimatedFlatList
//       {...rest}
//       horizontal
//       onScroll={onScroll}
//       scrollEventThrottle={1000 / 60}
//       CellRendererComponent={({ children, index, style, ...props }) => {
//         return (
//           <AnimatedWrapper
//             sensor={sensor}
//             style={[
//               style,
//               { width: listItemSize, height: listItemSize * 1.55 },
//               cellStyle,
//             ]}
//             {...props}
//             scrollX={scrollX}
//             index={index}>
//             {children}
//           </AnimatedWrapper>
//         );
//       }}
//       style={[rest.style]}
//       contentContainerStyle={[
//         rest.contentContainerStyle,
//         { paddingHorizontal: (width - listItemSize) / 2 },
//       ]}
//       snapToInterval={listItemSize}
//       decelerationRate={"fast"}
//       showsHorizontalScrollIndicator={false}
//       renderItem={(props) => {
//         return (
//           <>
//             {renderItem(props)}
//             <AnimatedWrapperDetails
//               style={[overlayComponentStyle]}
//               index={props.index}
//               scrollX={scrollX}>
//               {renderOverlayComponent?.(props)}
//             </AnimatedWrapperDetails>
//           </>
//         );
//       }}
//     />
//   );
// }
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  ViewProps,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import Animated, {
  AnimatedSensor,
  Extrapolation,
  SensorType,
  SharedValue,
  ValueRotation,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<any>>(FlatList);
// Types
type CarouselProps<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>;
  onChange?: (index: number) => void;
  style?: ViewStyle;
  itemSize?: number;
  renderOverlayComponent?: ListRenderItem<T>;
  overlayComponentStyle?: ViewStyle;
  cellStyle?: ViewStyle;
};

type AnimatedItemProps = ViewProps & {
  scrollX: SharedValue<number>;
  index: number;
};
type AnimatedWrapperProps = AnimatedItemProps & {
  sensor: AnimatedSensor<ValueRotation>;
};

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

function AnimatedWrapper({
  scrollX,
  index,
  style,
  sensor,
  children,
}: AnimatedWrapperProps) {
  const rotateY = useDerivedValue(() => {
    const { roll } = sensor.sensor.value;
    // Reduced intensity: from -Math.PI / 4 to -Math.PI / 8 (half the range)
    const angle = clamp(roll, -Math.PI / 6, Math.PI / 6);
    return withSpring(-angle * 0.5); // Reduced multiplier from 1 to 0.3
  });
  const rotateX = useDerivedValue(() => {
    const { pitch } = sensor.sensor.value;
    // Reduced intensity: smaller range and multiplier
    const angle = clamp(pitch, -Math.PI / 4, Math.PI / 2) - 40 * (Math.PI / 180);
    return withSpring(-angle * 0.5); // Reduced multiplier from 1 to 0.3
  });
  const translateX = useDerivedValue(() => {
    // Reduced translation: from 50 to 20
    return withSpring(-rotateY.value * 20);
  });
  const translateY = useDerivedValue(() => {
    // Reduced translation: from 50 to 20
    return withSpring(rotateX.value * 20);
  });
  //@ts-ignore
  const stylez = useAnimatedStyle(() => {
    return {
      overflow: "hidden",
      zIndex: Math.floor(
        interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0, 10000, 0],
          Extrapolation.CLAMP
        )
      ),
      transform: [
        {
          perspective: 1000,
        },
        {
          rotateY: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0, rotateY.value, 0],
            Extrapolation.CLAMP
          )}rad`,
        },
        {
          rotateX: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0, rotateX.value, 0],
            Extrapolation.CLAMP
          )}rad`,
        },
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0, translateY.value, 0],
            Extrapolation.CLAMP
          ),
        },
        {
          translateX: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0, translateX.value, 0],
            Extrapolation.CLAMP
          ),
        },
        {
          rotateZ: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [15, 0, -15],
            Extrapolation.CLAMP
          )}deg`,
        },
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return <Animated.View style={[style, stylez]}>{children}</Animated.View>;
}

function AnimatedWrapperDetails({
  scrollX,
  index,
  style,
  children,
}: AnimatedItemProps) {
  const ref = useAnimatedRef();
  const stylez = useAnimatedStyle(() => {
    const measurements = measure(ref);
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [measurements?.height ?? 100, 0, measurements?.height ?? 100],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[style, stylez]} ref={ref}>
      {children}
    </Animated.View>
  );
}

export function Carousel<T>({
  renderItem,
  renderOverlayComponent,
  overlayComponentStyle,
  cellStyle,
  itemSize = 0.65,
  ...rest
}: CarouselProps<T>) {
  const { width } = useWindowDimensions();
  const listItemSize = itemSize * width;

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / listItemSize;
  });
  const sensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 20,
  });
  return (
    <AnimatedFlatList
      {...rest}
      horizontal
      onScroll={onScroll}
      scrollEventThrottle={1000 / 60}
      CellRendererComponent={({ children, index, style, ...props }) => {
        return (
          <AnimatedWrapper
            sensor={sensor}
            style={[
              style,
              { width: listItemSize, height: listItemSize * 1.55 },
              cellStyle,
            ]}
            {...props}
            scrollX={scrollX}
            index={index}>
            {children}
          </AnimatedWrapper>
        );
      }}
      style={[rest.style]}
      contentContainerStyle={[
        rest.contentContainerStyle,
        { paddingHorizontal: (width - listItemSize) / 2 },
      ]}
      snapToInterval={listItemSize}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={false}
      renderItem={(props) => {
        return (
          <>
            {renderItem(props)}
            <AnimatedWrapperDetails
              style={[overlayComponentStyle]}
              index={props.index}
              scrollX={scrollX}>
              {renderOverlayComponent?.(props)}
            </AnimatedWrapperDetails>
          </>
        );
      }}
    />
  );
}
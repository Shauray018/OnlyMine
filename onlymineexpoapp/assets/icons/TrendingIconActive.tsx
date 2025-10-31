import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const TrendingIconActive = (props: SvgProps) => (
  <Svg
  //@ts-ignore
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#00FF28"
        d="M22.5 1.117s1.233 4.416 1.233 8c0 3.433-2.25 6.225-5.691 6.225C14.6 15.342 12 12.558 12 9.117l.042-.6a23.03 23.03 0 0 0-5.375 14.816c0 7.367 5.966 13.334 13.333 13.334S33.333 30.7 33.333 23.333c0-8.991-4.325-17.008-10.833-22.216Zm-2.983 30.55c-2.967 0-5.375-2.342-5.375-5.234 0-2.708 1.741-4.608 4.691-5.2 2.95-.591 6-2.008 7.692-4.291.65 2.15.992 4.416.992 6.725 0 4.408-3.584 8-8 8Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#00FF28" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export  default TrendingIconActive

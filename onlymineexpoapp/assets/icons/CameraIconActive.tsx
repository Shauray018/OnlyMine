import * as React from "react"
import Svg, { SvgProps, G, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const CameraIconActive = (props: SvgProps) => (
  <Svg
  //@ts-ignore
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Path fill="#000" d="M0 0h60v60H0z" />
      <Path
        stroke="#00FF28"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3.5}
        d="m35.775 20 14.35 24.85M24.225 20h28.7M18.45 30 32.8 5.15M24.225 40 9.875 15.15M35.775 40h-28.7M41.55 30 27.2 54.85M55 30c0 13.807-11.193 25-25 25S5 43.807 5 30 16.193 5 30 5s25 11.193 25 25Z"
      />
    </G>
    <Defs></Defs>
  </Svg>
)
export default CameraIconActive

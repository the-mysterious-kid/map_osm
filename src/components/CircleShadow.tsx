// components/SemiCircleShadow.tsx

import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Path } from 'react-native-svg';

const CircleShadow = ({ size = 300 }: { size?: number }) => {
    const radius = size / 2;

    return (
        <View style={{ width: size, height: radius, alignItems: 'center', justifyContent: 'flex-end', position: 'absolute' }}>
            <Svg width={size} height={radius} viewBox={`0 0 ${size} ${radius}`}>
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="50%"
                        cy="100%"
                        rx="50%"
                        ry="100%"
                        fx="50%"
                        fy="100%"
                    >
                        <Stop offset="0%" stopColor="#00000033" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#00000000" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Draw top half arc */}
                <Path
                    d={`
            M0,${radius}
            A${radius},${radius} 0 0 1 ${size},${radius}
            L${size},${radius}
            L0,${radius}
          `}
                    fill="url(#grad)"
                />
            </Svg>
        </View>
    );
}
export default CircleShadow
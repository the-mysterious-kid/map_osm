import { View, Text, ViewStyle, TextStyle, useWindowDimensions, ImageSourcePropType, Platform, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';
import isEmpty from 'lodash/isEmpty'
import Animated from 'react-native-reanimated';

type ToolTipItemType = {
    index: number;
    label: string;
    value: string;
    tooltipValue?: string;
}
type BarChartComponentPropTypes = {
    data?: unknown;
    customBarStyle?: ViewStyle;
    barSpacing?: number;
    barWidth?: number;
    autoAdjustChartWidth?: boolean;
    yAxisTextStyle?: TextStyle;
    initialBarSpacing?: number;
    leftShiftForTooltip?: number;
    leftShiftForLastIndexTooltip?: number;
    xAxisLabelTextStyle?: ViewStyle;
    YAxisLabels?: string[];
    customToolTipBox?: ViewStyle,
    customTooltipTriangle?: ViewStyle,
    customToolTipStyle?: ViewStyle,
    count?: boolean;
    apiKey?: string
    title?: string
    dropDown?: boolean,
    dropDownData?: unknown
    serviceType?: unknown
    value?: number | string
    onChange?: (value: string) => void
    totalAmount?: number | string
    customHorizontalRulesStyle?: ViewStyle;
    focusedBarStyle?: ViewStyle;
    focusedBarWidth?: number | unknown,
    dropDownImage?: ImageSourcePropType,
    customBarSpace?: number,
    divisionId?: string,
    suffixText?: string
}

type apiProps = {
    fromDate: string;
    toDate: string;
    serviceType?: string | number | unknown
    storeNumber?: number | string
    divisionId?: number | string
}

const BarChartComponent: React.FC<BarChartComponentPropTypes> = (props) => {
    const { customBarStyle, autoAdjustChartWidth, yAxisTextStyle, initialBarSpacing, leftShiftForTooltip, leftShiftForLastIndexTooltip, xAxisLabelTextStyle, barWidth, customToolTipBox, customTooltipTriangle, customToolTipStyle, count, apiKey, title, dropDown = false, serviceType, onChange, value, dropDownData, totalAmount, focusedBarStyle, dropDownImage, customBarSpace, divisionId, suffixText } = props;
    const [graphMax, setMax] = useState<number>()
    const [axisData, setAxisData] = useState<object>([])
    const [chartData, setChartData] = useState([{ "label": "Jan 2024", "value": 798093 }, { "label": "Feb 2024", "value": 975811 }, { "label": "Mar 2024", "value": 589448 }, { "label": "Apr 2024", "value": 704881 }, { "label": "May 2024", "value": 649495 }, { "label": "Jun 2024", "value": 352050 }, { "label": "Jul 2024", "value": 220569 }, { "label": "Aug 2024", "value": 261840 }, { "label": "Sep 2024", "value": 533369 }, { "label": "Oct 2024", "value": 750171 }, { "label": "Nov 2024", "value": 895081 }, { "label": "Dec 2024", "value": 1123917 }])
    const [isLoading, setLoading] = useState(false)
    const [rangePoint, setRangePoint] = useState(new Array(3).fill(null))
    const [pagingIndex, setPagingIndex] = useState(0);
    const Dimensions = useWindowDimensions()
    const WIDTH = Dimensions?.width
    const HEIGHT = Dimensions?.height
    const isLandscape = false
    const isTablet = true


    const ToolTipComponent = (item: ToolTipItemType) => {
        let minimumWidth = 0;
        if (barWidth) {
            minimumWidth = barWidth;
        } else if (count) {
            minimumWidth = WIDTH * .11;
        };
        const isMinus = String(item?.value)?.includes("-")
        return (
            <View style={[{ alignItems: 'center', right: isTablet ? WIDTH * .01 : WIDTH * .0092 }, customToolTipStyle, isMinus && { top: isTablet ? isLandscape ? Platform.OS == "android" ? scale(80) : scale(85) : scale(115) : Platform.OS == "android" ? scale(165) : scale(160) }]}>
                <View
                    style={[
                        { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#DEEAFE', borderRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1, },
                        !isTablet && { minWidth: minimumWidth, padding: WIDTH * 0.02, },
                        isTablet && { minWidth: WIDTH * .08, padding: WIDTH * 0.01 },
                        customToolTipBox
                    ]}>
                    <Text style={[{ fontSize: 12 }, { color: 'black' }, isTablet && { fontSize: 13 }]}>{count ? item.value || 0 : `${item.value || 0} ${'qar'}`}</Text>
                </View>
                <View style={[{ padding: 8, backgroundColor: '#ffffff', width: 10, transform: [{ rotate: '45deg' }], marginTop: -10, shadowOpacity: 0.9, elevation: 2, zIndex: -1 }, customTooltipTriangle]} />
            </View >
        )
    }

    const CustomFocusedBar = () => {
        return (
            <View style={[{ width: barWidth ? barWidth : WIDTH * 0.11, alignSelf: 'center', height: HEIGHT }, isTablet && { width: barWidth ? barWidth : WIDTH * 0.08 }]}>
                {/* <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#BCD5FD', '#ffffff']}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={[{ backgroundColor: '#BCD5FD', width: barWidth ? barWidth * 0.6 : WIDTH * 0.05, height: HEIGHT, }, isTablet && { width: barWidth ? barWidth * 0.5 : WIDTH * 0.04 }, focusedBarStyle]} />
                </LinearGradient> */}
            </View>
        )
    }

    const handleBarSpacing = () => {
        const bW = handleBarWidth()
        const screenWidth = Dimensions?.width;
        const barSpace = (screenWidth - (chartData?.length * 1.5 * bW)) / chartData?.length + 1
        if (customBarSpace) {
            return customBarSpace
        } else if (barSpace < 10) {
            return isTablet ? 30 : 17
        } else {
            return barSpace
        }
    }

    const handleCustomBarStyle = () => {
        if (customBarStyle) {
            return customBarStyle
        } else if (isTablet) {
            return { width: WIDTH * 0.08, paddingHorizontal: WIDTH * .02, alignItems: 'center' }
        } else {
            return { width: WIDTH * 0.11, backgroundColor: 'transparent', paddingHorizontal: WIDTH * 0.03, alignItems: 'center', }
        }
    }


    const handleBarWidth = () => {
        if (barWidth) {
            return barWidth
        } else if (isTablet) {
            return WIDTH * .08
        } else {
            return WIDTH * .11
        }
    }


    return (
        <>
            {title && (
                <>
                    <Text style={[{ fontSize: 21 }, { color: 'black' }]}>{title}</Text>
                    <View style={{ height: HEIGHT * 0.01 }} />
                </>
            )}
            {!isEmpty(dropDownData) && <View>
                {/* <DropdownComponent data={dropDownData || []} value={value} totalRevenue={(totalAmount || 0)} onChange={onChange} dropDownImage={dropDownImage} suffixText={suffixText} /> */}
            </View>}

            <View style={{ overflow: 'scroll' }} >
                <BarChart
                    data={chartData || []}
                    // onScroll={(event) => handleScroll(event)}
                    barWidth={handleBarWidth()}
                    adjustToWidth={autoAdjustChartWidth}
                    barStyle={handleCustomBarStyle()}
                    dashWidth={isTablet ? WIDTH * 0.005 : WIDTH * 0.008}
                    dashGap={isTablet ? WIDTH * 0.005 : WIDTH * 0.01}
                    focusBarOnPress={true}
                    focusedBarIndex={0}
                    mostNegativeValue={0}
                    scrollEventThrottle={16}
                    focusedBarConfig={{
                        barInnerComponent: () => <CustomFocusedBar />
                    }}
                    frontColor={'#79AAFA'}
                    height={HEIGHT * 0.2}
                    isAnimated
                    initialSpacing={initialBarSpacing ? initialBarSpacing : isTablet ? 10 : isLandscape ? Dimensions.width * 0.01 : Dimensions?.width * 0.05}
                    noOfSections={4}
                    noOfVerticalLines={3}
                    horizontalRulesStyle={{ overflow: 'visible', marginLeft: WIDTH * -0.1 }}
                    rulesLength={Dimensions?.width}
                    rulesType={'dashed'}
                    renderTooltip={(item, index: number) => <ToolTipComponent {...item} index={index} />}
                    leftShiftForTooltip={leftShiftForTooltip ? leftShiftForTooltip : WIDTH * -0.01}
                    leftShiftForLastIndexTooltip={leftShiftForLastIndexTooltip ? leftShiftForLastIndexTooltip : WIDTH * -0.01}
                    autoCenterTooltip={true}
                    spacing={handleBarSpacing()}
                    xAxisLength={Dimensions?.width}
                    xAxisTextNumberOfLines={2}
                    xAxisLabelTextStyle={[isTablet ? { fontSize: 13 } : { fontSize: 12 }, { color: `${'#000000'}95`, alignSelf: 'center', width: isTablet ? WIDTH * 0.1 : WIDTH * 0.05 }, xAxisLabelTextStyle, !isTablet && { minWidth: WIDTH * .2 }]}
                    xAxisColor={'lightgrey'}
                    xAxisType={'dashed'}
                    yAxisTextStyle={[{ fontSize: 12 }, { color: `${'#000000'}90`, marginTop: -WIDTH * 0.045, minWidth: isTablet ? WIDTH * 0.05 : WIDTH * 0.1, textAlign: 'left' }, isTablet && { marginTop: -WIDTH * 0.02, marginLeft: WIDTH * 0.0125 }, yAxisTextStyle]}
                    yAxisLabelWidth={isTablet ? WIDTH * 0.045 : WIDTH * 0.11}
                    yAxisThickness={0}
                    yAxisLabelTexts={axisData !== undefined ? axisData : ["0", "5M", "15M", "20M", "25M"]}
                    yAxisExtraHeight={isLandscape ? HEIGHT * 0.07 : HEIGHT * 0.05}
                    maxValue={graphMax}
                />
            </View>
        </>
    )
}

export default BarChartComponent
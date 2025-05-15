import { View, Text, ViewStyle, TextStyle, useWindowDimensions, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';

// import { HEIGHT, WIDTH } from '../constants/dimensions';

type ToolTipItemType = {
    index: number;
    label: string;
    value: string;
    eventsVisitors?: string | number
    generalAdmission?: string | number
}
type StackBarChartComponentPropTypes = {
    data?: unknown;
    customBarStyle?: ViewStyle;
    barSpacing?: number;
    autoAdjustChartWidth?: boolean;
    chartWidth?: number;
    focusedBarWidth?: number;
    yAxisTextStyle?: TextStyle;
    initialBarSpacing?: number;
    leftShiftForTooltip?: number;
    leftShiftForLastIndexTooltip?: number;
    xAxisLabelTextStyle?: ViewStyle;
    YAxisLabels?: string[];
    title?: string
    apiKey?: string
    barWidth?: number
    dropDown?: boolean
}
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const stackBarData = [
    {
        stacks:
            [
                { value: 5.5, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 3, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Jan',
        // eventsVisitors: '1',
        // generalAdmission: '87',
    },
    {
        stacks:
            [
                { value: 3, color: ' #79AAFA', /* onPres: someFunction */ },
                { value: 2, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Feb',
        eventsVisitors: '75',
        generalAdmission: '15',
    },
    {
        stacks:
            [
                { value: 7, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 5, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Mar',
        eventsVisitors: '120',
        generalAdmission: '100',
    },
    {
        stacks:
            [
                { value: 9, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 6, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Apr',
        eventsVisitors: '300',
        generalAdmission: '187',
    },
    {
        stacks:
            [
                { value: 8, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 5, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'May',
        eventsVisitors: '118',
        generalAdmission: '70',
    },
    {
        stacks:
            [
                { value: 6, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 3, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Jun',
        eventsVisitors: '110',
        generalAdmission: '80',
    },
    {
        stacks:
            [
                { value: 7, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 3, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Jul',
        eventsVisitors: '120',
        generalAdmission: '80',
    },
    {
        stacks:
            [
                { value: 2.5, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 1.5, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Aug',
        eventsVisitors: '50',
        generalAdmission: '20',
    },
    {
        stacks:
            [
                { value: 4, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 2, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Sep',
        eventsVisitors: '70',
        generalAdmission: '40',
    },
    {
        stacks:
            [
                { value: 8, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 4, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Oct',
        eventsVisitors: '180',
        generalAdmission: '40',
    },
    {
        stacks:
            [
                { value: 5, color: '#79AAFA', /* onPres: someFunction */ },
                { value: 6, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Nov',
        eventsVisitors: '100',
        generalAdmission: '110',
    },
    {
        stacks:
            [
                { value: 10, color: '#79AAFA', marginRight: WIDTH * 0.1 /* onPres: someFunction */ },
                { value: 10, color: '#BCD5FD', /* onPres: someFunction */ },
            ],
        label: 'Dec',
        eventsVisitors: '190',
        generalAdmission: '90',
    },
];

const chartData = [
    {
        month: '2020-01',
        general_admissions_count: '5.5',
        events_count: '3'
    },
    {
        month: '2020-01',
        general_admissions_count: '10',
        events_count: '9'
    },
    {
        month: '2020-01',
        general_admissions_count: '10',
        events_count: '5'
    },
    {
        month: '2020-01',
        general_admissions_count: '12',
        events_count: '8'
    },
    {
        month: '2020-01',
        general_admissions_count: '9',
        events_count: '5'
    },
    {
        month: '2020-01',
        general_admissions_count: '11',
        events_count: '5'
    },
    {
        month: '2020-01',
        general_admissions_count: '5.5',
        events_count: '3'
    },
    {
        month: '2020-01',
        general_admissions_count: '10',
        events_count: '9'
    },
    {
        month: '2020-01',
        general_admissions_count: '10',
        events_count: '5'
    },
    {
        month: '2020-01',
        general_admissions_count: '12',
        events_count: '8'
    },
    {
        month: '2020-01',
        general_admissions_count: '9',
        events_count: '5'
    },
    {
        month: '2020-01',
        general_admissions_count: '11',
        events_count: '5'
    }
]




const StackBarChartComponent: React.FC<StackBarChartComponentPropTypes> = (props) => {
    const isLoading = true
    const { customBarStyle, barSpacing, autoAdjustChartWidth, chartWidth, yAxisTextStyle, focusedBarWidth, initialBarSpacing, leftShiftForTooltip, leftShiftForLastIndexTooltip, xAxisLabelTextStyle, title, apiKey, barWidth, dropDown } = props;
    const lang = 'en'
    const isLandscape = false
    const isTablet = false
    const Dimensions = useWindowDimensions()
    const WIDTH = Dimensions?.width
    const HEIGHT = Dimensions?.height
    const [graphMax, setMax] = useState<number>()
    const [axisData, setAxisData] = useState<object>([])
    const [stackChartData, setStackChartData] = useState()
    const [buttonActive, setButtonActive] = useState(false)
    const extractDataYaxis = () => {
        const minValue: number = 0;
        const maxTotalCount = Math.max(
            ...chartData?.map(item => Number(item.general_admissions_count) + Number(item.events_count))
        );
        console.log("maxValue", maxTotalCount);
        if (maxTotalCount > 0) {
            const buffer = maxTotalCount * 0.2;
            const step = (maxTotalCount + buffer) / 4;
            setMax(minValue + 4 * step)
            const yAxisData = [
                Math.round(minValue),
                Math.round(minValue + step),
                Math.round(minValue + 2 * step),
                Math.round(minValue + 3 * step),
                Math.round(minValue + 4 * step)
            ];

            const convertedData: object = numericAbrivation(yAxisData)

            setAxisData(convertedData)
        } else {
            setAxisData(["0", "5M", "15M", "20M", "25M"])
        }

    }

    useEffect(() => {
        let acc = []
        chartData.map((i) => {
            console.log("=========", i);
            acc.push({
                stacks: [
                    { value: parseInt(i?.general_admissions_count) || 0, color: '#79AAFA' },
                    { value: parseInt(i?.events_count) || 0, color: '#BCD5FD' }
                ],
                label: i?.month
            })
        })
        console.log("=======================", JSON.stringify(acc));
        setStackChartData(acc)
        extractDataYaxis()

    }, [])
    const numericAbrivation = (yArray: number[]) => {
        let abrivationArray: unknown[] = [];
        abrivationArray = yArray.map((item) => {

            const absValue = Math.abs(item)
            const length = absValue.toString().length
            if (absValue >= 1000000000) {
                return (item / 1000000000).toFixed(1) + 'B';
            } else if (absValue >= 1000000) {
                return (item / 1000000).toFixed(1) + 'M';
            } else if (absValue >= 1000) {
                return length > 5 ? (item / 1000).toFixed(1) + 'K' :
                    (item / 1000).toFixed(1) + 'K';
            } else {
                return item.toString();
            }
        })
        return abrivationArray
    }
    const handleBarSpacing = () => {
        const bW = isTablet ? WIDTH * 0.04 : WIDTH * 0.06
        const screenWidth = Dimensions?.width;
        const barSpace = (screenWidth - (chartData?.length * 1.5 * bW)) / chartData?.length + 1
        console.log("barSpace", barSpace);
        if (barSpace < 30) {
            return isTablet ? 50 : 40
        } else {
            return barSpace
        }
    }

    const ToolTipComponent = (item: ToolTipItemType) => {
        let marginLeft, marginRight;
        switch (item?.index) {
            case 0:
                marginLeft = (50)
                break;
            case 1:
                marginLeft = WIDTH * 0.1
                break;
            case (stackBarData.length - 1):
                marginRight = WIDTH * 0.12
                break;
            default:
                marginRight = 0;
                marginLeft = 0;
                break;
        }

        return (
            <View style={{ alignItems: 'center', top: HEIGHT * 0.075, }}>
                <View style={{ backgroundColor: '#FFFFFF', gap: HEIGHT * 0.005, borderWidth: 1, borderColor: `${'#000000'}10`, borderRadius: 4, padding: WIDTH * 0.02, justifyContent: 'center', alignItems: 'center', marginLeft: marginLeft, marginRight: marginRight, zIndex: 1 }}>
                    <View style={[{ minWidth: isTablet ? WIDTH * 0.15 : WIDTH * 0.3, justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={[{ gap: WIDTH * 0.01 }]}>
                            <View style={{ backgroundColor: '#79AAFA', width: WIDTH * 0.007, height: HEIGHT * 0.01 }} />
                            <Text style={[{ color: '#000000', }]}>{'events_visitors'}</Text>
                        </View>
                        {/* <Text style={[getFontStyle('bold'), commonStyle.font12, { color: '#000000', }]}>{item?.eventsVisitors}</Text> */}
                    </View>
                    <View style={[{ minWidth: isTablet ? WIDTH * 0.15 : WIDTH * 0.3, justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={[{ gap: WIDTH * 0.01 }]}>
                            <View style={{ backgroundColor: '#BCD5FD', width: WIDTH * 0.007, height: HEIGHT * 0.01 }} />
                            <Text style={[{ color: '#000000', }]}>{'general_admission'}</Text>
                        </View>
                        {/* <Text style={[getFontStyle('bold'), commonStyle.font12, { color: '#000000', }]}>{item?.generalAdmission}</Text> */}
                    </View>
                </View>
                <View style={{ width: 0, height: 0, borderLeftWidth: WIDTH * 0.02, borderRightWidth: WIDTH * 0.02, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FFFFFF', shadowOpacity: 0.5, shadowOffset: { height: HEIGHT * 0.001, width: WIDTH * 0.001 }, elevation: 2 }} />
            </View>
        )
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
    const CustomFocusedBar = () => {
        return (
            <View style={[{ width: barWidth ? barWidth : WIDTH * 0.11, alignSelf: 'center', height: HEIGHT }, isTablet && { width: barWidth ? barWidth : WIDTH * 0.08 }]}>
                <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#79AAFA', '#FFFFFF']}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={[{ backgroundColor: '#79AAFA', width: barWidth ? barWidth * 0.6 : WIDTH * 0.05, height: HEIGHT, }, isTablet && { width: barWidth ? barWidth * 0.5 : WIDTH * 0.04 }]} />
                </LinearGradient>
            </View>
        )
    }

    return (
        <BarChart
            stackData={stackChartData || []}
            data={stackChartData}
            // onEndReached={() => setButtonActive(false)}
            onScroll={() => setButtonActive(true)}
            barWidth={isTablet ? WIDTH * 0.04 : WIDTH * 0.06}
            adjustToWidth={autoAdjustChartWidth}
            barStyle={handleCustomBarStyle()}
            dashWidth={isTablet ? WIDTH * 0.005 : WIDTH * 0.008}
            dashGap={isTablet ? WIDTH * 0.005 : WIDTH * 0.01}
            focusedBarIndex={1}
            focusedBarConfig={{
                // width: focusedBarWidth,
                barInnerComponent: () => <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />,
                sideColor: '#000',
                topColor: '#546',
                gradientColor: 'red',
                width: 20,
                borderRadius: 2,
                roundedTop: true,
                roundedBottom: true,
                opacity: 1,

            }}
            disablePress={false}
            frontColor={'#BCD5FD'}
            height={HEIGHT * 0.2}
            isAnimated
            initialSpacing={initialBarSpacing ? initialBarSpacing : isTablet ? (10) : isLandscape ? Dimensions.width * 0.01 : Dimensions?.width * 0.05}
            noOfSections={4}
            noOfVerticalLines={3}
            horizontalRulesStyle={{ overflow: 'visible', marginLeft: isTablet ? WIDTH * -0.05 : WIDTH * -0.1 }}
            rulesLength={WIDTH}
            rulesType={'dashed'}
            renderTooltip={(item, index: number) => <ToolTipComponent {...item} index={index} />}
            // leftShiftForLastIndexTooltip={leftShiftForLastIndexTooltip ? leftShiftForLastIndexTooltip : WIDTH * -0.01}
            autoCenterTooltip={true}
            spacing={handleBarSpacing()}
            xAxisLength={Dimensions?.width}
            xAxisTextNumberOfLines={2}
            xAxisLabelTextStyle={[{ color: `#00000095`, alignSelf: 'center' }, xAxisLabelTextStyle, !isTablet && { minWidth: WIDTH * .2 }]}
            xAxisColor={'lightgrey'}
            xAxisType={'dashed'}
            yAxisTextStyle={[{ color: `#00000090`, marginTop: -WIDTH * 0.045, minWidth: isTablet ? WIDTH * 0.05 : WIDTH * 0.1, textAlign: 'left' }, isTablet && { marginTop: -WIDTH * 0.02, marginLeft: WIDTH * 0.0125 }, yAxisTextStyle]}
            yAxisLabelWidth={isTablet ? WIDTH * 0.045 : WIDTH * 0.11}
            yAxisThickness={0}
            yAxisLabelTexts={axisData !== undefined ? axisData : ["0", "5M", "15M", "20M", "25M"]}
            yAxisExtraHeight={isLandscape ? HEIGHT * 0.05 : HEIGHT * 0.04}
            maxValue={graphMax}
        />);
};

export default StackBarChartComponent;

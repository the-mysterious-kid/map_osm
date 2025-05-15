import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, FlatList, Image, Text, Dimensions, SafeAreaView, Pressable, LayoutAnimation } from 'react-native';
import CircleShadow from './CircleShadow';

const { width, height } = Dimensions.get('window');
const HEIGHT = height
const WIDTH = width
const ITEM_WIDTH = width * 0.6;
const SIDE_ITEM_WIDTH = width * 0.2;
const SPACING = 10;

const countries = [
  { name: 'السعودية', flag: require('../assets/images/flag/flag.png') },
  { name: 'دولة قطر', flag: require('../assets/images/flag/flag.png') },
  { name: 'الإمارات', flag: require('../assets/images/flag/flag.png') },
  { name: 'عمان', flag: require('../assets/images/flag/flag.png') },
  { name: 'الكويت', flag: require('../assets/images/flag/flag.png') },
  { name: 'البحرين', flag: require('../assets/images/flag/flag.png') },
];

const RenderItem = ({ item, index, active }) => {
  const [expanded, setExpanded] = useState(active == index);
  console.log("active == index", active == index);

  const toggleAlignment = (value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(value);
  };

  useEffect(() => {
    toggleAlignment(active == index)
  }, [active])

  return (<View style={{ width: WIDTH / 3, alignItems: 'center', justifyContent: !expanded ? 'center' : 'space-between' }}>
    <Image source={item.flag} style={{ width: expanded ? WIDTH / 3 : WIDTH / 4, height: expanded ? WIDTH / 3 : WIDTH / 4, borderRadius: 60 }} />
    <Text style={{ marginTop: 10, fontSize: 20, color: 'white' }}>{item.name}</Text>
  </View>
  );
}

const CircularPicker = () => {
  const flatListRef = useRef(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    try {
      flatListRef?.current?.scrollToIndex({ index: active, viewPosition: 0.5 });
    } catch (error) {
      console.log(error);
    }
  }, [active])

  return (<SafeAreaView style={{ flex: 1, backgroundColor: "#1269A3", justifyContent: "center" }}>
    <View style={{ height: HEIGHT * 0.35 }}>
      {/* <View style={{ height: WIDTH, width: WIDTH, position: 'absolute', backgroundColor: 'red', borderRadius: WIDTH, top: WIDTH * 0.15 }} /> */}
      <FlatList
        horizontal
        data={countries}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        ref={flatListRef}
        ListHeaderComponent={() => <View style={{ width: WIDTH / 3, }}>
        </View>}
        ListFooterComponent={() => <View style={{ width: WIDTH / 3, }}>
        </View>}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} active={active} />}
      />
    </View>
    <View style={{ flexDirection: "row", justifyContent: "center", position: "absolute", right: WIDTH * 0.35, top: HEIGHT * 0.55 }}>
      <Pressable onPress={() => {
        if (active > 0) setActive((active == 0 ? countries.length : active) - 1)
      }}
        style={{ width: WIDTH * 0.15, backgroundColor: "#FFF", height: WIDTH * 0.15, borderRadius: WIDTH * 0.075, justifyContent: "center", alignItems: "center", marginRight: WIDTH * 0.05 }}>
        <Text style={{ fontSize: 30 }}>{`<`}</Text>
      </Pressable>
      <Pressable onPress={() => {

        if (countries.length - 1 > active) setActive(active == (countries.length - 1) ? 0 : active + 1)
      }} style={{ width: WIDTH * 0.15, backgroundColor: "#FFF", height: WIDTH * 0.15, borderRadius: WIDTH * 0.075, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30 }}>{`>`}</Text>
      </Pressable>
    </View>
  </SafeAreaView>
  );
};

export default CircularPicker;

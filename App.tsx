/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import StackBarChartComponent from './src/components/StackBarChartComponent';
import BarChartComponent from './src/components/BarChartComponent';
import CircularPicker from './src/components/CircularPicker';
import CircleShadow from './src/components/CircleShadow';
import OsmMap from './src/components/OsmMap';
import MapComponent from './src/components/MapComponent';
import LiveNavigationMap from './src/components/LiveNavigationMap';
import MapWithLiveTrack from './src/components/MapWithLiveTrack';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';
  const { height } = Dimensions.get('window');
  const HEIGHT = height

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {/* <ScrollView
        style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header/>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView> */}
      {/* <BarChartComponent /> */}
      <View style={{ height: HEIGHT, justifyContent: 'center' }}>
        {/* <CircleShadow size={350} /> */}

        {/* <CircularPicker
          data={[
            { name: 'الكويت', image: require('./src/assets/images/flag/flag.png') },
            { name: 'عمان', image: require('./src/assets/images/flag/flag.png') },
            { name: 'الإمارات', image: require('./src/assets/images/flag/flag.png') },
            { name: 'قطر', image: require('./src/assets/images/flag/flag.png') },
            { name: 'السعودية', image: require('./src/assets/images/flag/flag.png') },
            { name: 'البحرين', image: require('./src/assets/images/flag/flag.png') },
          ]}
        /> */}
        {/* <OsmMap markers={[{
          coordinate: { latitude: 25.276987, longitude: 55.296249 },
          title: 'Dubai Marker',
        },
        ]} /> */}
        {/* <MapComponent /> */}
        <LiveNavigationMap />
        {/* <MapWithLiveTrack /> */}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

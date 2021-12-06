import React from 'react';
import {
  Alert,
  SafeAreaView,
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

import codePush from 'react-native-code-push';
const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
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
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [logs, setLogs] = React.useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    codePush
      .checkForUpdate()
      .then(update => {
        if (update) {
          setLogs([...logs, 'Started at' + new Date().getTime()]);
          codePush.sync(
            {
              updateDialog: true,
              installMode: codePush.InstallMode.IMMEDIATE,
              mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
            },
            status => {
              for (let key in codePush.SyncStatus) {
                if (status === codePush.SyncStatus[key]) {
                  setLogs([...logs, key.replace(/_/g, '')]);
                  break;
                }
              }
            },
          );
        }
      })
      .catch(error => {
        Alert.alert('Error: app update', error.message);
      });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Logs">
            <Text>{JSON.stringify(logs)}</Text>
          </Section>
          <Section title="Number One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="Number two">
            <ReloadInstructions />
          </Section>
          <Section title="Number three">
            <DebugInstructions />
          </Section>
          <Section title="Number Four">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default codePush(codePushOptions)(App);

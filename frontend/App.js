import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox, View } from 'react-native';

// Screens
import ProductContainer from './Screens/Products/ProductContainer'

// Components
import Header from './Shared/Header';

LogBox.ignoreAllLogs(true)

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <ProductContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

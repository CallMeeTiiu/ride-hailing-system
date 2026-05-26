import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomerRatingBottomSheet } from './src/components/rating/CustomerRatingBottomSheet';
import { useTripStore } from './src/store/tripStore';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const { isRatingSheetVisible, openRatingSheet, cancelRating } = useTripStore();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.demoContainer}>
        <Text style={styles.title}>Customer App</Text>
        <Text style={styles.subtitle}>Ride-Hailing System</Text>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={openRatingSheet}
          activeOpacity={0.8}>
          <Text style={styles.demoButtonText}>🚗 Simulate Trip Finished</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Tap above to trigger the rating flow
        </Text>
      </View>

      <CustomerRatingBottomSheet
        visible={isRatingSheetVisible}
        onClose={cancelRating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 48,
  },
  demoButton: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: '#BDBDBD',
  },
});

export default App;

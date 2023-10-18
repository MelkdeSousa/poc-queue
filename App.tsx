import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BackgroundTasks } from './src/components/BackgroundTasks'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <BackgroundTasks />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

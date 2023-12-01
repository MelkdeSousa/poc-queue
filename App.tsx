import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SimpleQueue } from './src/components/SimpleQueue'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SimpleQueue />
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

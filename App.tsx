import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Button, DeviceEventEmitter, FlatList, StyleSheet, Text, View } from 'react-native'
import { generateUUID } from './src/lib/uuid'
import { queue } from './src/simple-queue'

export default function App() {
  const handlePushData = () => {
const id1 = generateUUID()
const id2 = generateUUID()
const id3 = generateUUID()
const id4 = generateUUID()

    queue.push({ id:id1, name: 'test', payload: `teste ${id1}` })
    queue.push({ id:id2, name: 'test', payload: `teste ${id2}` })
    queue.push({ id:id3, name: 'test', payload: `teste ${id3}` })
    queue.push({ id:id4, name: 'test', payload: `teste ${id4}` })
  }

  const [processed, setProcessed] = useState<string[]>([])
  const [failed, setFailed] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener('precessed', (data: string) => {
      setProcessed(prev => [...prev, data])
    })

    return unsubscribe.remove
  }, [])

  useEffect(() => {
    const unsubscribe = DeviceEventEmitter.addListener('failed', (data: string) => {
      setFailed(prev => [...prev, data])
    })

    return unsubscribe.remove
  }, [])

  return (
    <View style={styles.container}>
        <FlatList data={processed} renderItem={({ item }) => <Text>{item}</Text>} />
      <StatusBar style="auto" />
      <Button title='Gen Event' onPress={handlePushData} />
        <FlatList data={failed} renderItem={({ item }) => <Text>{item}</Text>} />
    
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

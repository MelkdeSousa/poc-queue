import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { queue } from '../lib/simple-queue'
import { generateUUID } from '../lib/uuid'

export const SimpleQueue = () => {
    const [ids, setIds] = useState(Array.from({ length: 10 }).map((_, index) => `${index} - ${generateUUID()}`))
    const [processed, setProcessed] = useState<string[]>([])
    const [failed, setFailed] = useState<string[]>([])

    const handlePushData = () => {
        ids.forEach((id, index) => {
            queue.push({ id, name: `test ${index}`, payload: `test ${id}` })
        })
    }

    useEffect(() => {
        const unsubscribe = queue.addListener('success', (data) => {
            setProcessed(prev => [...prev.filter(d => d !== data.payload), data.payload])
        })

        return unsubscribe.remove
    }, [])

    useEffect(() => {
        const unsubscribe = queue.addListener('failed', (data) => {
            setFailed(prev => [...prev.filter(d => d !== data.payload), data.payload])
        })

        return unsubscribe.remove
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Button title='Gen Event' onPress={handlePushData} />
            <FlatList ListHeaderComponent={<Text>Success</Text>} data={processed} renderItem={({ item }) => <Text>{item}</Text>} />
            <FlatList ListHeaderComponent={<Text>Failed</Text>} data={failed} renderItem={({ item }) => <Text>{item}</Text>} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 24
    }
})

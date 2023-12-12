import { storage } from "@/lib/storage"
import { useEffect, useState } from "react"
import { DeviceEventEmitter, SafeAreaView, StyleSheet, View } from "react-native"

export const BackgroundTasks = () => {
    const [rows, setRows] = useState(storage.getNumber('@percentage') ?? 0)
    const [running, setRunning] = useState(false)

    useEffect(() => {
        const unsubscribeStorage = storage.addOnValueChangedListener(key => {
            if (key === '@percentage') {
                setRows(storage.getNumber('@percentage'))
            }
        })
        const unsubscribeRunningTask = DeviceEventEmitter.addListener('running-task', setRunning)

        return () => {
            unsubscribeStorage.remove()
            unsubscribeRunningTask.remove()
        }
    }, [])

    return (
        <SafeAreaView>
            <View style={styles.screen}>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },

})
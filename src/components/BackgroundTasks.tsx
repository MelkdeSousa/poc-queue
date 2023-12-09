import { storage } from "@/lib/storage"
import { useEffect, useState } from "react"
import { Button, DeviceEventEmitter, Text, View } from "react-native"
import { handleDrivers } from "../core/drivers/presenters"

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Text>Rows: {rows}%</Text>

            <Button title="Run Task" onPress={handleDrivers} disabled={running} />
            <Button title="Stop Task" onPress={() => setRunning(false)} />
            <Button title="Test press" />
        </View>
    )
}
import { useEffect, useState } from "react"
import { Button, DeviceEventEmitter, Text, View } from "react-native"
import { handleDrivers, stopTask } from "../lib/tasks"

export const BackgroundTasks = () => {
    const [rows, setRows] = useState(0)

    useEffect(() => {
        const unsubscribe = DeviceEventEmitter.addListener('read-file', setRows)

        return unsubscribe.remove
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Text>Rows: {rows}%</Text>

            <Button title="Run Task" onPress={handleDrivers} />
            <Button title="Stop Task" onPress={stopTask} />
        </View>
    )
}
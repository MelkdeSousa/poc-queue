import { useEffect, useState } from "react"
import { Button, Text, View } from "react-native"
import { storage } from "../lib/storage"
import { startTask, stopTask } from "../lib/tasks"

export const BackgroundTasks = () => {
    let [lastValue, setLastValue] = useState(storage.getNumber('@poc-queue:lastValue'))

    useEffect(() => {
        const { remove } = storage.addOnValueChangedListener((key) => {
            if (key === '@poc-queue:lastValue') {
                setLastValue(storage.getNumber('@poc-queue:lastValue'))
            }
        })

        return remove
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Text>Last value saved: {lastValue}</Text>

            <Button title="Clear Counter" onPress={() => storage.set('@poc-queue:lastValue', 0)} />

            <Button title="Run Task" onPress={startTask} />
            <Button title="Stop Task" onPress={stopTask} />
        </View>
    )
}
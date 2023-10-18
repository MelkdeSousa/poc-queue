import { Button, View } from "react-native"
import { startTask, stopTask } from "../lib/tasks"

export const BackgroundTasks = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Button title="Run Task" onPress={startTask} />
            <Button title="Stop Task" onPress={stopTask} />
        </View>
    )
}
import BackgroundService from 'react-native-background-actions';
import { storage } from './storage';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(undefined), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments: { delay: number }) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    let i = storage.getNumber('@poc-queue:lastValue') || 0

    await new Promise(async (resolve) => {
        for (; i < 100; i++) {
            console.log(i);

            storage.set('@poc-queue:lastValue', i)

            await BackgroundService.updateNotification({
                taskDesc: 'New ExampleTask description', progressBar: {
                    max: 100,
                    value: i
                }
            }); // Only Android, iOS will ignore this call
            await sleep(delay);
        }

        resolve(undefined);
    });
};

type StartOptions = Parameters<typeof BackgroundService.start>['1'];

const options: StartOptions = {
    taskName: 'InfiniteLoopTask',
    taskTitle: 'Infinite Loop Task',
    taskDesc: 'Running in the background',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    progressBar: {
        max: 100,
        value: 0,
    },
    parameters: {
        delay: 500,
    },
}


export const startTask = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
}

export const stopTask = async () => {
    // iOS will also run everything here in the background until .stop() is called
    await BackgroundService.stop();

}
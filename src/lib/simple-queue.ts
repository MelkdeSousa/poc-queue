import { DeviceEventEmitter } from "react-native"

export interface IEvent<T> {
  id: string
  name: string
  payload: T
}

export type EventTypes = 'success' | 'failed'

export enum EventStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

export interface IEventEnqueue<T> extends IEvent<T> {
  retries: number
  status: EventStatus
}

export class SimpleQueue<T = unknown> {
  private _queue: Array<IEventEnqueue<T>>
  private running: boolean

  constructor(
    private readonly job: (item: T) => Promise<void>,
    private readonly maxRetries: number | 'unlimited' = 3,
    private retryDelay = 1000
  ) {
    this._queue = []
    this.running = false
  }

  get queue(): Array<IEvent<T>> {
    return Array.from(this._queue.map(e => ({ id: e.id, name: e.name, payload: e.payload })))
  }

  addListener(eventType: EventTypes, listener: (item: IEvent<T>) => void) {
    return DeviceEventEmitter.addListener(eventType, listener)
  }

  push(item: IEvent<T>): void {
    this._queue.push({ ...item, retries: 0, status: EventStatus.pending })
    if (!this.running) {
      this.processQueue()
    }
  }

  async processQueue(): Promise<void> {
    const hasPending = this._queue.some(e => e.status === EventStatus.pending)

    if (!hasPending) {
      this.running = false
      return
    }

    const { retries, status, ...item } = this._queue.shift()

    try {
      if (status === EventStatus.pending) {
        await this.job(item.payload)
        DeviceEventEmitter.emit('success' satisfies EventTypes, item)
      }
    } catch (error) {
      const maxAttemptsRetry = this.maxRetries !== `unlimited` ? retries < this.maxRetries : true

      if (maxAttemptsRetry) {
        const nextRetryAtMilliseconds = this.retryDelay + (this.retryDelay * 0.25 * (retries + 1))
        const data = { ...item, retries: retries + 1, status: EventStatus.pending }

        this.retryDelay = nextRetryAtMilliseconds

        this._queue.push(data)
        setTimeout(() => {
          this.processQueue()
        }, nextRetryAtMilliseconds)

        return
      }

      DeviceEventEmitter.emit('failed' satisfies EventTypes, item)

      this._queue.push({ ...item, retries, status: EventStatus.failed })
    }
    this.processQueue()
  }
}

// Exemplo de uso
async function processItem(item: string): Promise<void> {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        reject(new Error('Falha na execução da função'))
      } else {
        resolve(undefined)
      }
    }, 1000)
  })
}

export const queue = new SimpleQueue(processItem, 3, 1000)

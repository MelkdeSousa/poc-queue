import { DeviceEventEmitter } from "react-native"

interface IEvent<T> {
  id: string
  name: string
  payload: T
}

enum EventStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

interface IEventEnqueue<T> extends IEvent<T> {
  retries: number
  status: EventStatus
}

export class SimpleQueue<T = unknown> {
  private _queue: Array<IEventEnqueue<T>>
  private running: boolean
  private successCount = 0

  constructor(
    private readonly job: (item: T) => Promise<void>,
    private readonly maxRetries = 3,
    private retryDelay = 1000
  ) {
    this._queue = []
    this.running = false
  }

  get queue(): Array<IEvent<T>> {
    return Array.from(this._queue.map(e => ({ id: e.id, name: e.name, payload: e.payload })))
  }

  push(item: IEvent<T>): void {
    this._queue.push({ ...item, retries: 0, status: EventStatus.pending })
    if (!this.running) {
      this.processQueue()
    }
  }

  async processQueue(): Promise<void> {
    console.log(this._queue.filter(e => e.status === EventStatus.failed).length, this.successCount);

    const hasPending = this._queue.some(e => e.status === EventStatus.pending)

    if (!hasPending) {
      this.running = false
      return
    }

    const { retries, status, ...item } = this._queue.shift()

    try {
      if (status === EventStatus.pending) {
        // console.log('Processando item', item.id);
        await this.job(item.payload)
        // this.successCount++
      }
    } catch (error) {
      const maxAttemptsRetry = retries < this.maxRetries

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

      DeviceEventEmitter.emit('failed', item.payload)

      this._queue.push({ ...item, retries, status: EventStatus.failed })
    }

    // Continue processando a fila
    this.processQueue()
  }
}

// Exemplo de uso
async function processItem(item: string): Promise<void> {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject(new Error('Falha na execução da função'))
      } else {
        DeviceEventEmitter.emit('precessed', item)
        resolve(undefined)
      }
    }, 1000)
  })
}

export const queue = new SimpleQueue(processItem, 2, 1000)

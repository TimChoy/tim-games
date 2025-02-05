interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
  list(): T[];
}

export class Queue<T> implements IQueue<T> {
  private queue: T[] = [];

  constructor() {}

  enqueue(item: T): void {
    this.queue.push(item);
  }

  dequeue(): T | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }

  list(): T[] {
    return this.queue;
  }
}

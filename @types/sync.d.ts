declare type TSyncEntity = 'favorite' | 'history';

declare type TSyncOperationType = 'upsert' | 'delete';

declare type TSyncOperationInput = {
  entity: TSyncEntity;
  type: TSyncOperationType;
  word: string;
  at: number;
};

declare type TSyncOperation = TSyncOperationInput & {
  id: string;
  attempts: number;
  nextAttemptAt: number;
};

declare type TSyncQueue = {
  getAll(): TSyncOperation[];
  enqueue(operation: TSyncOperation): void;
  update(operation: TSyncOperation): void;
  remove(id: string): void;
};

declare type TSyncTransport = {
  push(operation: TSyncOperation): Promise<void>;
};

declare type TSyncEngine = {
  enqueue(input: TSyncOperationInput): void;
  flush(): Promise<void>;
  dispose(): void;
};

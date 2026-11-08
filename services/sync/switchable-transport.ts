export type TSwitchableTransport = TSyncTransport & {
  use(transport: TSyncTransport): void;
};

export function createSwitchableTransport(initial: TSyncTransport): TSwitchableTransport {
  let current = initial;

  return {
    push: (operation) => current.push(operation),
    use(transport) {
      current = transport;
    },
  };
}

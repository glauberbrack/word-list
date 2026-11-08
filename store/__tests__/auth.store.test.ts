import { AUTH_FALLBACK_ERROR } from '@/core/domain/auth';

import { useAuthStore } from '../auth.store';

function gateway(overrides: Partial<TAuthGateway> = {}): TAuthGateway {
  return {
    getCurrentUser: jest.fn().mockResolvedValue(null),
    onAuthChange: jest.fn(() => () => undefined),
    signIn: jest.fn().mockResolvedValue(undefined),
    signUp: jest.fn().mockResolvedValue({ needsConfirmation: true }),
    signOut: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('useAuthStore', () => {
  it('fica indisponível sem Supabase configurado', () => {
    useAuthStore.getState().configure({ gateway: null });

    expect(useAuthStore.getState().status).toBe('unavailable');
  });

  it('traduz credenciais inválidas', async () => {
    useAuthStore.getState().configure({
      gateway: gateway({
        signIn: jest.fn().mockRejectedValue(new Error('Invalid login credentials')),
      }),
    });

    expect(await useAuthStore.getState().signIn('a@b.com', '123456')).toBe(false);
    expect(useAuthStore.getState().error).toBe('E-mail ou senha incorretos.');
    expect(useAuthStore.getState().pending).toBe(false);
  });

  it('usa mensagem genérica para erros desconhecidos', async () => {
    useAuthStore.getState().configure({
      gateway: gateway({ signUp: jest.fn().mockRejectedValue(new Error('boom')) }),
    });

    expect(await useAuthStore.getState().signUp('a@b.com', '123456')).toBeNull();
    expect(useAuthStore.getState().error).toBe(AUTH_FALLBACK_ERROR);
  });

  it('envia a fila pendente antes de sair', async () => {
    const order: string[] = [];
    useAuthStore.getState().configure({
      gateway: gateway({
        signOut: jest.fn(async () => {
          order.push('signOut');
        }),
      }),
      beforeSignOut: async () => {
        order.push('flush');
      },
    });

    await useAuthStore.getState().signOut();

    expect(order).toEqual(['flush', 'signOut']);
  });
});

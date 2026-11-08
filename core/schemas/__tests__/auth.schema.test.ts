import { credentialsSchema } from '../auth.schema';

describe('credentialsSchema', () => {
  it('aceita e-mail válido e senha com 6 caracteres ou mais', () => {
    expect(
      credentialsSchema.safeParse({ email: 'ana@example.com', password: '123456' }).success,
    ).toBe(true);
  });

  it('explica o que está errado em português', () => {
    const result = credentialsSchema.safeParse({ email: 'ana', password: '123' });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Informe um e-mail válido.',
      'A senha precisa ter pelo menos 6 caracteres.',
    ]);
  });
});

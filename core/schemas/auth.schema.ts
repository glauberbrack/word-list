import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.email({ error: 'Informe um e-mail válido.' }),
  password: z.string().min(6, { error: 'A senha precisa ter pelo menos 6 caracteres.' }),
});

export type TCredentials = z.infer<typeof credentialsSchema>;

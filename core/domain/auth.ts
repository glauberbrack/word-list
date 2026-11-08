const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
  'User already registered': 'Já existe uma conta com este e-mail.',
};

export const AUTH_FALLBACK_ERROR =
  'Não foi possível concluir. Confira sua conexão e tente de novo.';

export function toAuthErrorMessage(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? AUTH_FALLBACK_ERROR;
}

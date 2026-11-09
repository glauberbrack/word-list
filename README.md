# Word List

App mobile para explorar palavras em inglês: lista com rolagem infinita, significados e fonética pela Free Dictionary API, pronúncia em áudio, favoritos e histórico guardados no aparelho e sincronizados com a conta do usuário.

> This is a challenge by [Coodesh](https://coodesh.com/)

## Tecnologias

- React Native 0.88 com Expo SDK 58 e Expo Router (navegação por arquivos, top tabs e modais)
- TypeScript em modo estrito, com `noUncheckedIndexedAccess`
- expo-sqlite: banco de palavras embarcado como asset e key-value store para cache, favoritos, histórico e fila de sync
- TanStack Query para dados assíncronos com cache em memória e paginação infinita
- Zustand para estado de favoritos, histórico, autenticação e toast
- Zod para validar a resposta da API e as credenciais de login
- Axios para o cliente HTTP
- Supabase (Auth + Postgres com RLS) para login e persistência remota
- expo-audio e expo-speech para o player de pronúncia
- FlashList para o grid de palavras
- Jest, jest-expo e Testing Library para testes unitários e de integração; Maestro para E2E
- ESLint (config do Expo) e Prettier

## Como rodar

Requisitos: Node 22.13 ou superior (o script `build:words` usa o módulo `node:sqlite`), npm e o app Expo Go no aparelho ou um simulador configurado.

```bash
npm install
```

```bash
npm start
```

Leia o QR code com o Expo Go ou pressione `i` / `a` para abrir no simulador iOS ou no emulador Android.

O login é opcional. Sem Supabase configurado o app funciona por completo no modo local e a tela de conta informa que o login está indisponível nesta build.

### Login e sync com Supabase

1. Crie um projeto no [Supabase](https://supabase.com/) e habilite o provedor Email em Authentication.
2. Rode a migration [supabase/migrations/0001_user_words.sql](supabase/migrations/0001_user_words.sql) no SQL Editor do projeto, ou com a CLI (`supabase db push`). Ela cria as tabelas `favorites` e `history` com Row Level Security, de modo que cada usuário só lê e escreve as próprias linhas.
3. Copie `.env.example` para `.env` e preencha com a URL e a chave publicável (anon) do projeto:

```bash
cp .env.example .env
```

4. Reinicie o `npm start`. Variáveis `EXPO_PUBLIC_*` são embutidas no bundle, então a chave precisa ser a publicável, nunca a service role.

### Scripts

| Script                | O que faz                                                                |
| --------------------- | ------------------------------------------------------------------------ |
| `npm start`           | Inicia o Metro com o Expo                                                |
| `npm test`            | Roda os testes unitários e de integração                                 |
| `npm run test:e2e`    | Roda os fluxos Maestro em `.maestro/` (precisa do app aberto no Expo Go) |
| `npm run lint`        | ESLint                                                                   |
| `npm run typecheck`   | `tsc --noEmit`                                                           |
| `npm run format`      | Prettier em todo o projeto                                               |
| `npm run build:words` | Regenera `assets/database/words.db` a partir da lista do dwyl            |

O banco de palavras já está versionado no repositório. Só rode `build:words` se quiser regenerá-lo. O script baixa o `words_dictionary.json` do repositório [dwyl/english-words](https://github.com/dwyl/english-words), filtra palavras com apenas letras minúsculas, ordena e grava um SQLite com `id` sequencial. Também aceita um caminho local como primeiro argumento.

## Arquitetura

O projeto separa regras puras, acesso a dados, estado e interface em camadas com dependências em uma só direção. As telas não conhecem Supabase, SQLite nem Axios: recebem repositórios por contexto e disparam ações das stores.

```
app/            rotas do Expo Router, sem lógica
features/       telas e componentes de cada funcionalidade
components/     UI compartilhada, providers e injeção de dependências
hooks/          ponte entre React e repositórios, stores e players
store/          stores Zustand: favoritos, histórico, auth e toast
services/       sync engine, transportes, gatilhos de rede e sessão
core/domain     regras puras, sem I/O nem React
core/schemas    validação com Zod
core/storage    repositórios sobre SQLite e key-value store
lib/supabase    wrappers do SDK: client, auth gateway e leitura remota
api/requests    chamadas HTTP, uma por recurso
@types/         tipos globais declarados com prefixo T
```

### Fluxo de dados

**Lista de palavras.** A API não oferece a lista, então ela vem de um SQLite com 370 mil palavras embarcado como asset e copiado para o aparelho na primeira abertura. A paginação é por keyset (`WHERE id > cursor LIMIT 60`), que mantém custo constante por página independentemente da posição. O `useInfiniteQuery` acumula as páginas e o FlashList renderiza o grid em três colunas, com estrela nas palavras favoritadas e um botão para voltar ao topo depois de rolar mais de uma tela e meia. O cabeçalho mostra a contagem da aba ativa: total de palavras, favoritas ou vistas.

**Detalhe da palavra.** O repositório do dicionário consulta primeiro o cache no key-value store. Uma palavra encontrada vale por 30 dias e uma não encontrada por 7 dias. Só então chama a Free Dictionary API, valida a resposta com Zod e normaliza as várias entradas em um único `TWordDetail`, agrupando significados por classe gramatical e removendo fonéticas duplicadas. O TanStack Query adiciona uma segunda camada de cache em memória e o detalhe da próxima palavra é pré-carregado para a navegação ser instantânea. A tela mostra a palavra em um flashcard, os significados em acordeão por classe gramatical, a posição na lista de origem e os botões de anterior e próxima com a palavra vizinha.

**Favoritos e histórico.** São local-first com atualização otimista. Um toque atualiza a store, grava no aparelho e enfileira uma operação de sync no mesmo tick. Os dados ficam separados por usuário na chave de armazenamento, com `local` para quem não está logado. A aba de favoritos mostra há quanto tempo cada palavra foi salva.

**Sync.** A fila é persistida por usuário e cada operação é coalescida por entidade e palavra, então dez toques seguidos no mesmo favorito viram um único envio. O engine processa a fila após um debounce de 500 ms, ao voltar a ter rede e ao app voltar ao primeiro plano. Erros de rede e 5xx agendam retry com backoff exponencial até 60 s. Erros 4xx são definitivos: a operação é descartada e, no caso de favoritos, a store reverte e um toast avisa o usuário. Sem login, o transporte local simplesmente aceita as operações.

**Sessão.** Ao logar, o app busca favoritos e histórico remotos, faz merge com os dados do usuário no aparelho e com os dados do visitante (vence o `updatedAt` mais recente), grava o resultado sob o id do usuário, limpa os dados do visitante e enfileira para upload só o que está mais novo que o servidor. Se a busca remota falhar, o login segue com os dados locais e tudo sobe quando houver rede. Antes de sair, a fila é esvaziada.

**Pronúncia.** O domínio escolhe o áudio da API preferindo sotaque americano, depois britânico e australiano. Se a API não tem áudio ou ele falha ao carregar, o player cai para a voz do aparelho via expo-speech, com progresso estimado pelo tamanho da palavra. O rótulo abaixo da barra diz qual fonte está tocando.

### Decisões e hipóteses

- **SQLite embarcado em vez de carregar o JSON em memória.** O JSON tem 370 mil chaves e levaria segundos para parsear a cada abertura, além de ocupar dezenas de MB de RAM. O banco pronto pesa 6,5 MB, abre em milissegundos e a consulta por cursor é indexada pela chave primária.
- **Dois caches para o dicionário.** O key-value store sobrevive a reinícios e atende ao requisito de cache das requisições. O TanStack Query evita repetir leitura de disco enquanto o app está aberto e dá estados de loading, erro e retry de graça.
- **Injeção de dependências por contexto e fábricas.** Repositórios, cache, fila e transportes são funções `createX(deps)` montadas em um único ponto ([components/providers/dependencies.ts](components/providers/dependencies.ts)) e entregues às telas por `RepositoriesProvider`. Os testes trocam qualquer peça por uma versão em memória sem mocks de módulo.
- **Fila de sync em vez de chamadas diretas.** Permite uso offline completo, retry controlado e um único lugar para tratar falhas. O transporte é trocável em tempo de execução, então o mesmo engine atende visitante e usuário logado.
- **Regras puras em `core/domain`.** Merge, coalesce, backoff, TTL de cache, escolha de áudio e normalização da API são funções sem efeitos colaterais, testadas de forma isolada.
- **Supabase com RLS.** A chave publicável vai no bundle, como é esperado no Supabase. A segurança fica nas policies: cada linha pertence a `auth.uid()` e nenhuma consulta atravessa usuários.
- **Fonte de verdade dos vizinhos.** Voltar e Próximo seguem a lista de origem: na lista principal usam o id no SQLite; em histórico e favoritos usam um snapshot da ordem no momento em que o detalhe abriu, para a navegação não pular quando a própria visita reordena o histórico.

## Testes

```bash
npm test
```

São 81 testes em 21 suites, cobrindo regras de domínio, formatadores, repositórios, fila e engine de sync, transporte Supabase, sessão com reconcile, stores, o hook de voltar ao topo e a tela de detalhe renderizada com providers reais e repositórios em memória.

Para o E2E, abra o app no Expo Go com `npm start` e, em outro terminal:

```bash
npm run test:e2e
```

O fluxo em `.maestro/favorite-word.yaml` abre uma palavra, favorita, confere na aba Favorites e remove com toque longo.

## Limitações e próximos passos

- A interface mistura títulos em inglês com ações e mensagens em português. Centralizar as strings e escolher um idioma.
- O histórico cresce sem limite e cada gravação reescreve o mapa inteiro no key-value store. Um teto de itens ou uma tabela própria no SQLite resolve para uso prolongado.
- O upsert remoto não compara `updated_at` no servidor. Um aparelho desatualizado pode sobrescrever um estado mais novo. Uma função RPC com a comparação fecha a brecha.
- Não há CI nem `eas.json`. Um workflow com lint, typecheck e testes e um profile de build preview são os próximos passos para distribuição.

## Regras do projeto

- Existem três aplicações:
  - `frontend-mobile`
  - `frontend-web`
  - `backend`

- Até nova autorização, alterações devem ser feitas somente em `frontend-mobile`.
- Não criar commits, branches, PRs, MRs ou qualquer ação remota.
- Manter o código identado conforme o padrão existente.
- Antes de alterar arquivos, verificar mudanças já feitas pelo usuário.
- Após alterações no mobile, executar:

  bash
  npx tsc --noEmit
  npm run lint

## Objetivo do sistema

O CerviCare é um sistema médico para acompanhamento de pacientes em investigação ou tratamento do câncer do colo do útero.

O sistema possui:

- Autenticação de usuários.
- Perfis de médicos e administradores.
- Cadastro e acompanhamento de pacientes.
- Consultas, exames, procedimentos e histórico clínico.
- Indicadores e dashboards.
- Interfaces web e mobile.

---

# Frontend Mobile

Tecnologias:

- Expo SDK 57.
- React Native 0.86.
- React 19.
- Expo Router.
- TypeScript.
- React Native Web.
- React Native Reanimated.
- Safe Area Context.
- Expo Symbols.
- Fontes do `@expo-google-fonts`.

Configuração principal em `package.json`.

## Rotas atuais

As rotas ficam em src/app:

- `/`
  - Tela de login.
  - Arquivo: `index.tsx`
- `/forgot-password`
  - Recuperação de senha.
  - Arquivo: `forgot-password.tsx`
- `/dashboard`
  - Dashboard principal.
  - Arquivo: `dashboard.tsx`
- `/patients`
  - Lista/tela inicial de pacientes.
  - Arquivo: `patients.tsx`
- `/new-patient`
  - Tela inicial de cadastro de paciente.
  - Arquivo: `new-patient.tsx`
- `/explore`
  - Tela original de exemplo do template Expo.

A navegação principal está em `_layout.tsx`.

## Autenticação mobile

A chamada de login está em `api.ts`.

Endpoint utilizado:

text
POST /api/auth/login

Payload:

```json
{
  "email": "usuario",
  "senha": "senha"
}
```

O token recebido é guardado em memória por `auth-session.ts`.

Importante:

- O token não é persistido em `AsyncStorage`.
- Ao recarregar o aplicativo, a sessão é perdida.
- Atualmente não existe um guard de autenticação bloqueando diretamente as rotas mobile.
- É possível acessar `/dashboard` diretamente durante o desenvolvimento.
- A URL padrão da API mobile é:
  - Android emulator: `http://10.0.2.2:8080`
  - iOS/web: `http://localhost:8080`
- Pode ser sobrescrita com:
  ```bash
  EXPO_PUBLIC_API_URL
  ```

## Tema e design mobile

O tema central está em `theme.ts`.

Ele contém:

- `Colors`
- `Theme`
- `ThemeColor`
- `FontFamilies`
- `Typography`
- `Spacing`
- `BottomTabInset`
- `MaxContentWidth`

### Cores

As cores são baseadas na paleta do frontend web CerviCare.

Exemplos:

```ts
Theme.primary;
Theme.background;
Theme.text;
Theme.textSecondary;
Theme.error;
Theme.warning;
Theme.secondary;
Theme.tertiary;
```

Textos devem preferencialmente usar:

```tsx
<ThemedText themeColor="textSecondary">
```

Em vez de:

```tsx
<Text style={{ color: ... }}>
```

O componente responsável por textos temáticos é `themed-text.tsx`.

Para containers com fundo temático existe `themed-view.tsx`.

### Fontes

As três fontes oficiais são:

```ts
FontFamilies.primary;
FontFamilies.secondary;
FontFamilies.detail;
```

Correspondências:

- `primary`: Poppins.
- `secondary`: JetBrains Mono.
- `detail`: PT Serif.

As fontes são carregadas no layout raiz usando `useFonts`.

### Tipografia

Os tamanhos devem ser obtidos de:

```ts
Typography.sizes;
```

A escala atual inclui:

- `tiny`
- `micro`
- `label`
- `caption`
- `small`
- `notice`
- `bodySmall`
- `input`
- `body`
- `greeting`
- `heading`
- `subtitle`
- `title`
- `logo`
- `metric`
- `display`

Também existem:

```ts
Typography.lineHeights;
Typography.weights;
Typography.letterSpacing;
```

Não adicionar valores soltos como:

```tsx
fontSize: 15;
fontWeight: "600";
letterSpacing: 1.7;
```

Usar:

```tsx
fontSize: Typography.sizes.input;
fontWeight: Typography.weights.semibold;
letterSpacing: Typography.letterSpacing.normal;
```

## Componentes reutilizáveis mobile

- Field
  - Campo de entrada.
  - Suporta senha, erro e botão mostrar/ocultar senha.
  - Label e texto do input devem permanecer alinhados.
- ThemedText
  - Texto com fonte, tamanho e cor padronizados.
- ThemedView
  - View com fundo temático.
- BottomNav
  - Navegação inferior.
- AnimatedSplashOverlay
  - Splash/animação inicial.

## Layout da tela de login

A tela de login foi baseada no protótipo:

- Faixa rosa e laranja no topo.
- Logo em PT Serif.
- Labels em JetBrains Mono.
- Campos com Poppins.
- Botão verde arredondado.
- Formulário espaçado verticalmente.
- O conteúdo começa mais abaixo na tela.
- A mensagem de erro deve usar `Theme.error`.
- O componente `Field` centraliza o alinhamento entre:
  - Label.
  - Texto digitado.
  - Botão `MOSTRAR`.

Não alterar os espaçamentos visualmente sem comparar com o protótipo anexado.

---

# Frontend Web

Tecnologias:

- Angular 21.
- Angular Material.
- TypeScript.
- SCSS.
- ApexCharts.
- JWT.

Informações gerais em `README.md`.

## Execução

Na pasta `frontend-web`:

```bash
npm install
ng serve
```

URL padrão:

```text
http://localhost:4200
```

## Rotas web

As rotas estão em `app.routes.ts`.

Rotas principais:

- `/login`
- `/dashboard`
- `/profissionais`
- `/pacientes`
- `/novo-paciente`
- `/perfil`

As rotas protegidas usam `authGuard`.

## Autenticação web

Arquivos principais:

- `auth.service.ts`
- `auth.guard.ts`
- `auth.interceptor.ts`
- `login.ts`

O token JWT é salvo em:

```text
sessionStorage
```

Chave:

```text
cervicare_token
```

O interceptor adiciona:

```http
Authorization: Bearer <token>
```

A URL da API web está em `environment.ts`:

```text
http://localhost:8081/api
```

Existe uma diferença importante:

- Mobile usa por padrão a porta `8080`.
- Web usa a porta `8081`.
- Deve-se conferir o `application.yaml` do backend antes de executar tudo.

## Tema web

O tema global está em `styles.scss`.

Fontes:

```scss
--fonte-primaria: "Poppins", sans-serif;
--fonte-secundaria: "JetBrains Mono", monospace;
--fonte-detalhe: "PT Serif", serif;
```

A paleta inclui:

- Cores primárias, secundárias e terciárias.
- Cores de texto.
- Fundos e bordas.
- Tipos de usuário.
- Status de pacientes.
- Estados de erro e atenção.
- Ações de edição e exclusão.

O tema mobile deve permanecer compatível visualmente com essa paleta.

---

# Backend

Tecnologia principal:

- Java.
- Spring Boot.
- Spring Security.
- Spring Data JPA.
- MySQL 8.
- Flyway.
- JWT.
- Maven.
- Testcontainers para testes de integração.
- Lombok.

Classe principal:

`CervicareApplication.java`

## Banco de dados

O banco é executado pelo Docker Compose em `docker-compose.yml`.

Configuração:

```text
MySQL 8.0
Database: cervicare
User: user
Password: password
Root password: root
Porta externa: 3307
Porta interna: 3306
Container: cervicare_db
```

Para iniciar:

```bash
cd backend
docker compose up -d
```

## Migrations

As migrations ficam em:

`migration`

Principais migrations:

- `V1__Initial_Setup.sql`
  - Cria usuários, médicos, pacientes, dados gineco-obstétricos, saúde sexual, histórico de IST, tabagismo, consultas, citologia, PCR, colposcopia e procedimentos.
- `V2__Paciente_Primary_Business_Constraints.sql`
  - Torna o prontuário do paciente único.
- `V3__Usuario_Email_Unique.sql`
  - Torna o e-mail do usuário único.
- `V4__Add_Paciente_Ativo.sql`
  - Adiciona `ativo` para exclusão lógica de pacientes.
- Existe também uma migration `V5` no diretório compilado/estado atual do projeto relacionada à atualização de enums PCR; verificar a migration fonte correspondente antes de criar novas migrations.

Não editar migrations antigas já aplicadas. Para mudanças futuras, criar uma nova migration sequencial.

## Autenticação backend

Arquivos principais:

- `AuthController.java`
- `AutenticacaoService.java`
- `TokenService.java`
- `SecurityConfig.java`
- `SecurityFilter.java`

Login:

```text
POST /api/auth/login
```

Payload:

```json
{
  "email": "medico@cervicare.com",
  "senha": "Senha@123"
}
```

Resposta esperada:

```json
{
  "token": "...",
  "tipo": "Bearer"
}
```

Características:

- API stateless.
- CSRF desabilitado.
- Login liberado sem autenticação.
- Swagger liberado.
- Demais endpoints exigem JWT.
- Senhas usam BCrypt.
- JWT utiliza issuer `cervicare-api`.
- O token inclui:
  - E-mail como subject.
  - ID do usuário.
  - Tipo do usuário.
  - Expiração.

Configuração de segurança:

- CORS permite qualquer origem atualmente.
- Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.
- Headers permitidos: `Authorization`, `Content-Type`.

## Usuário inicial

O `DataSeeder.java` cria dados iniciais quando o banco está vazio.

Usuário padrão:

```text
E-mail: admin@cervicare.com
Senha: Senha@123
Tipo: ADMINISTRADOR
```

Também cria:

- Perfil médico administrativo.
- Alguns pacientes de teste.

Os testes de integração usam:

```text
medico@cervicare.com
Senha@123
```

## Segurança de endpoints

O backend protege qualquer rota que não seja explicitamente liberada.

Teste de segurança existente:

`SecurityContextIT.java`

Ele verifica que:

- Requisições sem token retornam `401`.
- Tokens inválidos retornam `401`.
- Tokens válidos permitem acesso.

## Testes backend

Testes de integração ficam em:

`java`

Eles usam Testcontainers com MySQL 8.

Requisitos:

- Docker em execução.
- Imagem MySQL disponível.
- Maven/Wrapper configurado.

Testes importantes:

- `AuthLoginIT.java`
- `SecurityContextIT.java`
- `DatabaseSchemaIT.java`

O `DatabaseSchemaIT` verifica:

- Existência das tabelas principais.
- Migrations aplicadas.
- Versão mais recente do Flyway.
- Índice único do prontuário.
- Índice único do e-mail.

## Fluxo recomendado para executar tudo

Terminal 1:

```bash
cd backend
docker compose up -d
./mvnw spring-boot:run
```

No Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Terminal 2:

```bash
cd frontend-web
npm install
ng serve
```

Terminal 3:

```bash
cd frontend-mobile
npm install
npx expo start
```

Antes de conectar os frontends, conferir:

- Porta real do backend.
- URL configurada no frontend web.
- `EXPO_PUBLIC_API_URL` do mobile.
- IP correto para dispositivo físico.
- `10.0.2.2` somente para emulador Android.
- `localhost` não funciona como backend para um celular físico.

## Pontos de atenção para outra IA

- Não assumir que o backend está na mesma porta usada pelos dois frontends.
- Não criar novas cores fora do tema.
- Não criar novos tamanhos de fonte fora de `Typography`.
- Não reintroduzir `Fonts`; o projeto atual usa `FontFamilies`.
- Não substituir `ThemedText` por `Text` sem necessidade.
- Não adicionar `StyleSheet` com cores literais.
- Não editar backend se a tarefa estiver limitada ao mobile.
- Não alterar migrations antigas.
- Não criar commit ou ação remota.
- Verificar sempre alterações locais antes de aplicar patches.
- Usar as versões atuais do Expo documentadas em `AGENTS.md`, porque o Expo possui mudanças entre versões.

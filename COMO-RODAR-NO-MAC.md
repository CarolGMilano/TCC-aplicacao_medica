# Como rodar o CerviCare mobile no Mac (modo debug, com emulador)

Este guia sobe o **backend** e o **app mobile** no Mac e abre o app no
**simulador do iPhone** (ou, se preferir, no emulador Android). O app roda em
modo de desenvolvimento (debug): recarrega sozinho ao salvar um arquivo, tem
menu de desenvolvedor e mostra os logs no terminal.

Tempo estimado na primeira vez: 30 a 60 minutos (a maior parte é download do
Xcode).

---

## 1. Instalar o que é preciso (só na primeira vez)

Abra o **Terminal** (Cmd + Espaço, digite "Terminal").

### 1.1 Homebrew (instalador de programas)

Se ainda não tiver, cole no Terminal e siga as instruções que aparecerem:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 1.2 Node.js, Java 21 e Git

```bash
brew install node@22 openjdk@21 git
```

Depois, para o Mac achar o Java 21:

```bash
sudo ln -sfn "$(brew --prefix)/opt/openjdk@21/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

Confira (devem aparecer as versões):

```bash
node -v
java -version
```

### 1.3 Docker Desktop (banco de dados)

Baixe e instale em <https://www.docker.com/products/docker-desktop/>
(escolha "Apple Chip" ou "Intel Chip" conforme o Mac). Abra o Docker Desktop
uma vez e espere aparecer "Docker Desktop is running".

### 1.4 Xcode (simulador do iPhone)

1. Instale o **Xcode** pela App Store (é grande, demora).
2. Abra o Xcode uma vez, aceite a licença e deixe ele instalar os componentes
   extras.
3. No Xcode, vá em **Settings → Components** (ou **Platforms**) e confirme que
   o **iOS Simulator** está instalado.

> Prefere Android? Em vez do Xcode, instale o **Android Studio**
> (<https://developer.android.com/studio>), abra **More Actions → Virtual
> Device Manager**, crie um aparelho (ex.: Pixel 7) e deixe-o ligado. Depois
> siga o guia normalmente e use a tecla `a` no passo 4.

---

## 2. Baixar o projeto

```bash
cd ~/Desktop
git clone https://github.com/CarolGMilano/TCC-aplicacao_medica.git
cd TCC-aplicacao_medica
git checkout mobile/versao-especificacao
```

---

## 3. Subir o backend (deixe este Terminal aberto)

Com o Docker Desktop aberto:

```bash
cd ~/Desktop/TCC-aplicacao_medica/backend
docker compose up -d
./mvnw spring-boot:run
```

- O primeiro comando sobe o banco MySQL (porta 3307).
- O segundo compila e inicia a API na porta **8081**. Na primeira vez ele
  baixa as dependências e demora alguns minutos.
- Está pronto quando aparecer uma linha com **`Started CervicareApplication`**.

Na primeira execução o backend cria sozinho um usuário de teste e algumas
pacientes de exemplo.

> Se aparecer "permission denied" no `./mvnw`, rode `chmod +x mvnw` e tente de
> novo.

---

## 4. Rodar o app (em outro Terminal)

Abra uma **nova janela do Terminal** (Cmd + N) e rode:

```bash
cd ~/Desktop/TCC-aplicacao_medica/frontend-mobile
npm install
npm start
```

> Use `npm start` (e não `npx expo start` puro): ele abre o app na porta 8082,
> porque a 8081 já é do backend.

Quando aparecer o QR code e o menu de teclas no Terminal:

- aperte **`i`** para abrir no **simulador do iPhone**. Na primeira vez ele
  abre o simulador e instala o Expo Go sozinho (pode pedir para confirmar);
- ou aperte **`a`** para abrir no **emulador Android** (precisa estar ligado).

O primeiro carregamento demora um pouco (está montando o app).

### Login de teste

| Campo  | Valor                 |
| ------ | --------------------- |
| E-mail | `admin@cervicare.com` |
| Senha  | `Senha@123`           |

---

## 5. Usando o modo debug

| O que              | Simulador do iPhone          | Emulador Android                  |
| ------------------ | ---------------------------- | --------------------------------- |
| Menu de debug      | **Cmd + D**                  | **Cmd + M**                       |
| Recarregar o app   | **`r`** no Terminal do Expo  | **`r`** no Terminal do Expo       |
| Logs e erros       | aparecem no Terminal do Expo | aparecem no Terminal do Expo      |

Ao salvar qualquer arquivo em `frontend-mobile/src`, o app atualiza sozinho.

---

## 6. Para parar tudo

- No Terminal do app: **Ctrl + C**.
- No Terminal do backend: **Ctrl + C** e depois
  `docker compose down` (dentro da pasta `backend`).

---

## Problemas comuns

**"Não foi possível conectar ao servidor" no login**
O backend não está rodando ou ainda não terminou de subir. Volte ao passo 3 e
espere a linha `Started CervicareApplication`.

**Backend para com erro de "Communications link failure"**
O banco não está no ar. Abra o Docker Desktop e rode `docker compose up -d` de
novo na pasta `backend`.

**A tecla `i` não abre o simulador**
Abra o Xcode uma vez, confirme que o iOS Simulator está instalado
(passo 1.4) e rode `sudo xcode-select -s /Applications/Xcode.app` no Terminal.

**O app mostra uma versão antiga ou trava carregando**
No Terminal do app, pare com Ctrl + C e rode `npm start -- --clear`.

**Porta 8081 ou 8082 em uso**
Feche outros Terminais com o backend ou o Expo rodando e tente de novo.

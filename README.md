# POC Queue

O objetivo desse projeto é realizar provas de conceitos com enfileiramento de funções e background tasks

## Libs

- Background Tasks: `react-native-background-fetch`
- File System: `react-native-blob-util`
- CSV Parse: `react-native-csv`
- Database: `realm`

## Instruções

- clone o projeto
  ```bash
  git clone https://github.com/melkdesousa/poc-queue.git
  ```
- crie um arquivo com as variáveis de ambiente
  ```bash
  cp .env.example .env
  ```
- instale as dependências
  ```bash
  npm i
  ```
- construa o app
  ```bash
  npm run android
  ```

## Todo

- [ ] Baixar, ler e salvar dados no banco
- [ ] Execução em background
- [ ] Contador de registros salvos

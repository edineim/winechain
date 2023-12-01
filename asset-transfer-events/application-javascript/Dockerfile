# Use a imagem oficial do Node.js como base
FROM node:14

# Crie e defina o diretório de trabalho no contêiner
WORKDIR /home/edineim/github/winechain/asset-transfer-events/application-javascript

# Copie o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte para o contêiner
COPY . .

# Expõe a porta 8080 no contêiner
EXPOSE 8080

# Comando para iniciar o aplicativo
CMD ["node", "ledger.js", "8080"]

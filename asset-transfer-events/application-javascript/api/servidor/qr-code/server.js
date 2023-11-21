// server.js

const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = process.argv[2] || 8080;

if (port == 8080){

    // Seu conteúdo para o QR code
  const conteudoQR = 'http://localhost:9000';

  // Comando Python para gerar o QR code
  const comandoPython = `python gerar_qrcode.py ${conteudoQR}`;

  // Executa o comando Python ao iniciar o servidor
  exec(comandoPython, (erro, stdout, stderr) => {
    if (erro) {
      console.error(`Erro ao gerar QR code: ${stderr}`);
      process.exit(1);
    }

    console.log(stdout);
  });

}

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});

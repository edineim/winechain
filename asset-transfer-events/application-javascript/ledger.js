const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { main } = require('./appAPI_AllOrg');

app.use(bodyParser.json());

// Iniciar o servidor
const port = process.argv[2];
const entidade = getEntidade(port);

app.listen(port, () => {
  console.log(`${entidade} está rodando em http://localhost:${port}`);
});

  // Chama main imediatamente
  executarMainPeriodicamente();
  
  // Agendar a execução a cada 30 segundos
  const intervaloDeExecucao = 50 * 1000; // 30 segundos em milissegundos
  setInterval(executarMainPeriodicamente, intervaloDeExecucao);

// Chama a função main quando o servidor é iniciado
function executarMainPeriodicamente() {
    main('item-001', 'Ledger', 5);
  }  

// Função para obter o nome da entidade com base na porta
function getEntidade(port) {
 if (port === '8080') {
    return 'Ledger';
  }
}

// const express = require('express');
// const bodyParser = require('body-parser');
// const ejs = require('ejs');
// const app = express();
// const { main } = require('./appAPI_AllOrg');

// app.use(bodyParser.json());

// function formatarResultadoParaWeb(resultado) {
//     function formatarValor(valor) {
//         if (Array.isArray(valor)) {
//             return valor.map(formatarValor);
//         } else if (typeof valor === 'object' && valor !== null) {
//             return Object.fromEntries(Object.entries(valor).map(([chave, valor]) => [chave, formatarValor(valor)]));
//         } else {
//             return valor || '';
//         }
//     }

//     return formatarValor(resultado);
// }

// app.get('/sse', async (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     async function enviarAtualizacaoParaClientes() {
//         try {
//             let resultado = await main('item-001', 'Ledger', 5);
//             console.log(typeof resultado)
//             let dadosEstruturados = formatarResultadoParaWeb(resultado);

//             // Renderiza o HTML usando o template EJS
//             const html = ejs.render(`
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>SSE Demo</title>
//                 </head>
//                 <body>
//                     <div id="resultado">
//                         <% for (const chave in resultado) { %>
//                             <p><strong><%= chave %>:</strong> <%= JSON.stringify(resultado[chave], null, 2) %></p>
//                         <% } %>
//                     </div>
                
//                     <script>
//                         const eventoSource = new EventSource('/sse');
                
//                         eventoSource.onmessage = function(event) {
//                             // O conteúdo é atualizado automaticamente pelo servidor
//                         };
                
//                         eventoSource.onerror = function(error) {
//                             console.error('Erro no evento SSE:', error);
//                             eventoSource.close();
//                         };
//                     </script>
//                 </body>
//                 </html>
//             `, { resultado: dadosEstruturados });

//             // Envie o HTML renderizado como resposta
//             res.write(`data: ${JSON.stringify({ html })}\n\n`);
//         } catch (error) {
//             console.error('Erro ao executar main:', error);
//         }
//     }

//     const intervaloDeExecucao = 15 * 1000; // 15 segundos em milissegundos
//     const intervalo = setInterval(enviarAtualizacaoParaClientes, intervaloDeExecucao);

//     req.on('close', () => {
//         clearInterval(intervalo);
//         res.end();
//     });
// });

// const port = process.argv[2] || 8080;
// app.listen(port, () => {
//     console.log(`O servidor está rodando em http://localhost:${port}`);
// });

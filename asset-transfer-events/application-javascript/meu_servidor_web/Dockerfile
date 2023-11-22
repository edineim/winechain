# Use uma imagem base leve do Nginx
FROM nginx:alpine

# Copie um arquivo de configuração personalizado para o servidor Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie um arquivo HTML com a mensagem de boas-vindas
COPY index.html /usr/share/nginx/html/index.html

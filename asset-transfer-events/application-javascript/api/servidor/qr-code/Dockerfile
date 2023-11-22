# Use a imagem base do Python
FROM python:3.9

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos necessários para o diretório de trabalho
COPY requirements.txt .
COPY gerar_qrcode.py .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta 5000
EXPOSE 5000

# Execute o script Python quando o contêiner for iniciado
CMD ["python", "gerar_qrcode.py"]

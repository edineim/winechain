# gerar_qrcode.py

import qrcode
import sys

# Obtem o conteúdo do QR code a partir dos argumentos da linha de comando
conteudo_qr = sys.argv[1]

# Criação do QR code
qr = qrcode.QRCode(
    version=5,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(conteudo_qr)
qr.make(fit=True)

# Criação de uma imagem do QR code
imagem_qr = qr.make_image(fill_color="black", back_color="white")

# Exibe a imagem na console
imagem_qr.show()

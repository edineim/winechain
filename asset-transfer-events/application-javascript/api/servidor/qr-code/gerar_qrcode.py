import qrcode
from PIL import Image

# Dados para o QR Code
dados_qrcode = "Hello, QR Code!"

# Criar um objeto QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Adicionar dados ao QR Code
qr.add_data(dados_qrcode)
qr.make(fit=True)

# Criar uma imagem do QR Code
img_qr = qr.make_image(fill_color="black", back_color="white")

# Salvar a imagem (opcional)
# img_qr.save("qrcode.png")

# Exibir a imagem
# img_qr.show()

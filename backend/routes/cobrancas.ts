import { Router } from 'express';
import axios from 'axios';
const router = Router();

router.post('/criar', async (req, res) => {
  const { valor, chavePix, eventoId, usuarioId } = req.body;

  try {
    const response = await axios.post(
      'https://api.neonpay.com.br/v1/cobrancas',
      {
        amount: valor,
        pix_key: chavePix,
        description: `Ingresso do evento ${eventoId}`,
        metadata: { eventoId, usuarioId }
      },
      { headers: { 'Authorization': 'Bearer SUA_CHAVE_API' } }
    );

    res.json({ qrCode: response.data.qr_code, link: response.data.payment_link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cobrança' });
  }
});

export default router;

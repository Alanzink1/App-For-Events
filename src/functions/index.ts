// Cole este código em functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();
const firestore = admin.firestore();

// O código busca a chave secreta das configurações do Firebase
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: "2024-04-10",
});

/**
 * Função 1: Cria uma intenção de pagamento.
 */
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  const eventoId = data.eventoId;
  const userId = context.auth?.uid;

  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar logado.");
  }
  if (!eventoId) {
    throw new functions.https.HttpsError("invalid-argument", "O ID do evento é obrigatório.");
  }

  const eventoDoc = await firestore.collection("eventos").doc(eventoId).get();
  const eventoData = eventoDoc.data();

  if (!eventoData || eventoData.gratuito) {
    throw new functions.https.HttpsError("not-found", "Evento não encontrado ou é gratuito.");
  }
  
  const valorEmCentavos = eventoData.valorIngresso * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: valorEmCentavos,
    currency: "brl",
    metadata: { eventoId: eventoId, userId: userId }, // Guardamos os IDs para o webhook
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
});

/**
 * Função 2: Webhook para receber a confirmação do Stripe.
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Pegamos os IDs que guardamos nos metadata
    const userId = paymentIntent.metadata.userId;
    const eventoId = paymentIntent.metadata.eventoId;

    // LÓGICA FINAL: Crie o documento do ingresso no seu banco de dados
    await firestore.collection("ingressos").add({
        usuarioId: userId,
        eventoId: eventoId,
        dataCompra: admin.firestore.FieldValue.serverTimestamp(),
        valorPago: paymentIntent.amount / 100,
        stripePaymentId: paymentIntent.id,
        confirmado: true,
        // ... adicione outros campos como codigoQRCode, etc.
    });
    console.log("Ingresso criado para o usuário:", userId);
  }

  res.status(200).send();
});
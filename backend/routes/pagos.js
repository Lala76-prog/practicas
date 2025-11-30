const express = require('express');
const router = express.Router();
const db = require('../config/db');
const moment = require('moment');

// Procesar pago premium
router.post('/', async (req, res) => {
  const { method, total, cartId, cardDetails } = req.body;
  
  // Validaciones básicas
  if (!method || !total || !cartId) {
    return res.status(400).json({ 
      success: false,
      message: 'Datos de pago incompletos' 
    });
  }
  
  if (isNaN(total) || total <= 0) {
    return res.status(400).json({ 
      success: false,
      message: 'El total debe ser un número positivo' 
    });
  }
  
  // Validar detalles de tarjeta si es pago con tarjeta
  if (method === 'card') {
    if (!cardDetails || !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
      return res.status(400).json({ 
        success: false,
        message: 'Detalles de tarjeta incompletos' 
      });
    }
    
    // Validación básica de tarjeta (simulada)
    if (!validateCardNumber(cardDetails.number)) {
      return res.status(400).json({ 
        success: false,
        message: 'Número de tarjeta inválido' 
      });
    }
  }
  
  try {
    // Obtener el próximo ID de factura incremental
    const [invoiceCount] = await db.query(
      'SELECT COUNT(*) as count FROM pagos'
    );
    const nextInvoiceId = `FAC-${String(invoiceCount[0].count + 1).padStart(6, '0')}`;
    
    // Obtener fecha y hora actual del servidor
    const [currentDate] = await db.query('SELECT NOW() as currentDate');
    const paymentDate = currentDate[0].currentDate;
    
    // Simular procesamiento con pasarela de pago
    const paymentResult = await processPaymentWithGateway({
      method,
      amount: total,
      cardDetails
    });
    
    // Crear registro de pago (sin detalles_tarjeta ya que no está en la estructura)
    const paymentRecord = {
      metodo_pago: method,
      total: parseFloat(total),
      fecha_pago: paymentDate,
      id_carrito: cartId,
      id_factura: nextInvoiceId,
      estado: 'completado'
    };
    
    // Insertar pago en la base de datos
    const [insertResult] = await db.query(
      `INSERT INTO pagos 
       (metodo_pago, total, fecha_pago, id_carrito, id_factura, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        paymentRecord.metodo_pago,
        paymentRecord.total,
        paymentRecord.fecha_pago,
        paymentRecord.id_carrito,
        paymentRecord.id_factura,
        paymentRecord.estado
      ]
    );
    
    // Obtener el pago recién insertado
    const [insertedPayments] = await db.query(
      'SELECT * FROM pagos WHERE id_pago = ?',
      [insertResult.insertId]
    );
    
    const insertedPayment = insertedPayments[0];
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Pago realizado con éxito',
      paymentId: insertedPayment.id_pago,
      invoiceId: insertedPayment.id_factura,
      paymentDate: moment(insertedPayment.fecha_pago).format('YYYY-MM-DD HH:mm:ss'),
      paymentMethod: method,
      amount: total
    });
    
  } catch (error) {
    console.error('Error al procesar pago:', error);
    
    // Registrar intento fallido
    const [currentDate] = await db.query('SELECT NOW() as currentDate');
    const paymentDate = currentDate[0].currentDate;
    
    await db.query(
      `INSERT INTO pagos 
       (metodo_pago, total, fecha_pago, id_carrito, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        method,
        total,
        paymentDate,
        cartId,
        'fallido'
      ]
    );
    
    res.status(500).json({ 
      success: false,
      message: 'Error al procesar el pago. Por favor intente nuevamente.' 
    });
  }
});

// Funciones auxiliares
function validateCardNumber(number) {
  const cleaned = number.replace(/\s+/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

function detectCardBrand(number) {
  const cleaned = number.replace(/\s+/g, '');
  
  if (/^4/.test(cleaned)) {
    return 'visa';
  }
  
  if (/^5[1-5]/.test(cleaned)) {
    return 'mastercard';
  }
  
  if (/^3[47]/.test(cleaned)) {
    return 'amex';
  }
  
  if (/^(6011|64[4-9]|65)/.test(cleaned)) {
    return 'discover';
  }
  
  return 'otra';
}

async function processPaymentWithGateway(paymentData) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        gatewayTransactionId: `gateway_${Date.now()}`
      });
    }, 1000);
  });
}

module.exports = router;
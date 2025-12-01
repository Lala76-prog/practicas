import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Alert, 
  Spinner, 
  Row, 
  Col, 
  Table,
  Badge,
  Modal,
  Form
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaTrashAlt, 
  FaPlus, 
  FaMinus, 
  FaCreditCard, 
  FaStore, 
  FaArrowLeft, 
  FaReceipt, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaLock,
  FaFileInvoiceDollar,
  FaDownload
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { usePDF } from 'react-to-pdf';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Formateador de moneda
const formatCOP = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Generador de IDs ficticios para pagos
const generateFakeId = () => {
  return 'PAY-' + Math.random().toString(36).substring(2, 15).toUpperCase();
};

// Componente de formulario de pago (se mantiene igual que antes)
const PaymentForm = ({ cartId, total, items, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validación básica para tarjeta
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc || !cardName)) {
      setError('Por favor complete todos los campos de la tarjeta');
      setLoading(false);
      return;
    }
    
    // Validación básica para PSE
    if (paymentMethod === 'pse' && !transactionNumber) {
      setError('Por favor ingrese el número de transacción');
      setLoading(false);
      return;
    }
    
    // Simular procesamiento de pago
    try {
      // Simular tiempo de espera para el pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular éxito en el pago
      const paymentId = generateFakeId();
      
      onSuccess({
        paymentId,
        total,
        method: paymentMethod,
        items: items,
        paymentDetails: paymentMethod === 'card' ? {
          cardLast4: cardNumber.slice(-4),
          cardBrand: 'VISA'
        } : {
          transactionNumber
        }
      });
      
    } catch (err) {
      const errorMsg = 'Error al procesar el pago (simulado)';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 border-0 shadow-sm">
      <h3 className="mb-4 text-center">Procesar Pago (Simulado)</h3>
      
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Método de Pago</Form.Label>
          <div className="d-flex flex-column gap-2">
            <Button
              variant={paymentMethod === 'card' ? 'primary' : 'outline-secondary'}
              onClick={() => setPaymentMethod('card')}
              className="text-start d-flex align-items-center"
            >
              <div className="bg-white rounded p-2 me-3">
                <FaCreditCard className="text-primary fs-4" />
              </div>
              <div>
                <div className="fw-bold">Tarjeta de Crédito/Débito</div>
                <small className="text-muted">Pago seguro con tarjeta</small>
              </div>
            </Button>
            
            <Button
              variant={paymentMethod === 'pse' ? 'primary' : 'outline-secondary'}
              onClick={() => setPaymentMethod('pse')}
              className="text-start d-flex align-items-center"
            >
              <div className="bg-white rounded p-2 me-3">
                <MdPayment className="text-primary fs-4" />
              </div>
              <div>
                <div className="fw-bold">PSE (Pagos Seguros en Línea)</div>
                <small className="text-muted">Transferencia bancaria</small>
              </div>
            </Button>
          </div>
        </Form.Group>

        {paymentMethod === 'card' ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nombre en la Tarjeta</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Como aparece en la tarjeta"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Número de Tarjeta</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                maxLength="19"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Expiración</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength="5"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código CVC</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength="3"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Número de Transacción</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ingrese el número de transacción"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
            />
            <Form.Text className="text-muted">
              Este número lo recibirá después de completar la transferencia en su banco.
            </Form.Text>
          </Form.Group>
        )}
        
        <div className="bg-light p-3 rounded mb-4">
          <h5 className="mb-3">Resumen de Compra</h5>
          <div className="d-flex justify-content-between mb-2">
            <span>Productos:</span>
            <span>{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total a pagar:</span>
            <span className="text-primary">{formatCOP(total)}</span>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
          className="w-100 py-3 fw-bold shadow-sm"
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Procesando Pago...
            </>
          ) : (
            <>
              <FaLock className="me-2" />
              Confirmar y Pagar (Simulado)
            </>
          )}
        </Button>
        
        <div className="text-center mt-3 small text-muted">
          <FaLock className="me-2" />
          Esta es una simulación de pago. No se realizarán cargos reales.
        </div>
      </Form>
    </Card>
  );
};

// Componente de factura en PDF (se mantiene igual que antes)
const InvoicePDF = ({ order, companyInfo }) => {
  const invoiceRef = useRef();
  const { toPDF, targetRef } = usePDF({filename: `factura_${order.id}.pdf`});

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Logo y encabezado
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.address, 105, 28, { align: 'center' });
    doc.text(`${companyInfo.phone} | ${companyInfo.email} | ${companyInfo.website}`, 105, 34, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
    // Título de factura
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE VENTA', 105, 50, { align: 'center' });
    
    // Información de la factura
    doc.setFontSize(10);
    doc.text(`Número: ${order.id}`, 20, 60);
    doc.text(`Fecha: ${new Date(order.date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 66);
    doc.text(`Método de pago: ${order.method === 'card' ? 'Tarjeta' : 'PSE'}`, 20, 72);
    
    if (order.method === 'card' && order.paymentDetails) {
      doc.text(`Tarjeta terminada en: ${order.paymentDetails.cardLast4 || '****'}`, 20, 78);
      doc.text(`Tipo: ${order.paymentDetails.cardBrand || 'Tarjeta'}`, 20, 84);
    } else if (order.method === 'pse' && order.paymentDetails) {
      doc.text(`N° Transacción: ${order.paymentDetails.transactionNumber || 'N/A'}`, 20, 78);
    }
    
    // Información del cliente
    doc.text('Cliente:', 130, 60);
    doc.text('Nombre: Cliente Demo', 130, 66);
    doc.text('Identificación: 123456789', 130, 72);
    doc.text('Email: cliente@demo.com', 130, 78);
    doc.text('Dirección: Calle 123 #45-67, Bogotá', 130, 84);
    
    // Tabla de productos
    doc.autoTable({
      startY: 100,
      head: [['Producto', 'Precio Unitario', 'Cantidad', 'Total']],
      body: order.items.map(item => [
        item.nombre,
        formatCOP(item.precio_unitario),
        item.cantidad,
        formatCOP(item.total)
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 10 },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' }
      }
    });
    
    // Totales
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text('Subtotal:', 150, finalY);
    doc.text(formatCOP(order.total), 180, finalY, { align: 'right' });
    
    doc.text('IVA (0%):', 150, finalY + 6);
    doc.text(formatCOP(0), 180, finalY + 6, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 150, finalY + 16);
    doc.text(formatCOP(order.total), 180, finalY + 16, { align: 'right' });
    
    // Términos y condiciones
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Términos y condiciones:', 20, finalY + 30);
    doc.text('1. Todos los precios incluyen IVA cuando aplique.', 20, finalY + 36);
    doc.text('2. Los productos deben ser devueltos en su empaque original.', 20, finalY + 42);
    doc.text('3. Para reclamos por garantía presentar factura original.', 20, finalY + 48);
    
    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.legalText, 105, 280, { align: 'center' });
    
    // Guardar el PDF
    doc.save(`factura_${order.id}.pdf`);
  };

  return (
    <div ref={targetRef} className="p-4">
      <div ref={invoiceRef} className="invoice-container">
        <div className="text-center mb-4">
          <h2 className="fw-bold">{companyInfo.name}</h2>
          <p className="text-muted mb-1">NIT: {companyInfo.taxId}</p>
          <p className="text-muted mb-1">{companyInfo.address}</p>
          <p className="text-muted mb-1">
            {companyInfo.phone} | {companyInfo.email} | {companyInfo.website}
          </p>
        </div>
        
        <hr className="my-4" />
        
        <h3 className="text-center fw-bold mb-4">FACTURA DE VENTA</h3>
        
        <Row className="mb-4">
          <Col md={6}>
            <div className="mb-3">
              <h6 className="fw-bold">Número de Factura:</h6>
              <p>{order.id}</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold">Fecha y Hora:</h6>
              <p>{new Date(order.date).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold">Método de pago:</h6>
              <p>{order.method === 'card' ? 'Tarjeta de Crédito/Débito' : 'PSE (Transferencia Bancaria)'}</p>
              {order.method === 'card' && order.paymentDetails && (
                <>
                  <p>Tarjeta terminada en: {order.paymentDetails.cardLast4 || '****'}</p>
                  <p>Tipo: {order.paymentDetails.cardBrand || 'Tarjeta'}</p>
                </>
              )}
              {order.method === 'pse' && order.paymentDetails && (
                <p>N° Transacción: {order.paymentDetails.transactionNumber || 'N/A'}</p>
              )}
            </div>
          </Col>
          <Col md={6}>
            <h6 className="fw-bold">Cliente:</h6>
            <p>Nombre: Cliente Demo</p>
            <p>Identificación: 123456789</p>
            <p>Email: cliente@demo.com</p>
            <p>Dirección: Calle 123 #45-67, Bogotá</p>
          </Col>
        </Row>
        
        <Table bordered className="mb-4">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th className="text-end">Precio Unitario</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.imagen} 
                      alt={item.nombre}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                      <small className="text-muted">{item.descripcion?.substring(0, 50)}...</small>
                    </div>
                  </div>
                </td>
                <td className="text-end">{formatCOP(item.precio_unitario)}</td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-end">{formatCOP(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <div className="text-end">
          <div className="mb-2">
            <span className="me-3">Subtotal:</span>
            <strong>{formatCOP(order.total)}</strong>
          </div>
          <div className="mb-2">
            <span className="me-3">IVA (0%):</span>
            <strong>{formatCOP(0)}</strong>
          </div>
          <div className="mb-2 fs-5">
            <span className="me-3">Total:</span>
            <strong className="text-primary">{formatCOP(order.total)}</strong>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <h5 className="fw-bold mb-3">Términos y condiciones:</h5>
        <ol className="small">
          <li>Todos los precios incluyen IVA cuando aplique.</li>
          <li>Los productos deben ser devueltos en su empaque original.</li>
          <li>Para reclamos por garantía presentar factura original.</li>
          <li>El plazo para cambios es de 15 días calendario después de la compra.</li>
          <li>Las garantías de fábrica aplican según políticas del proveedor.</li>
        </ol>
        
        <hr className="my-4" />
        
        <p className="text-muted text-center small">{companyInfo.legalText}</p>
      </div>
      
      <div className="d-flex justify-content-center mt-4 gap-3">
        <Button 
          variant="primary" 
          onClick={generatePDF}
          className="d-flex align-items-center"
        >
          <FaDownload className="me-2" />
          Descargar Factura (jsPDF)
        </Button>
        
        <Button 
          variant="success" 
          onClick={() => toPDF()}
          className="d-flex align-items-center"
        >
          <FaDownload className="me-2" />
          Descargar Factura (react-to-pdf)
        </Button>
      </div>
    </div>
  );
};

// Componente principal del carrito (con conexión a la API)
const ShoppingCart = () => {
  const [cart, setCart] = useState({ 
    items: [], 
    total: 0 
  });
  
  const [loading, setLoading] = useState({
    page: true,
    action: false
  });
  
  const [notifications, setNotifications] = useState({
    error: null,
    success: null
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  // Información de la empresa para la factura
  const companyInfo = {
    name: "Sichf - Calzado de Calidad",
    address: "Calle 123 #45-67, Bogotá D.C., Colombia",
    phone: "+57 1 1234567",
    email: "ventas@sichf.com",
    website: "www.sichf.com",
    legalText: "Esta factura de venta se asimila en sus efectos legales a una letra de cambio según el artículo 774 del Código de Comercio Colombiano. NIT: 901.234.567-8",
    taxId: "901.234.567-8"
  };

  // Cargar datos del carrito desde la API
  const fetchCart = async () => {
    setLoading(prev => ({ ...prev, page: true }));
    setNotifications({ error: null, success: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/carrito', {
        headers: {
          'Content-Type': 'application/json',
          // Aquí puedes agregar headers de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }
      
      const data = await response.json();
      
      setCart({
        items: data.data.items || [],
        total: data.data.total || 0
      });
      
    } catch (err) {
      console.error('Error al cargar carrito:', err);
      setNotifications(prev => ({ 
        ...prev, 
        error: err.message || "Error al cargar el carrito" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  // Agregar producto al carrito
  const addToCart = async (id_calzado, cantidad) => {
    setLoading(prev => ({ ...prev, action: true }));
    setNotifications({ error: null, success: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_calzado,
          cantidad
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar al carrito');
      }

      setCart({
        items: data.data.items,
        total: data.data.total
      });

      setNotifications(prev => ({
        ...prev,
        success: 'Producto agregado al carrito'
      }));
      
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      setNotifications(prev => ({ 
        ...prev, 
        error: err.message || "Error al agregar al carrito" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = async (id_carrito, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(prev => ({ ...prev, action: true }));
    setNotifications({ error: null, success: null });
    
    try {
      const response = await fetch(`http://localhost:3001/api/carrito/${id_carrito}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cantidad: newQuantity
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar cantidad');
      }

      setCart({
        items: data.data.items,
        total: data.data.total
      });
      
      setNotifications(prev => ({
        ...prev,
        success: 'Cantidad actualizada correctamente'
      }));
      
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      setNotifications(prev => ({ 
        ...prev, 
        error: err.message || "Error al actualizar cantidad" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Eliminar producto del carrito
  const removeItem = async (id_carrito) => {
    setLoading(prev => ({ ...prev, action: true }));
    setNotifications({ error: null, success: null });
    
    try {
      const response = await fetch(`http://localhost:3001/api/carrito/${id_carrito}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar producto');
      }

      setCart({
        items: data.data.items,
        total: data.data.total
      });
      
      setNotifications(prev => ({
        ...prev,
        success: 'Producto eliminado del carrito'
      }));
      
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setNotifications(prev => ({ 
        ...prev, 
        error: err.message || "Error al eliminar producto" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Manejar éxito en el pago (simulado)
  const handlePaymentSuccess = (result) => {
    setNotifications(prev => ({
      ...prev,
      success: `¡Pago exitoso (simulado)! ID de transacción: ${result.paymentId}`
    }));
    
    const newOrder = {
      id: result.paymentId,
      total: result.total,
      method: result.method,
      items: result.items,
      date: new Date().toISOString(),
      paymentDetails: result.paymentDetails
    };
    
    setOrder(newOrder);
    setShowPaymentModal(false);
    setShowInvoiceModal(true);
    
    // Vaciar el carrito después del pago exitoso
    setCart({ items: [], total: 0 });
  };

  // Manejar error en el pago
  const handlePaymentError = (error) => {
    setNotifications(prev => ({
      ...prev,
      error: error
    }));
  };

  // Calcular total de artículos
  const totalItems = cart.items.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  // Mostrar spinner mientras carga
  if (loading.page && cart.items.length === 0) {
    return (
      <div className="container text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status" className="my-5">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <h5 className="mt-3 text-primary">Cargando tu carrito...</h5>
      </div>
    );
  }

  // Mostrar confirmación de pedido
  if (order && !showInvoiceModal) {
    return (
      <div className="container py-5">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0 py-4">
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success fs-1 me-3" />
              <div>
                <h1 className="h3 mb-1 fw-bold">¡Pago Completado!</h1>
                <p className="text-muted mb-0">Gracias por tu compra</p>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Detalles del Pedido</h5>
              
              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold">ID de Transacción</h6>
                    <p>{order.id}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="fw-bold">Método de Pago</h6>
                    <p>
                      {order.method === 'card' ? 'Tarjeta de Crédito/Débito' : 
                       order.method === 'pse' ? 'PSE (Transferencia Bancaria)' : 
                       'Otro método'}
                    </p>
                    {order.method === 'card' && order.paymentDetails && (
                      <p>Terminada en: {order.paymentDetails.cardLast4 || '****'}</p>
                    )}
                    {order.method === 'pse' && order.paymentDetails && (
                      <p>N° Transacción: {order.paymentDetails.transactionNumber || 'N/A'}</p>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold">Fecha y Hora</h6>
                    <p>{new Date(order.date).toLocaleString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="fw-bold">Total Pagado</h6>
                    <p className="text-primary fw-bold fs-4">{formatCOP(order.total)}</p>
                  </div>
                </Col>
              </Row>
              
              <hr />
              
              <h5 className="fw-bold mb-3">Productos Comprados</h5>
              <Table responsive className="mb-4">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Precio Unitario</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id_carrito}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imagen} 
                            alt={item.nombre}
                            className="rounded me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                            <small className="text-muted">{item.descripcion?.substring(0, 50)}...</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-end align-middle">{formatCOP(item.precio_unitario)}</td>
                      <td className="text-center align-middle">{item.cantidad}</td>
                      <td className="text-end align-middle fw-bold">{formatCOP(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <div className="d-flex justify-content-between">
              <Button 
                as={Link} 
                to="/productos" 
                variant="outline-primary"
                className="px-4"
              >
                <FaStore className="me-2" />
                Seguir Comprando
              </Button>
              
              <Button 
                variant="primary"
                className="px-4"
                onClick={() => setShowInvoiceModal(true)}
              >
                <FaFileInvoiceDollar className="me-2" />
                Ver Factura
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Modal de Factura */}
      <Modal 
        show={showInvoiceModal} 
        onHide={() => setShowInvoiceModal(false)} 
        size="xl"
        fullscreen="lg-down"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            <FaFileInvoiceDollar className="me-2" />
            Factura de Compra
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {order && <InvoicePDF order={order} companyInfo={companyInfo} />}
        </Modal.Body>
      </Modal>
      
      <div className="d-flex align-items-center mb-4">
        <h1 className="mb-0 fw-bold">
          <FaShoppingCart className="me-3" />
          Mi Carrito de Compras
        </h1>
        {totalItems > 0 && (
          <Badge pill bg="primary" className="ms-3 fs-6">
            {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
          </Badge>
        )}
      </div>
      
      {notifications.error && (
        <Alert variant="danger" dismissible 
          onClose={() => setNotifications(prev => ({ ...prev, error: null }))}
          className="border-0 shadow-sm">
          <FaExclamationTriangle className="me-2" />
          {notifications.error}
        </Alert>
      )}
      
      {notifications.success && (
        <Alert variant="success" dismissible 
          onClose={() => setNotifications(prev => ({ ...prev, success: null }))}
          className="border-0 shadow-sm">
          <FaCheckCircle className="me-2" />
          {notifications.success}
        </Alert>
      )}
      
      {cart.items.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body className="py-5">
            <div className="mb-4 text-muted opacity-75">
              <FaShoppingCart className="fa-4x" />
            </div>
            <Card.Title as="h3" className="mb-3 fw-bold">
              Tu carrito está vacío
            </Card.Title>
            <Card.Text className="text-muted mb-4 fs-5">
              Agrega productos para continuar
            </Card.Text>
            <Button 
              as={Link} 
              to="/productos" 
              variant="primary"
              size="lg"
              className="px-4 py-3 fw-bold"
            >
              <FaStore className="me-2" />
              Explorar Productos
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Tus Productos Seleccionados</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40%' }}>Producto</th>
                      <th className="text-end">Precio</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map(item => (
                      <tr key={item.id_carrito}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.imagen} 
                              alt={item.nombre}
                              className="rounded me-3"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-1 fw-bold">{item.nombre}</h6>
                              <p className="small text-muted mb-0">
                                {item.descripcion?.substring(0, 60)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-end align-middle">
                          <div className="fw-bold">{formatCOP(item.precio_unitario)}</div>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-1">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateQuantity(item.id_carrito, item.cantidad - 1)}
                                disabled={loading.action || item.cantidad <= 1}
                                className="px-3"
                              >
                                <FaMinus />
                              </Button>
                              
                              <div className="mx-2 my-auto fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
                                {item.cantidad}
                              </div>
                              
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateQuantity(item.id_carrito, item.cantidad + 1)}
                                disabled={loading.action || item.cantidad >= item.stock}
                                className="px-3"
                              >
                                <FaPlus />
                              </Button>
                            </div>
                            
                            <small className={`text-center ${item.stock < 5 ? 'text-danger' : 'text-muted'}`}>
                              {item.stock > 0 
                                ? `${item.stock} disponibles` 
                                : 'Agotado'}
                            </small>
                          </div>
                        </td>
                        <td className="text-end align-middle fw-bold">
                          {formatCOP(item.total)}
                        </td>
                        <td className="text-center align-middle">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(item.id_carrito)}
                            disabled={loading.action}
                            className="p-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <FaReceipt className="me-2" />
                  Resumen de Compra
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span className="fw-bold">
                      {formatCOP(cart.items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0))}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span className="fw-bold">Gratis</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Total:</h5>
                    <h4 className="text-primary mb-0 fw-bold">
                      {formatCOP(cart.total)}
                    </h4>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-100 mb-3 py-3 fw-bold shadow-sm"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={loading.action || cart.items.length === 0}
                >
                  <FaCreditCard className="me-2" />
                  Proceder al Pago
                </Button>
                
                <Button 
                  as={Link} 
                  to="/productos" 
                  variant="outline-primary" 
                  className="w-100 mb-2"
                >
                  <FaArrowLeft className="me-2" />
                  Continuar Comprando
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Modal de Pago */}
      <Modal 
        show={showPaymentModal} 
        onHide={() => setShowPaymentModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <MdPayment className="me-2" />
            Finalizar Compra
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentForm 
            cartId={`cart_${Date.now()}`}
            total={cart.total}
            items={cart.items}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShoppingCart;
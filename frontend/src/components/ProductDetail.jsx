import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Row, Col, Badge, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [product, setProduct] = useState(state?.product || null);

  // Función para formatear precios en pesos colombianos (sin decimales)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Función para convertir el precio a número entero
  const parsePriceToInteger = (price) => {
    if (typeof price === 'number') return Math.round(price);
    if (typeof price === 'string') {
      // Eliminar símbolos de moneda y separadores de miles
      const cleaned = price.replace(/[^\d]/g, '');
      const parsed = parseInt(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Validación de datos del producto
  const validateProductData = () => {
    if (!product) {
      setError("El producto no está disponible");
      return false;
    }

    const requiredFields = ['id_info_calzado', 'precio_unitario', 'descripcion'];
    for (const field of requiredFields) {
      if (!product[field]) {
        setError(`Información incompleta del producto: falta ${field}`);
        return false;
      }
    }

    const price = parsePriceToInteger(product.precio_unitario);
    if (isNaN(price) || price <= 0) {
      setError("El precio del producto no es válido");
      return false;
    }

    if (quantity < 1) {
      setError("La cantidad debe ser al menos 1 unidad");
      return false;
    }

    if (quantity > parseInt(product.cantidad)) {
      setError(`No hay suficiente stock. Disponible: ${product.cantidad} unidades`);
      return false;
    }

    return true;
  };

  // Efecto para verificar y normalizar el producto al cargar
  useEffect(() => {
    if (state?.product) {
      const normalizedProduct = {
        ...state.product,
        // Asegurar que el precio sea un número entero
        precio_unitario: parsePriceToInteger(state.product.precio_unitario)
      };
      setProduct(normalizedProduct);
    }
  }, [state]);

  // Manejar agregar al carrito
  const handleAddToCart = async () => {
    setError(null);
    setSuccess(null);

    if (!validateProductData()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const cartItem = {
        id_calzado: parseInt(product.id_info_calzado),
        cantidad: parseInt(quantity),
        precio_unitario: parsePriceToInteger(product.precio_unitario), // Asegurar precio entero
        nombre: product.descripcion.toString(),
        imagen: product.imagen ? product.imagen.toString() : 'default.jpg',
        talla: product.talla ? product.talla.toString() : 'UN',
        color: product.color ? product.color.toString() : 'No especificado',
        material: product.material ? product.material.toString() : 'No especificado'
      };

      const response = await axios.post(
        'http://localhost:3001/api/carrito',
        cartItem,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        setSuccess('¡Producto agregado al carrito con éxito!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data?.error || "Error desconocido al agregar al carrito");
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      
      let errorMessage = "Error al agregar al carrito";
      if (err.response) {
        if (err.response.status === 401) {
          navigate('/login');
          return;
        }
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="container text-center my-5">
        <Alert variant="danger" className="mb-4">
          Producto no encontrado
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          size="lg"
        >
          Volver al catálogo
        </Button>
      </div>
    );
  }

  const stockDisponible = parseInt(product.cantidad);

  return (
    <div className="container py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-4"
        size="sm"
      >
        &larr; Volver atrás
      </Button>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible className="mb-4">
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Img 
              variant="top" 
              src={product.imagen || '/placeholder.jpg'} 
              className="p-3"
              style={{ 
                maxHeight: '500px', 
                objectFit: 'contain',
                backgroundColor: '#f8f9fa'
              }}
              onError={(e) => e.target.src = '/placeholder.jpg'}
              alt={product.descripcion}
            />
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <Card.Title as="h1" className="mb-3 fw-bold">
                {product.descripcion}
              </Card.Title>
              
              <div className="mb-4">
                {product.talla && (
                  <Badge bg="light" text="dark" className="me-2 border">
                    <i className="fas fa-ruler-vertical me-1"></i>
                    Talla: {product.talla}
                  </Badge>
                )}
                {product.color && (
                  <Badge bg="light" text="dark" className="me-2 border">
                    <i className="fas fa-palette me-1"></i>
                    Color: {product.color}
                  </Badge>
                )}
                {product.material && (
                  <Badge bg="light" text="dark" className="border">
                    <i className="fas fa-puzzle-piece me-1"></i>
                    Material: {product.material}
                  </Badge>
                )}
              </div>

              <div className="d-flex align-items-center mb-4">
                <h2 className="text-primary mb-0 fw-bold">
                  {formatPrice(product.precio_unitario)}
                </h2>
                <small className="text-muted ms-2">(Precio en pesos colombianos)</small>
              </div>

              <div className="mb-3">
                <Badge bg={stockDisponible > 0 ? "success" : "secondary"}>
                  {`Stock disponible: ${stockDisponible} unidades`}
                </Badge>
              </div>

              <Card.Text className="mb-4 text-muted">
                {product.descripcion_larga || product.descripcion || "Este producto no tiene descripción disponible."}
              </Card.Text>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Cantidad:</Form.Label>
                <div className="d-flex align-items-center mb-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || loading}
                    className="px-3"
                  >
                    <i className="fas fa-minus"></i>
                  </Button>
                  <Form.Control 
                    type="number" 
                    min="1" 
                    max={stockDisponible}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(stockDisponible, value)));
                    }}
                    className="mx-2 text-center"
                    style={{ width: '60px' }}
                    disabled={loading}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={loading || quantity >= stockDisponible}
                    className="px-3"
                  >
                    <i className="fas fa-plus"></i>
                  </Button>
                </div>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="py-3 fw-bold"
                  onClick={handleAddToCart}
                  disabled={loading || stockDisponible <= 0}
                >
                  {loading ? (
                    <>
                      <Spinner 
                        as="span" 
                        animation="border" 
                        size="sm" 
                        role="status" 
                        aria-hidden="true" 
                        className="me-2"
                      />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cart-plus me-2"></i>
                      Agregar al Carrito
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
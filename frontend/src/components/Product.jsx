import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Form, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const navigate = useNavigate();

  // Categorías disponibles
  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'hombre', name: 'Hombres' },
    { id: 'mujer', name: 'Mujeres' },
    { id: 'niño', name: 'Niños' },
    { id: 'otros', name: 'Otros' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:3001/api/info_calzado');
        
        if (!response.data.success) {
          throw new Error(response.data.error || 'Error al obtener productos');
        }
        
        // Normalizar las categorías de los productos
        const normalizedProducts = response.data.data.map(product => {
          // Asegurarnos de que la categoría esté en minúsculas y sea una de las permitidas
          let categoria = product.categoria?.toLowerCase() || 'otros';
          
          // Mapear categorías similares a las principales
          if (categoria.includes('hombre') || categoria.includes('caballero')) {
            categoria = 'hombre';
          } else if (categoria.includes('mujer') || categoria.includes('dama')) {
            categoria = 'mujer';
          } else if (categoria.includes('niño') || categoria.includes('niña') || categoria.includes('infantil')) {
            categoria = 'niño';
          }
          
          // Si no coincide con ninguna categoría principal, usar 'otros'
          if (!['hombre', 'mujer', 'niño'].includes(categoria)) {
            categoria = 'otros';
          }
          
          return { 
            ...product, 
            categoria,
            // Asegurar que la descripción no sea null
            descripcion: product.descripcion || `${product.nombre || 'Producto'} - ${product.color || ''} - Talla ${product.talla || ''}`.trim()
          };
        });
        
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Filtrar por categoría
    if (activeCategory !== 'todos') {
      result = result.filter(product => product.categoria === activeCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.descripcion.toLowerCase().includes(term) ||
        (product.nombre && product.nombre.toLowerCase().includes(term)) ||
        (product.material && product.material.toLowerCase().includes(term)) ||
        (product.color && product.color.toLowerCase().includes(term))
      );
    }
    
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" />
      <p>Cargando productos...</p>
    </div>
  );

  return (
    <div className="container py-5">
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1>Catálogo de Productos</h1>
        </Col>
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Selector de categorías */}
      <div className="mb-4">
        <h5 className="mb-3">Filtrar por categoría:</h5>
        <ButtonGroup>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'primary' : 'outline-primary'}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </div>
        </Alert>
      )}

      {filteredProducts.length === 0 ? (
        <Alert variant="info">
          No se encontraron productos {activeCategory !== 'todos' ? `en la categoría ${categories.find(c => c.id === activeCategory)?.name}` : ''}
          {searchTerm && ` que coincidan con "${searchTerm}"`}
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.id_info_calzado} md={4} lg={3}>
              <Card className="h-100 shadow">
                <Card.Img 
                  variant="top" 
                  src={product.imagen || '/placeholder.jpg'} 
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                  alt={product.descripcion}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.descripcion}</Card.Title>
                  <Card.Text>
                    <strong>Categoría:</strong> {categories.find(c => c.id === product.categoria)?.name || 'Otros'}<br />
                    <strong>Material:</strong> {product.material || 'No especificado'}<br />
                    <strong>Color:</strong> {product.color || 'No especificado'}<br />
                    <strong>Talla:</strong> {product.talla || 'Única'}
                  </Card.Text>
                  <div className="mt-auto">
                    <h5 className="text-success mb-3">
                      {formatPrice(product.precio_unitario)}
                    </h5>
                    <Button 
                      variant="outline-primary"
                      as={Link}
                      to={`/products/${product.id_info_calzado}`}
                      state={{ product }}
                      className="w-100"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Products;
import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Spinner, Form, FloatingLabel, Dropdown, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FaSignInAlt, 
  FaEnvelope, 
  FaLock, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle,
  FaShoppingBag,
  FaUserShield
} from "react-icons/fa";
import CartBtn from './CartBtn';

const Login = () => {
  // Estados del componente
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [showCompras, setShowCompras] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener usuario del localStorage de forma segura
  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      return null;
    }
  };

  // Mostrar alertas
  const showAlert = (type, title, message, autoClose = true) => {
    setAlert({ type, title, message });
    if (autoClose) {
      setTimeout(() => setAlert(null), type === "success" ? 2000 : 5000);
    }
  };

  // Obtener historial de compras
  const fetchCompras = async () => {
    if (!isAuthenticated) return;
    
    setLoadingCompras(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/pagos", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      });
      setCompras(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al obtener compras:", error);
      let errorMessage = "Error al cargar historial de compras";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente";
          handleLogout();
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Tiempo de espera agotado. Verifica tu conexión";
      } else {
        errorMessage = "Error de conexión con el servidor";
      }
      
      showAlert("danger", "Error", errorMessage);
      setCompras([]);
    } finally {
      setLoadingCompras(false);
    }
  };

  // Alternar visibilidad del historial de compras
  const toggleCompras = () => {
    if (!showCompras) {
      fetchCompras();
    }
    setShowCompras(!showCompras);
  };

  // Efecto para verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getStoredUser();
    const userIsAuthenticated = !!token;
    
    setIsAuthenticated(userIsAuthenticated);
    setUserRole(user?.role || null);

    // Redirecciones basadas en autenticación y rol
    if (userIsAuthenticated) {
      if (window.location.pathname === "/") {
        const redirectPath = user?.role === 'admin' ? '/admin' : '/products';
        navigate(redirectPath);
      }
      
      if (user?.role === 'admin' && window.location.pathname === "/products") {
        navigate('/admin');
      }
    }
    
    // Mostrar modal si intenta acceder a rutas protegidas sin autenticación
    if (!userIsAuthenticated && (window.location.pathname === "/products" || window.location.pathname === "/admin")) {
      setShowModal(true);
      showAlert(
        "warning",
        "Acceso restringido",
        "Debes iniciar sesión para acceder a esta página"
      );
      navigate("/");
    }
    
    // Manejar redirección desde rutas protegidas
    if (location.state?.fromProtected) {
      setShowModal(true);
      showAlert(
        "warning",
        "Acceso restringido",
        "Por favor inicia sesión para acceder"
      );
    }
  }, [location.state?.fromProtected, navigate]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3001/api/login", formData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Guardar token y usuario
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setIsAuthenticated(true);
      setUserRole(response.data.user.role);
      
      showAlert(
        "success",
        "¡Bienvenido!",
        `Sesión iniciada como ${response.data.user.role === 'admin' ? 'administrador' : 'usuario'}. Redirigiendo...`
      );

      setTimeout(() => {
        const redirectPath = response.data.user.role === 'admin' ? '/admin' : '/products';
        navigate(redirectPath);
        setShowModal(false);
      }, 1500);
      
    } catch (error) {
      let message = "Error al conectar con el servidor. Intenta más tarde.";
      
      if (error.code === 'ECONNABORTED') {
        message = "Tiempo de espera agotado. Verifica tu conexión.";
      } else if (error.response) {
        message = error.response.data?.error || message;
      } else if (error.request) {
        message = "No hay respuesta del servidor. Verifica tu conexión.";
      }
      
      showAlert("danger", "Error de autenticación", message);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(null);
    setCompras([]);
    navigate("/");
  };

  // Navegar a registro
  const handleNavigateToSignup = () => {
    setShowModal(false);
    navigate("/signup", { state: { fromLogin: true } });
  };

  // Iconos para las alertas
  const alertIcons = {
    success: <FaCheckCircle className="me-2" />,
    danger: <FaExclamationTriangle className="me-2" />,
    warning: <FaExclamationTriangle className="me-2" />,
    info: <FaExclamationTriangle className="me-2" />
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {/* Menú para usuarios autenticados */}
      {isAuthenticated ? (
        <>
          <CartBtn />
          
          {userRole === 'admin' && (
            <Button 
              variant="outline-warning" 
              onClick={() => navigate('/admin')}
              className="d-flex align-items-center"
            >
              <FaUserShield className="me-2" />
              <span>Admin</span>
            </Button>
          )}
          
          <Dropdown show={showCompras} onToggle={toggleCompras}>
            <Dropdown.Toggle 
              variant="outline-primary" 
              className="d-flex align-items-center position-relative"
            >
              <FaUserCircle className="me-2" size={20} />
              <span>Mi Cuenta</span>
              {compras.length > 0 && (
                <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">
                  {compras.length}
                </Badge>
              )}
            </Dropdown.Toggle>
            
            <Dropdown.Menu className="p-3" style={{ minWidth: '300px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Historial de Compras</h6>
                <FaShoppingBag className="text-primary" />
              </div>
              
              {showCompras && (
                <>
                  {loadingCompras ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                      <p className="small mt-2 mb-0">Cargando compras...</p>
                    </div>
                  ) : compras.length > 0 ? (
                    <div className="small">
                      <div className="d-flex fw-bold mb-2 pb-1 border-bottom">
                        <div className="flex-grow-1">Método</div>
                        <div className="text-end">Total</div>
                        <div className="text-end" style={{ width: '80px' }}>Fecha</div>
                      </div>
                      
                      {compras.slice(0, 5).map((compra, index) => (
                        <div key={index} className="d-flex mb-2">
                          <div className="flex-grow-1">{compra.metodo_pago || 'No especificado'}</div>
                          <div className="text-end">${compra.total?.toFixed(2) || '0.00'}</div>
                          <div className="text-end" style={{ width: '80px' }}>
                            {compra.fecha_pago ? new Date(compra.fecha_pago).toLocaleDateString() : '--'}
                          </div>
                        </div>
                      ))}
                      
                      {compras.length > 5 && (
                        <div className="text-center small mt-2">
                          <Button variant="link" size="sm" onClick={() => navigate('/historial')}>
                            Ver todas ({compras.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="small text-muted mb-0">No hay compras registradas</p>
                  )}
                </>
              )}
              
              <Dropdown.Divider />
              
              <div className="d-grid">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        <Button 
          variant="outline-primary" 
          onClick={() => {
            setShowModal(true);
            setValidated(false);
            setAlert(null);
          }}
          className="d-flex align-items-center"
        >
          <FaSignInAlt className="me-2" />
          <span>Iniciar Sesión</span>
        </Button>
      )}

      {/* Modal de Login */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          setAlert(null);
        }}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100 text-center">
            <h3 className="fw-bold text-primary">Inicio de Sesión</h3>
            <p className="text-muted small">Ingresa tus credenciales</p>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pt-0">
          {alert && (
            <Alert 
              variant={alert.type} 
              className="d-flex align-items-center"
              onClose={() => setAlert(null)} 
              dismissible
            >
              {alertIcons[alert.type]}
              <div>
                <strong>{alert.title}</strong>
                <div className="small">{alert.message}</div>
              </div>
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel controlId="floatingEmail" label="Correo Electrónico" className="mb-3">
              <Form.Control
                type="email"
                placeholder="nombre@ejemplo.com"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Ingresa un correo válido
              </Form.Control.Feedback>
              <div className="text-end text-muted small mt-1">
                <FaEnvelope />
              </div>
            </FloatingLabel>
            
            <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-4">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
              />
              <Form.Control.Feedback type="invalid">
                Mínimo 6 caracteres
              </Form.Control.Feedback>
              <div className="text-end text-muted small mt-1">
                <FaLock />
              </div>
            </FloatingLabel>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 py-2 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-2" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </Form>

          {/* Sección de registro */}
          <div className="text-center mt-3">
            <p className="small text-muted">
              ¿No tienes una cuenta?{' '}
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 align-baseline text-primary" 
                onClick={handleNavigateToSignup}
                style={{ textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Regístrate aquí
                <FaUserPlus className="ms-1" size={12} />
              </Button>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
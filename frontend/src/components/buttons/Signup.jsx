import React, { useState } from "react";
import { Modal, Button, Alert, Spinner, Form, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaEnvelope, FaLock, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const showAlert = (type, title, message, autoClose = true) => {
    setAlert({ type, title, message });
    if (autoClose) {
      setTimeout(() => setAlert(null), type === "success" ? 2000 : 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        showAlert(
          "success",
          "¡Registro exitoso!",
          "Tu cuenta ha sido creada correctamente."
        );
        setFormData({
          correo: "",
          password: "",
          remember: false
        });
        setValidated(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }
    } catch (error) {
      showAlert(
        "danger",
        "Error en el registro",
        error.message || "Ocurrió un error al registrar tu cuenta. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const alertIcons = {
    success: <FaCheckCircle className="me-2" />,
    danger: <FaExclamationTriangle className="me-2" />,
    warning: <FaExclamationTriangle className="me-2" />,
    info: <FaExclamationTriangle className="me-2" />
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={() => {
          setShowModal(true);
          setValidated(false);
          setAlert(null);
        }}
        className="d-flex align-items-center ms-2"
      >
        <FaUserPlus className="me-2" />
        <span>Registro</span>
      </Button>

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
            <h3 className="fw-bold text-primary">Crear Cuenta</h3>
            <p className="text-muted small">Completa el formulario para registrarte</p>
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
              <div className="invalid-feedback">
                Por favor ingresa un correo electrónico válido
              </div>
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
              <div className="invalid-feedback">
                La contraseña debe tener al menos 6 caracteres
              </div>
              <div className="text-end text-muted small mt-1">
                <FaLock />
              </div>
            </FloatingLabel>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="rememberCheck"
                label="Recordar mis datos"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registrando...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" />
                  Registrarme
                </>
              )}
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center">
          <p className="small text-muted mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Button
              variant="link"
              className="text-primary text-decoration-none p-0"
              onClick={() => {
                setShowModal(false);
                navigate("/login", { state: { fromSignup: true } });
              }}
            >
              Inicia sesión aquí
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Signup;
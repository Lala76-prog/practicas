import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function InfoCalzadoCrud() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [infoSeleccionada, setInfoSeleccionada] = useState({
    id_info_calzado: '',
    material: '',
    talla: '',
    color: '',
    descripcion: '',
    precio_unitario: '',
    id_calzados: '',
    cantidad: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const obtenerInfo = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/info_calzado`);
      setData(res.data.data);
    } catch (error) {
      console.error('Error al obtener info calzado:', error);
      alert('Error al cargar los datos');
    }
  };

  useEffect(() => {
    obtenerInfo();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!infoSeleccionada.material?.trim()) newErrors.material = 'Material es requerido';
    if (!infoSeleccionada.talla) newErrors.talla = 'Talla es requerida';
    if (!infoSeleccionada.color?.trim()) newErrors.color = 'Color es requerido';
    if (!infoSeleccionada.precio_unitario || infoSeleccionada.precio_unitario <= 0)
      newErrors.precio_unitario = 'Precio unitario debe ser mayor a 0';
    if (!infoSeleccionada.id_calzados) newErrors.id_calzados = 'ID de calzado es requerido';
    if (infoSeleccionada.cantidad < 0 || infoSeleccionada.cantidad === '')
      newErrors.cantidad = 'Cantidad no puede ser negativa';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setInfoSeleccionada(prev => ({
      ...prev,
      [name]: name === 'precio_unitario' || name === 'cantidad' || name === 'talla' || name === 'id_calzados'
        ? value === '' ? '' : Number(value)
        : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBusqueda = e => {
    setBusqueda(e.target.value);
  };

  const abrirModalEditar = (info) => {
    setInfoSeleccionada({
      ...info,
      id_calzados: info.id_calzados || info.id_calzado
    });
    setModalEditar(true);
    setErrors({});
  };

  const abrirModalEliminar = (info) => {
    setInfoSeleccionada(info);
    setModalEliminar(true);
  };

  const editar = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/info_calzado/${infoSeleccionada.id_info_calzado}`,
        infoSeleccionada
      );
      await obtenerInfo();
      setModalEditar(false);
    } catch (error) {
      console.error('Error al editar:', error);
      alert('Error al actualizar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminar = async () => {
    setIsSubmitting(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/info_calzado/${infoSeleccionada.id_info_calzado}`
      );
      await obtenerInfo();
      setModalEliminar(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertar = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/info_calzado`,
        infoSeleccionada
      );
      await obtenerInfo();
      setModalEditar(false);
    } catch (error) {
      console.error('Error al insertar:', error);
      alert('Error al crear el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultadosFiltrados = data.filter(i =>
    i.material?.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.color?.toLowerCase().includes(busqueda.toLowerCase()) ||
    (i.id_calzados?.toString().includes(busqueda)) ||
    (i.id_info_calzado?.toString().includes(busqueda))
  );

  const irAlModuloAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Información de Calzado</h2>
        <button className="btn btn-secondary" onClick={irAlModuloAdmin}>
          ← Volver al Módulo Admin
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <input
            className="form-control"
            type="text"
            placeholder="Buscar por ID, material, descripción, color o ID de calzado"
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setInfoSeleccionada({
                id_info_calzado: '',
                material: '',
                talla: '',
                color: '',
                descripcion: '',
                precio_unitario: '',
                id_calzados: '',
                cantidad: ''
              });
              setModalEditar(true);
              setErrors({});
            }}
          >
            + Agregar Info Calzado
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>ID Calzado</th>
              <th>Material</th>
              <th>Talla</th>
              <th>Color</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map(info => (
              <tr key={info.id_info_calzado}>
                <td>{info.id_info_calzado}</td>
                <td>{info.id_calzados || info.id_calzado}</td>
                <td>{info.material}</td>
                <td>{info.talla}</td>
                <td>{info.color}</td>
                <td>{info.descripcion || '-'}</td>
                <td>${info.precio_unitario?.toLocaleString()}</td>
                <td>{info.cantidad_variante || info.cantidad}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => abrirModalEditar(info)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => abrirModalEliminar(info)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resultadosFiltrados.length === 0 && (
          <div className="alert alert-info text-center">
            No se encontraron resultados
          </div>
        )}
      </div>

      {/* Modal Editar/Insertar */}
      <Modal isOpen={modalEditar} toggle={() => !isSubmitting && setModalEditar(false)}>
        <ModalHeader toggle={() => !isSubmitting && setModalEditar(false)}>
          {infoSeleccionada.id_info_calzado ? 'Editar Info Calzado' : 'Agregar Info Calzado'}
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label className="form-label">ID del Calzado</label>
            {infoSeleccionada.id_info_calzado ? (
              <input
                type="number"
                className="form-control"
                value={infoSeleccionada.id_calzados}
                readOnly
                disabled
              />
            ) : (
              <>
                <input
                  type="number"
                  className={`form-control ${errors.id_calzados ? 'is-invalid' : ''}`}
                  name="id_calzados"
                  placeholder="Ingrese el ID del calzado"
                  value={infoSeleccionada.id_calzados}
                  onChange={handleChange}
                  min="1"
                />
                {errors.id_calzados && <div className="invalid-feedback">{errors.id_calzados}</div>}
              </>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Material *</label>
            <input
              type="text"
              className={`form-control ${errors.material ? 'is-invalid' : ''}`}
              name="material"
              placeholder="Ej: Cuero, Tela, Sintético"
              value={infoSeleccionada.material}
              onChange={handleChange}
            />
            {errors.material && <div className="invalid-feedback">{errors.material}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Talla *</label>
              <input
                type="number"
                className={`form-control ${errors.talla ? 'is-invalid' : ''}`}
                name="talla"
                placeholder="Ej: 38, 40, 42"
                value={infoSeleccionada.talla}
                onChange={handleChange}
                min="1"
                step="0.5"
              />
              {errors.talla && <div className="invalid-feedback">{errors.talla}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Color *</label>
              <input
                type="text"
                className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                name="color"
                placeholder="Ej: Negro, Azul, Rojo"
                value={infoSeleccionada.color}
                onChange={handleChange}
              />
              {errors.color && <div className="invalid-feedback">{errors.color}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="descripcion"
              placeholder="Descripción adicional (opcional)"
              value={infoSeleccionada.descripcion}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Unitario *</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.precio_unitario ? 'is-invalid' : ''}`}
                  name="precio_unitario"
                  placeholder="Ej: 59900"
                  value={infoSeleccionada.precio_unitario}
                  onChange={handleChange}
                  min="1"
                  step="100"
                />
                {errors.precio_unitario && <div className="invalid-feedback">{errors.precio_unitario}</div>}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Cantidad en Stock *</label>
              <input
                type="number"
                className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                name="cantidad"
                placeholder="Ej: 10"
                value={infoSeleccionada.cantidad}
                onChange={handleChange}
                min="0"
              />
              {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
            </div>
          </div>
          <div className="text-muted">* Campos obligatorios</div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={infoSeleccionada.id_info_calzado ? editar : insertar}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' :
              (infoSeleccionada.id_info_calzado ? 'Guardar Cambios' : 'Agregar')}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalEditar(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={modalEliminar} toggle={() => !isSubmitting && setModalEliminar(false)}>
        <ModalHeader toggle={() => !isSubmitting && setModalEliminar(false)}>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          ¿Está seguro que desea eliminar esta información de calzado?
          <div className="alert alert-warning mt-3">
            <strong>ID:</strong> {infoSeleccionada.id_info_calzado}<br />
            <strong>Material:</strong> {infoSeleccionada.material}<br />
            <strong>Talla:</strong> {infoSeleccionada.talla}<br />
            <strong>Color:</strong> {infoSeleccionada.color}
          </div>
          Esta acción no se puede deshacer.
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-danger"
            onClick={eliminar}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Eliminando...' : 'Confirmar Eliminación'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalEliminar(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default InfoCalzadoCrud;
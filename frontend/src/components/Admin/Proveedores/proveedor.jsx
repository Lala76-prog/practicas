import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {
  const [data, setData] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState({
    id_proveedor: '',
    nombre_proveedor: '',
    telefono: '',
    correo: '',
    productos_calzado: '',
    valor_unitario: '',
    total: '',
    cantidad: '',
    direccion: '',
    metodo_pago: '',
    fecha_ultima_compra: '',
    notas: ''
  });
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre_proveedor: '',
    telefono: '',
    correo: '',
    productos_calzado: '',
    valor_unitario: '',
    cantidad: '',
    direccion: '',
    metodo_pago: '',
    notas: ''
  });

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/proveedor`);
      setData(res.data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const seleccionarProveedor = (proveedor, caso) => {
    setProveedorSeleccionado(proveedor);
    if (caso === 'Editar') {
      setModalEditar(true);
    } else {
      setModalEliminar(true);
    }
  };

  const handleEditarInputChange = (e) => {
    const { name, value } = e.target;
    setProveedorSeleccionado({
      ...proveedorSeleccionado,
      [name]: value
    });
  };

  const editarProveedor = async () => {
    try {
      // Calcular total automáticamente
      const total = proveedorSeleccionado.valor_unitario * proveedorSeleccionado.cantidad;

      await axios.put(`${process.env.REACT_APP_API_URL}/api/proveedor/${proveedorSeleccionado.id_proveedor}`, {
        ...proveedorSeleccionado,
        total: total
      });
      obtenerProveedores();
      setModalEditar(false);
    } catch (err) {
      console.error('Error al editar proveedor:', err);
    }
  };

  const eliminar = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/proveedor/${proveedorSeleccionado.id_proveedor}`);
      obtenerProveedores();
      setModalEliminar(false);
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
    }
  };

  const agregarProveedor = async () => {
    try {
      // Calcular total automáticamente
      const total = nuevoProveedor.valor_unitario * nuevoProveedor.cantidad;

      await axios.post(`${process.env.REACT_APP_API_URL}/api/proveedor`, {
        ...nuevoProveedor,
        total: total
      });
      obtenerProveedores();
      setModalAgregar(false);
      setNuevoProveedor({
        nombre_proveedor: '',
        telefono: '',
        correo: '',
        productos_calzado: '',
        valor_unitario: '',
        cantidad: '',
        direccion: '',
        metodo_pago: '',
        notas: ''
      });
    } catch (err) {
      console.error('Error al agregar proveedor:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor({
      ...nuevoProveedor,
      [name]: value
    });
  };

  const irAlModuloAdmin = () => {
    window.location.href = '/admin';
  };

  const handleBusqueda = e => {
    setBusqueda(e.target.value);
  };

  const resultadosFiltrados = data.filter(p =>
    p.nombre_proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id_proveedor.toString().includes(busqueda) ||
    p.telefono.toString().includes(busqueda) ||
    p.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };

  return (
    <div className="App">
      <div className="categoria-header">
        <h2>Proveedores</h2>
        <button className="btn-atras" onClick={irAlModuloAdmin}>← Volver al Módulo Admin</button>
      </div>

      <div className="search-container mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Buscar por ID, Nombre, Teléfono o Correo"
          value={busqueda}
          onChange={handleBusqueda}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={() => setModalAgregar(true)}
        >
          <i className="fas fa-plus"></i> Agregar Proveedor
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Producto</th>
              <th>Valor Unitario</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Dirección</th>
              <th>Método Pago</th>
              <th>Última Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map((p) => (
              <tr key={p.id_proveedor}>
                <td>{p.id_proveedor}</td>
                <td>{p.nombre_proveedor}</td>
                <td>{p.telefono || '-'}</td>
                <td>{p.correo || '-'}</td>
                <td>{p.productos_calzado || '-'}</td>
                <td>${p.valor_unitario ? Number(p.valor_unitario).toLocaleString() : '0'}</td>
                <td>{p.cantidad || '0'}</td>
                <td>${p.total ? Number(p.total).toLocaleString() : '0'}</td>
                <td>{p.direccion?.substring(0, 20)}{p.direccion?.length > 20 ? '...' : ''}</td>
                <td>{p.metodo_pago || '-'}</td>
                <td>{formatearFecha(p.fecha_ultima_compra)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => seleccionarProveedor(p, 'Editar')}
                    title="Editar proveedor"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => seleccionarProveedor(p, 'Eliminar')}
                    title="Eliminar proveedor"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Eliminar */}
      <Modal isOpen={modalEliminar} toggle={() => setModalEliminar(false)}>
        <ModalHeader toggle={() => setModalEliminar(false)}>Confirmar Eliminación</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que deseas eliminar al proveedor <strong>{proveedorSeleccionado.nombre_proveedor}</strong> (ID: {proveedorSeleccionado.id_proveedor})?
          <br /><br />
          <small className="text-muted">Esta acción no se puede deshacer.</small>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={eliminar}>
            <i className="fas fa-check"></i> Confirmar
          </button>
          <button className="btn btn-secondary" onClick={() => setModalEliminar(false)}>
            <i className="fas fa-times"></i> Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Agregar Proveedor */}
      <Modal isOpen={modalAgregar} toggle={() => setModalAgregar(false)} size="lg">
        <ModalHeader toggle={() => setModalAgregar(false)}>Agregar Nuevo Proveedor</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre del Proveedor *</label>
            <input
              type="text"
              className="form-control"
              name="nombre_proveedor"
              value={nuevoProveedor.nombre_proveedor}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={nuevoProveedor.telefono}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={nuevoProveedor.correo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Productos de Calzado</label>
            <input
              type="text"
              className="form-control"
              name="productos_calzado"
              value={nuevoProveedor.productos_calzado}
              onChange={handleInputChange}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Valor Unitario</label>
                <input
                  type="number"
                  className="form-control"
                  name="valor_unitario"
                  value={nuevoProveedor.valor_unitario}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  name="cantidad"
                  value={nuevoProveedor.cantidad}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={nuevoProveedor.direccion}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Método de Pago</label>
            <select
              className="form-control"
              name="metodo_pago"
              value={nuevoProveedor.metodo_pago}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notas</label>
            <textarea
              className="form-control"
              name="notas"
              value={nuevoProveedor.notas}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={agregarProveedor}>
            <i className="fas fa-save"></i> Guardar
          </button>
          <button className="btn btn-secondary" onClick={() => setModalAgregar(false)}>
            <i className="fas fa-times"></i> Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/* Modal Editar Proveedor */}
      <Modal isOpen={modalEditar} toggle={() => setModalEditar(false)} size="lg">
        <ModalHeader toggle={() => setModalEditar(false)}>Editar Proveedor</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre del Proveedor *</label>
            <input
              type="text"
              className="form-control"
              name="nombre_proveedor"
              value={proveedorSeleccionado.nombre_proveedor}
              onChange={handleEditarInputChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={proveedorSeleccionado.telefono}
                  onChange={handleEditarInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={proveedorSeleccionado.correo}
                  onChange={handleEditarInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Productos de Calzado</label>
            <input
              type="text"
              className="form-control"
              name="productos_calzado"
              value={proveedorSeleccionado.productos_calzado}
              onChange={handleEditarInputChange}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Valor Unitario</label>
                <input
                  type="number"
                  className="form-control"
                  name="valor_unitario"
                  value={proveedorSeleccionado.valor_unitario}
                  onChange={handleEditarInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  name="cantidad"
                  value={proveedorSeleccionado.cantidad}
                  onChange={handleEditarInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Total: ${proveedorSeleccionado.valor_unitario * proveedorSeleccionado.cantidad}</label>
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={proveedorSeleccionado.direccion}
              onChange={handleEditarInputChange}
            />
          </div>
          <div className="form-group">
            <label>Método de Pago</label>
            <select
              className="form-control"
              name="metodo_pago"
              value={proveedorSeleccionado.metodo_pago}
              onChange={handleEditarInputChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notas</label>
            <textarea
              className="form-control"
              name="notas"
              value={proveedorSeleccionado.notas}
              onChange={handleEditarInputChange}
              rows="3"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={editarProveedor}>
            <i className="fas fa-save"></i> Guardar Cambios
          </button>
          <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
            <i className="fas fa-times"></i> Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
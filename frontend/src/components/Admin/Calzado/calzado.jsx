import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Modal, ModalBody, ModalFooter, ModalHeader,
  Button, Form, FormGroup, Label, Input, Alert,
  Card, CardBody, CardHeader, Badge
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faImage,
  faSave, faTimes, faExclamationTriangle,
  faCheck, faArrowLeft, faSearch, faShoePrints,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [alerta, setAlerta] = useState({ mostrar: false, tipo: '', mensaje: '' });
  const [calzadoSeleccionado, setCalzadoSeleccionado] = useState({
    id_calzado: '',
    estado: 'Disponible',
    nombre: '',
    id_categoria: '',
    id_proveedor: '',
    cantidad: '',
    imagen: null,
    imagenNombre: ''
  });
  const [mostrarInfoProveedor, setMostrarInfoProveedor] = useState(false);
  const [proveedorInfo, setProveedorInfo] = useState(null);

  // Obtener datos iniciales
  const obtenerDatosIniciales = async () => {
    try {
      // Obtener proveedores
      const proveedoresRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/proveedor`);
      setProveedores(proveedoresRes.data);

      // Obtener categorías
      const categoriasRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/categoria`);
      setCategorias(categoriasRes.data);

      // Obtener calzados
      const calzadosRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/calzado`);

      // Mejorar los datos de calzados incluyendo nombres de categoría y proveedor
      const calzadosMejorados = calzadosRes.data.map(calzado => {
        const categoria = categoriasRes.data.find(cat => cat.id_categoria === calzado.id_categoria);
        const proveedor = proveedoresRes.data.find(prov => prov.id_proveedor === calzado.id_proveedor);

        return {
          ...calzado,
          categoria_nombre: categoria ? categoria.nombre_categoria : 'Sin categoría',
          proveedor_nombre: proveedor ? proveedor.nombre_proveedor : 'Sin proveedor',
          categoria_info: categoria,
          proveedor_info: proveedor
        };
      });

      setData(calzadosMejorados);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      mostrarAlerta('danger', 'Error al cargar los datos. Verifica la consola para más detalles.');
    }
  };

  useEffect(() => {
    obtenerDatosIniciales();
  }, []);

  // Mostrar alerta
  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ mostrar: true, tipo, mensaje });
    setTimeout(() => setAlerta({ mostrar: false, tipo: '', mensaje: '' }), 5000);
  };

  // Manejar cambios en los inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setCalzadoSeleccionado(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de imagen
  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setCalzadoSeleccionado(prev => ({
        ...prev,
        imagen: e.target.files[0],
        imagenNombre: e.target.files[0].name
      }));
    }
  };

  // Obtener URL de la imagen
  const getImageUrl = (image) => {
    if (!image) return null;

    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
  };

  // Validar campos requeridos
  const validarCampos = () => {
    if (!calzadoSeleccionado.nombre) {
      mostrarAlerta('warning', 'El nombre del calzado es requerido');
      return false;
    }

    if (!calzadoSeleccionado.id_proveedor) {
      mostrarAlerta('warning', 'Debe seleccionar un proveedor');
      return false;
    }

    if (!calzadoSeleccionado.id_categoria) {
      mostrarAlerta('warning', 'Debe seleccionar una categoría');
      return false;
    }

    if (!calzadoSeleccionado.cantidad || isNaN(calzadoSeleccionado.cantidad)) {
      mostrarAlerta('warning', 'La cantidad debe ser un número válido');
      return false;
    }

    return true;
  };

  // Mostrar información del proveedor
  const mostrarInfoProveedorHandler = (proveedor) => {
    setProveedorInfo(proveedor);
    setMostrarInfoProveedor(true);
  };

  // Insertar calzado
  const insertar = async () => {
    if (!validarCampos()) return;

    try {
      const formData = new FormData();
      formData.append('estado', calzadoSeleccionado.estado);
      formData.append('nombre', calzadoSeleccionado.nombre);
      formData.append('id_categoria', calzadoSeleccionado.id_categoria);
      formData.append('id_proveedor', calzadoSeleccionado.id_proveedor);
      formData.append('cantidad', calzadoSeleccionado.cantidad);

      if (calzadoSeleccionado.imagen) {
        formData.append('imagen', calzadoSeleccionado.imagen);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/calzado`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      obtenerDatosIniciales();
      setModalInsertar(false);
      setCalzadoSeleccionado({
        id_calzado: '',
        estado: 'Disponible',
        nombre: '',
        id_categoria: '',
        id_proveedor: '',
        cantidad: '',
        imagen: null,
        imagenNombre: ''
      });
      mostrarAlerta('success', 'Calzado insertado correctamente');
    } catch (err) {
      console.error('Error al insertar calzado:', err);
      mostrarAlerta('danger', 'Error al insertar calzado. Verifica la consola para más detalles.');
    }
  };

  // Editar calzado
  const editar = async () => {
    if (!validarCampos()) return;

    try {
      const formData = new FormData();
      formData.append('estado', calzadoSeleccionado.estado);
      formData.append('nombre', calzadoSeleccionado.nombre);
      formData.append('id_categoria', calzadoSeleccionado.id_categoria);
      formData.append('id_proveedor', calzadoSeleccionado.id_proveedor);
      formData.append('cantidad', calzadoSeleccionado.cantidad);

      if (calzadoSeleccionado.imagen instanceof File) {
        formData.append('imagen', calzadoSeleccionado.imagen);
      } else if (calzadoSeleccionado.imagen === null) {
        formData.append('removeImage', 'true');
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/calzado/${calzadoSeleccionado.id_calzado}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      obtenerDatosIniciales();
      setModalEditar(false);
      mostrarAlerta('success', 'Calzado actualizado correctamente');
    } catch (err) {
      console.error('Error al editar calzado:', err);
      mostrarAlerta('danger', 'Error al editar calzado. Verifica la consola para más detalles.');
    }
  };

  // Eliminar calzado
  const eliminar = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/calzado/${calzadoSeleccionado.id_calzado}`);
      obtenerDatosIniciales();
      setModalEliminar(false);
      mostrarAlerta('success', 'Calzado eliminado correctamente');
    } catch (err) {
      console.error('Error al eliminar calzado:', err);
      mostrarAlerta('danger', 'Error al eliminar calzado. Verifica la consola para más detalles.');
    }
  };

  // Seleccionar calzado para editar/eliminar
  const seleccionarCalzado = (calzado, tipo) => {
    setCalzadoSeleccionado({
      ...calzado,
      imagen: calzado.imagen ? calzado.imagen : null,
      imagenNombre: calzado.imagen ? calzado.imagen.split('/').pop() : ''
    });

    if (tipo === 'Editar') setModalEditar(true);
    else if (tipo === 'Eliminar') setModalEliminar(true);
  };

  // Manejar búsqueda
  const handleBusqueda = e => setBusqueda(e.target.value);

  // Filtrar resultados
  const resultadosFiltrados = data.filter(c =>
    c.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.id_calzado.toString().includes(busqueda) ||
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.categoria_nombre && c.categoria_nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    (c.proveedor_nombre && c.proveedor_nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    c.cantidad.toString().includes(busqueda)
  );

  // Ir al módulo admin
  const irAlModuloAdmin = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <header className="bg-dark text-white p-4 shadow-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faShoePrints} className="me-3" size="2x" />
              <h1 className="m-0">Gestión de Calzados</h1>
            </div>
            <button className="btn btn-outline-light" onClick={irAlModuloAdmin}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Volver al Admin
            </button>
          </div>
        </div>
      </header>

      <div className="container py-4">
        {/* Alertas */}
        {alerta.mostrar && (
          <Alert color={alerta.tipo} className="mt-3 animate__animated animate__fadeIn">
            {alerta.mensaje}
          </Alert>
        )}

        {/* Card de búsqueda y acciones */}
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <button
                className="btn btn-success mb-2 mb-md-0"
                onClick={() => setModalInsertar(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Calzado
              </button>

              <div className="search-box" style={{ width: '400px', maxWidth: '100%' }}>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Buscar calzados..."
                    value={busqueda}
                    onChange={handleBusqueda}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabla de calzados */}
        <Card className="shadow-sm">
          <CardHeader className="bg-white border-bottom-0">
            <h5 className="m-0">Listado de Calzados</h5>
          </CardHeader>
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Proveedor</th>
                  <th>Cantidad</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultadosFiltrados.length > 0 ? (
                  resultadosFiltrados.map((c) => (
                    <tr key={c.id_calzado}>
                      <td>{c.id_calzado}</td>
                      <td>
                        <Badge
                          color={
                            c.estado === 'Disponible' ? 'success' :
                            c.estado === 'Agotado' ? 'warning' : 'secondary'
                          }
                          pill
                          className="px-3 py-1"
                        >
                          {c.estado}
                        </Badge>
                      </td>
                      <td className="fw-bold">{c.nombre}</td>
                      <td>{c.categoria_nombre}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span>{c.proveedor_nombre}</span>
                          {c.proveedor_info && (
                            <Button
                              color="link"
                              size="sm"
                              className="text-info p-0 ms-2"
                              onClick={() => mostrarInfoProveedorHandler(c.proveedor_info)}
                              title="Ver info del proveedor"
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${c.cantidad > 0 ? 'bg-info' : 'bg-danger'}`}>
                          {c.cantidad}
                        </span>
                      </td>
                      <td>
                        {c.imagen ? (
                          <img
                            src={getImageUrl(c.imagen)}
                            alt={c.nombre}
                            className="img-thumbnail rounded"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('Error loading image:', e.target.src);
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="no-image-placeholder bg-light rounded d-flex align-items-center justify-content-center"
                               style={{ width: '60px', height: '60px' }}>
                            <FontAwesomeIcon icon={faImage} size="lg" className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => seleccionarCalzado(c, 'Editar')}
                            title="Editar"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => seleccionarCalzado(c, 'Eliminar')}
                            title="Eliminar"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="text-muted">
                        No se encontraron calzados
                        {busqueda && ` que coincidan con "${busqueda}"`}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Insertar */}
      <Modal isOpen={modalInsertar} toggle={() => setModalInsertar(!modalInsertar)} size="lg" centered>
        <ModalHeader toggle={() => setModalInsertar(!modalInsertar)} className="bg-light">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Calzado
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label>Nombre*</Label>
                  <Input
                    type="text"
                    name="nombre"
                    value={calzadoSeleccionado.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Zapatos deportivos"
                    className="mb-3"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Categoría*</Label>
                  <Input
                    type="select"
                    name="id_categoria"
                    value={calzadoSeleccionado.id_categoria}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>Proveedor*</Label>
                  <Input
                    type="select"
                    name="id_proveedor"
                    value={calzadoSeleccionado.id_proveedor}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map(prov => (
                      <option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.nombre_proveedor}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>

              <div className="col-md-6">
                <FormGroup>
                  <Label>Estado*</Label>
                  <Input
                    type="select"
                    name="estado"
                    value={calzadoSeleccionado.estado}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Descontinuado">Descontinuado</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>Cantidad*</Label>
                  <Input
                    type="number"
                    name="cantidad"
                    value={calzadoSeleccionado.cantidad}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Ej. 50"
                    className="mb-3"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Imagen</Label>
                  <div className="border rounded p-3">
                    <Input
                      type="file"
                      name="imagen"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="mb-2"
                    />
                    {calzadoSeleccionado.imagenNombre && (
                      <small className="text-muted d-block">
                        Archivo seleccionado: {calzadoSeleccionado.imagenNombre}
                      </small>
                    )}
                    <small className="text-muted">Formatos: JPG, PNG, GIF (Máx. 2MB)</small>
                  </div>
                </FormGroup>
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="success" onClick={insertar} className="px-4">
            <FontAwesomeIcon icon={faSave} className="me-2" /> Guardar
          </Button>
          <Button color="secondary" onClick={() => {
            setModalInsertar(false);
            setCalzadoSeleccionado({
              id_calzado: '',
              estado: 'Disponible',
              nombre: '',
              id_categoria: '',
              id_proveedor: '',
              cantidad: '',
              imagen: null,
              imagenNombre: ''
            });
          }} className="px-4">
            <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={modalEditar} toggle={() => setModalEditar(!modalEditar)} size="lg" centered>
        <ModalHeader toggle={() => setModalEditar(!modalEditar)} className="bg-light">
          <FontAwesomeIcon icon={faEdit} className="me-2" /> Editar Calzado
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label>Nombre*</Label>
                  <Input
                    type="text"
                    name="nombre"
                    value={calzadoSeleccionado.nombre || ''}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Categoría*</Label>
                  <Input
                    type="select"
                    name="id_categoria"
                    value={calzadoSeleccionado.id_categoria || ''}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>Proveedor*</Label>
                  <Input
                    type="select"
                    name="id_proveedor"
                    value={calzadoSeleccionado.id_proveedor || ''}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map(prov => (
                      <option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.nombre_proveedor}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>

              <div className="col-md-6">
                <FormGroup>
                  <Label>Estado*</Label>
                  <Input
                    type="select"
                    name="estado"
                    value={calzadoSeleccionado.estado || 'Disponible'}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Descontinuado">Descontinuado</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>Cantidad*</Label>
                  <Input
                    type="number"
                    name="cantidad"
                    value={calzadoSeleccionado.cantidad || ''}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mb-3"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Imagen</Label>
                  <div className="border rounded p-3">
                    <Input
                      type="file"
                      name="imagen"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="mb-3"
                    />

                    <div className="d-flex align-items-center">
                      {calzadoSeleccionado.imagen ? (
                        <>
                          <img
                            src={getImageUrl(calzadoSeleccionado.imagen)}
                            alt="Actual"
                            className="img-thumbnail me-3"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('Error loading image in modal:', e.target.src);
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                          <div>
                            <p className="mb-1 small">
                              {calzadoSeleccionado.imagen instanceof File ?
                                calzadoSeleccionado.imagenNombre :
                                calzadoSeleccionado.imagen.split('/').pop()}
                            </p>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => setCalzadoSeleccionado(prev => ({
                                ...prev,
                                imagen: null,
                                imagenNombre: ''
                              }))}
                            >
                              <FontAwesomeIcon icon={faTrash} className="me-1" /> Eliminar
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-muted small">
                          No hay imagen seleccionada
                        </div>
                      )}
                    </div>
                  </div>
                </FormGroup>
              </div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="warning" onClick={editar} className="px-4">
            <FontAwesomeIcon icon={faSave} className="me-2" /> Guardar Cambios
          </Button>
          <Button color="secondary" onClick={() => setModalEditar(false)} className="px-4">
            <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={modalEliminar} toggle={() => setModalEliminar(!modalEliminar)} centered>
        <ModalHeader toggle={() => setModalEliminar(!modalEliminar)} className="bg-light">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-danger" /> Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          <div className="alert alert-danger">
            <h5 className="alert-heading">¿Eliminar este calzado?</h5>
            <hr />
            <div className="mb-3">
              <div><strong>ID:</strong> {calzadoSeleccionado.id_calzado}</div>
              <div><strong>Nombre:</strong> {calzadoSeleccionado.nombre}</div>
              <div><strong>Estado:</strong> {calzadoSeleccionado.estado}</div>
            </div>
            <p className="mb-0 small">Esta acción no se puede deshacer y eliminará permanentemente el registro.</p>
          </div>
        </ModalBody>
        <ModalFooter className="bg-light">
          <Button color="danger" onClick={eliminar} className="px-4">
            <FontAwesomeIcon icon={faCheck} className="me-2" /> Confirmar
          </Button>
          <Button color="secondary" onClick={() => setModalEliminar(false)} className="px-4">
            <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Info Proveedor */}
      <Modal isOpen={mostrarInfoProveedor} toggle={() => setMostrarInfoProveedor(!mostrarInfoProveedor)}>
        <ModalHeader toggle={() => setMostrarInfoProveedor(!mostrarInfoProveedor)}>
          Información del Proveedor
        </ModalHeader>
        <ModalBody>
          {proveedorInfo && (
            <div>
              <p><strong>ID:</strong> {proveedorInfo.id_proveedor}</p>
              <p><strong>Nombre:</strong> {proveedorInfo.nombre_proveedor}</p>
              <p><strong>Teléfono:</strong> {proveedorInfo.telefono || 'No especificado'}</p>
              <p><strong>Correo:</strong> {proveedorInfo.correo || 'No especificado'}</p>
              <p><strong>Productos:</strong> {proveedorInfo.productos_calzado || 'No especificado'}</p>
              <p><strong>Valor Unitario:</strong> {proveedorInfo.valor_unitario || 'No especificado'}</p>
              <p><strong>Total:</strong> {proveedorInfo.total || 'No especificado'}</p>
              <p><strong>Cantidad:</strong> {proveedorInfo.cantidad || 'No especificado'}</p>
              <p><strong>Dirección:</strong> {proveedorInfo.direccion || 'No especificado'}</p>
              <p><strong>Método de Pago:</strong> {proveedorInfo.metodo_pago || 'No especificado'}</p>
              <p><strong>Última Compra:</strong> {proveedorInfo.fecha_ultima_compra || 'No especificado'}</p>
              <p><strong>Notas:</strong> {proveedorInfo.notas || 'No especificado'}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setMostrarInfoProveedor(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaShoePrints, FaBoxes, FaTags, FaChartBar, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Admin.css";

Chart.register(...registerables);

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const API_ENDPOINTS = {
  usuarios: `${API_BASE_URL}/usuarios`,
  calzado: `${API_BASE_URL}/calzado`,
  proveedor: `${API_BASE_URL}/proveedor`,
  categoria: `${API_BASE_URL}/categoria`,
  info_calzado: `${API_BASE_URL}/info_calzado`,
  roles: `${API_BASE_URL}/roles`
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCrudButtons, setShowCrudButtons] = useState(false);
  const [data, setData] = useState({
    users: [],
    shoes: [],
    suppliers: [],
    categories: [],
    sales: [],
    roles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApiData = async (endpointKey) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const endpoint = API_ENDPOINTS[endpointKey];
      if (!endpoint) {
        throw new Error(`Endpoint not configured for ${endpointKey}`);
      }

      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Verifica si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        return Array.isArray(result) ? result : [result];
      } else {
        const text = await response.text(); // Lee como texto
        throw new Error(`Unexpected response format: ${text}`);
      }
    } catch (error) {
      console.error(`Error fetching ${endpointKey}:`, error);
      setError(error.message);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [
          usersData,
          shoesData,
          suppliersData,
          categoriesData,
          salesData,
          rolesData
        ] = await Promise.all([
          fetchApiData("usuarios"),
          fetchApiData("calzado"),
          fetchApiData("proveedor"),
          fetchApiData("categoria"),
          fetchApiData("info_calzado"),
          fetchApiData("roles")
        ]);

        setData({
          users: usersData,
          shoes: shoesData,
          suppliers: suppliersData,
          categories: categoriesData,
          sales: salesData,
          roles: rolesData
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message || "Error al cargar los datos. Intente recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCrudButtons = () => {
    setShowCrudButtons(!showCrudButtons);
  };

  const getSupplierQuantityData = () => {
    const suppliersWithQuantity = data.suppliers.map(supplier => {
      const shoesFromSupplier = data.shoes.filter(shoe => shoe.id_proveedor === supplier.id_proveedor);
      const totalQuantity = shoesFromSupplier.reduce((sum, shoe) => sum + (shoe.cantidad || 0), 0);
      return {
        ...supplier,
        totalQuantity
      };
    });

    const sortedSuppliers = [...suppliersWithQuantity].sort((a, b) => b.totalQuantity - a.totalQuantity);

    return {
      labels: sortedSuppliers.map(supplier => supplier.nombre_proveedor),
      datasets: [{
        label: "Cantidad Total Proveída",
        data: sortedSuppliers.map(supplier => supplier.totalQuantity),
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
      }]
    };
  };

  const shoesChartData = {
    labels: data.shoes.slice(0, 10).map(shoe => shoe.nombre),
    datasets: [
      {
        label: "Disponibilidad",
        data: data.shoes.slice(0, 10).map(shoe => shoe.cantidad),
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
      }
    ]
  };

  const categoriesChartData = {
    labels: data.categories.map(category => category.nombre_categoria),
    datasets: [
      {
        label: "Productos por Categoría",
        data: data.categories.map(category =>
          data.shoes.filter(shoe => shoe.id_categoria === category.id_categoria).length
        ),
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf", "#dda20a", "#be2617"],
      }
    ]
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>Sichf Admin</h3>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <FaChartBar className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeView === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveView("usuarios")}
          >
            <FaUsers className="nav-icon" />
            <span>Usuarios</span>
          </button>
          <button
            className={`nav-item ${activeView === "calzado" ? "active" : ""}`}
            onClick={() => setActiveView("calzado")}
          >
            <FaShoePrints className="nav-icon" />
            <span>Calzado</span>
          </button>
          <button
            className={`nav-item ${activeView === "proveedor" ? "active" : ""}`}
            onClick={() => setActiveView("proveedor")}
          >
            <FaBoxes className="nav-icon" />
            <span>Proveedores</span>
          </button>
          <button
            className={`nav-item ${activeView === "categoria" ? "active" : ""}`}
            onClick={() => setActiveView("categoria")}
          >
            <FaTags className="nav-icon" />
            <span>Categorías</span>
          </button>
        </nav>
        <button className="crud-toggle sidebar-crud-toggle" onClick={toggleCrudButtons}>
          {showCrudButtons ? "Ocultar CRUD" : "Mostrar CRUD"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>Panel de Administración</h1>
        </header>

        {showCrudButtons && (
          <div className="crud-buttons">
            <button className="admin-button" onClick={() => handleNavigation("/admin/proveedor")}>
              Proveedores CRUD
            </button>
            <button className="admin-button" onClick={() => handleNavigation("/admin/calzado")}>
              Calzado CRUD
            </button>
            <button className="admin-button" onClick={() => handleNavigation("/admin/info_calzado")}>
              Info Calzado CRUD
            </button>
          </div>
        )}

        <div className="content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Recargar</button>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              {activeView === "dashboard" && (
                <div className="dashboard-view">
                  <h2>Resumen General</h2>
                  <div className="cards-container">
                    <div className="stat-card">
                      <h3>Total Usuarios</h3>
                      <p>{data.users.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Total Productos</h3>
                      <p>{data.shoes.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Total Proveedores</h3>
                      <p>{data.suppliers.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Categorías</h3>
                      <p>{data.categories.length}</p>
                    </div>
                  </div>

                  <div className="charts-container">
                    <div className="chart-card">
                      <h3>Disponibilidad de Calzado (Top 10)</h3>
                      <div className="chart-wrapper">
                        <Bar
                          data={shoesChartData}
                          options={{
                            indexAxis: 'y',
                          }}
                        />
                      </div>
                    </div>
                    <div className="chart-card">
                      <h3>Productos por Categoría</h3>
                      <div className="chart-wrapper">
                        <Bar data={categoriesChartData} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === "usuarios" && (
                <div className="table-view">
                  <h2>Usuarios Registrados</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Correo</th>
                        <th>ID Rol</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map(user => (
                        <tr key={user.id_usu}>
                          <td>{user.id_usu}</td>
                          <td>{user.correo}</td>
                          <td>{user.id_rol}</td>
                          <td>{user.estado || 'Activo'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === "calzado" && (
                <div className="table-view">
                  <h2>Inventario de Calzado</h2>
                  <div className="chart-wrapper">
                    <Bar
                      data={shoesChartData}
                      options={{
                        indexAxis: 'y',
                      }}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.shoes.map(shoe => (
                        <tr key={shoe.id_calzado}>
                          <td>{shoe.id_calzado}</td>
                          <td>{shoe.nombre}</td>
                          <td>
                            {data.categories.find(cat => cat.id_categoria === shoe.id_categoria)?.nombre_categoria || 'N/A'}
                          </td>
                          <td>{shoe.cantidad}</td>
                          <td>{shoe.estado || 'Disponible'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === "proveedor" && (
                <div className="table-view">
                  <h2>Proveedores</h2>
                  <div className="chart-wrapper">
                    <Bar
                      data={getSupplierQuantityData()}
                      options={{
                        indexAxis: 'y',
                      }}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Dirección</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.suppliers.map(supplier => (
                        <tr key={supplier.id_proveedor}>
                          <td>{supplier.id_proveedor}</td>
                          <td>{supplier.nombre_proveedor}</td>
                          <td>{supplier.telefono || 'N/A'}</td>
                          <td>{supplier.correo || 'N/A'}</td>
                          <td>{supplier.direccion || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === "categoria" && (
                <div className="table-view">
                  <h2>Categorías</h2>
                  <div className="chart-wrapper">
                    <Pie
                      data={categoriesChartData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        }
                      }}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.categories.map(category => (
                        <tr key={category.id_categoria}>
                          <td>{category.id_categoria}</td>
                          <td>{category.nombre_categoria}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

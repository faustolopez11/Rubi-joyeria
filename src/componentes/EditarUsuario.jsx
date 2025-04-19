import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditarUsuario = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState(""); // Nueva contraseña opcional
    const [rol, setRol] = useState("2");

    useEffect(() => {
        fetchUsuario();
    }, []);

    const fetchUsuario = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/usuarios/${id}`);
            if (response.data) {
                const usuario = response.data;

                console.log("🟢 Usuario cargado:", usuario); // Debug: Ver qué datos recibe

                setNombre(usuario.Nombre);
                setCorreo(usuario.Correo);
                setRol(usuario.IDRol ? usuario.IDRol.toString() : "2");
            } else {
                alert("Usuario no encontrado");
                navigate("/usuarios");
            }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            alert("Error al obtener usuario");
            navigate("/usuarios");
        }
    };

    
    const handleUpdateUser = async (e) => {
        e.preventDefault();
    
        if (!nombre || !correo) {
            alert("El nombre y el correo son obligatorios.");
            return;
        }
    
        const userData = {
            Nombre: nombre.trim(),
            Correo: correo.trim(),
            IDRol: parseInt(rol, 10),
        };
    
        if (contraseña.trim() !== "") {
            userData.Contraseña = contraseña;
        }
    
        console.log("🟢 Datos enviados al backend:", userData); // 👉 Depuración
    
        try {
            const response = await axios.put(`http://localhost:5000/api/usuarios/${id}`, userData, {
                headers: {
                    "user-role": localStorage.getItem("userRole") || "2",
                    "Content-Type": "application/json",
                },
            });
    
            console.log("✅ Respuesta del backend:", response.data); // 👉 Depuración
    
            alert("Usuario actualizado correctamente");
            navigate("/usuarios");
        } catch (error) {
            console.error("❌ Error al actualizar usuario:", error.response ? error.response.data : error);
            alert("Error al actualizar usuario");
        }
    };
    
    
    return (
        <div className="container mt-4">
            <h2>Editar Usuario</h2>
            <form onSubmit={handleUpdateUser} className="card p-3">
                <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Nueva Contraseña (Opcional)</label>
                    <input
                        type="password"
                        className="form-control"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        placeholder="Déjalo vacío para mantener la actual"
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Rol</label>
                    <select
                        className="form-control"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                    >
                        <option value="2">Empleado</option>
                        <option value="1">Administrador</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary me-2">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/usuarios")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarUsuario;

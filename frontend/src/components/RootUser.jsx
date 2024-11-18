import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useState, useEffect } from "react";

const RootUser = () => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        console.log("logged user: ", loggedUser);
        setUser(loggedUser);
    }, []);
    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <div>
            <div>
                <h1>Aqui deberia ir un header</h1>
                <p>Estas logeado como: {user.email}</p>
                <button onClick={handleLogout}>Cerrar sesion</button>
            </div>
        </div>
    );
}

export default RootUser;
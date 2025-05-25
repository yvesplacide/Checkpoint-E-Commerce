import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserInfo } from "../slices/userSlice";
import { clearCart } from "../slices/cartSlice";
import "./NavBar.css";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    dispatch(clearCart());
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">LE BOULEVARD</span>
        </Link>

        <div className="navbar-links">
          {userInfo ? (
            <div className="user-section">
              <span className="welcome-text">Bonjour, {userInfo.name}</span>
              <div className="nav-buttons">
                <Link to="/orders" className="nav-link">
                  Mes commandes
                </Link>
                <button className="nav-button logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-buttons">
              <Link className="nav-link" to="/login">
                Connexion
              </Link>
              <Link className="nav-link register" to="/register">
                Inscription
              </Link>
            </div>
          )}
          <Link className="cart-link" to="/cart">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

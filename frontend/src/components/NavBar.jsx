import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserInfo } from "../slices/userSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link className="navbar-brand" to="/">🏪 Mon E-commerce</Link>

        <div className="navbar-links">
          {userInfo ? (
            <>
              <span className="nav-link">Bonjour, {userInfo.name}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Connexion</Link>
              <Link className="nav-link" to="/register">Inscription</Link>
            </>
          )}
          <Link className="nav-link position-relative" to="/cart">
            Panier
            {totalItems > 0 && (
              <span className="badge" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--error-color)',
                color: 'white',
                borderRadius: '50%',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem'
              }}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

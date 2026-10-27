import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Top menu shown on every page
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="logo">Orbit</NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>Latest</NavLink>
          <NavLink to="/trending">Trending</NavLink>
          <NavLink to="/mission-log">Mission Log</NavLink>
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="link-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/signup" className="nav-signup">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

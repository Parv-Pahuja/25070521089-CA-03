// App decides which page to show for each web address (URL)
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import MissionLog from './pages/MissionLog.jsx';
import Trending from './pages/Trending.jsx';
import AuthPage from './pages/AuthPage.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/trending" element={<Trending />} />
          <Route
            path="/mission-log"
            element={
              <ProtectedRoute>
                <MissionLog />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

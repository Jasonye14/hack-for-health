
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/home/home';
import Login from './pages/login/login'
import Signup from './pages/signup/signup';

function App() {
  return (
    <Router>
      <RoutesContent />
    </Router>
  );
}
function RoutesContent() {

  return(
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

      </Routes>
  );
}
export default App;

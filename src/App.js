
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Login from './pages/login/login'
import Signup from './pages/signup/signup';
import Dashboard from './pages/dashboard/dashboard';
import ChatBotPage from './pages/Gemini/chatbot';
import Settings from './pages/settings/settings';
import Checker from './pages/compatability-checker/CompatabilityCheck';
import History from './pages/history/history';
import NotFound from './pages/NotFound/notfound';
import ProtectedRoute from './pages/protectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <RoutesContent />
    </Router>
  );
}
function RoutesContent() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={  <Dashboard/> } />
      <Route path='/compatability-checker' element={  <Checker/>} />
      <Route path='/gemini-chat-bot' element={<ProtectedRoute>  <ChatBotPage/> </ProtectedRoute>} />
      <Route path='/history' element={<ProtectedRoute > <History/> </ProtectedRoute>} />
      <Route path='/settings' element={<ProtectedRoute> <Settings/>  </ProtectedRoute>} />
      <Route path='/my-prescriptions' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;

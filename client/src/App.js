import './App.css';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Username from './components/Username'
import Password from './components/Password'
import Register from './components/Register'
import Profile from './components/Profile.js'
import Reset from './components/Reset.js'
import PageNotFound from './components/PageNotFound.js'
import Recovery from './components/Recovery';
import { AuthorizeUser , ProtectedRoute } from './midleware/auth';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/">
              <Route index element={<Username/>} />
              <Route path="register" element={<Register/>} />
              <Route path="password" element={<ProtectedRoute><Password/></ProtectedRoute>} />
              <Route path="profile" element={ <AuthorizeUser><Profile/></AuthorizeUser>} />
              <Route path="reset" element={<Reset/>} />
              <Route path="recovery" element={<Recovery/>} />
              <Route path="*" element={<PageNotFound/>} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App;

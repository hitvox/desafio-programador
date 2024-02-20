import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/default';
import Home from './pages/Home';
import Config from './pages/Config';

const Layout = () => {
  return (
    <Router>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Config />} />
        </Routes>
        </DefaultLayout>
    </Router>
  );
}

export default Layout;
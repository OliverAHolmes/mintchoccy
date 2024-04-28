import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import PageTitle from './components/PageTitle';
import Home from './pages/Home';

function App() {
  // const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Mint Choccy - Home" />
              <Home />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;

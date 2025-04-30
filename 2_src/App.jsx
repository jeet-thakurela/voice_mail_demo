

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EmailProvider } from './contexts/EmailContext';
import Login from './pages/Login';
import Inbox from './pages/Inbox';
import Sent from './pages/Sent';
import Drafts from './pages/Drafts';
import Trash from './pages/Trash';
import Spam from './pages/Spam';
import Compose from './pages/Compose';
import Settings from './pages/Settings';
import MainLayout from './components/layouts/MainLayout';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <EmailProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/inbox" />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/sent" element={<Sent />} />
                <Route path="/drafts" element={<Drafts />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/spam" element={<Spam />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </EmailProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;



















// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { EmailProvider } from './contexts/EmailContext';
// import Login from './pages/Login'; // This already exists
// import Inbox from './pages/Inbox';
// import Compose from './pages/Compose';
// import Settings from './pages/Settings';
// import MainLayout from './components/layouts/MainLayout';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import './App.css';

// const ProtectedRoute = ({ children }) => {
//   const auth = getAuth();
//   const [loading, setLoading] = React.useState(true);
//   const [authenticated, setAuthenticated] = React.useState(false);

//   React.useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setAuthenticated(!!user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   if (loading) {
//     return <div className="loading-screen">Loading...</div>;
//   }

//   if (!authenticated) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider>
//         <EmailProvider>
//           <Routes>
//             <Route path="/login" element={<Login />} />
            
//             <Route path="/" element={
//               <ProtectedRoute>
//                 <MainLayout />
//               </ProtectedRoute>
//             }>
//               <Route index element={<Navigate to="/email/inbox" />} />
              
//               <Route path="/email/:folder" element={<Inbox />} />
//               <Route path="/compose" element={<Compose />} />
//               <Route path="/settings" element={<Settings />} />
//             </Route>
            
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </EmailProvider>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import Login from './components/auth/Login'
import Home from './components/Home'
import Signup from './components/auth/Signup'
import BrowseSection from './components/BrowseSection'
import PurchasedBooks from './components/PurchasedBooks'
import PaymentPage from './pages/PaymentPage'
import PDFViewerPage from './pages/PDFViewerPage';
import { Bounce, ToastContainer } from 'react-toastify'


function App() {
  const appRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/browse', element: <BrowseSection /> },
    { path: '/myLibrary', element: <PurchasedBooks /> },
    { path: '/payment', element: <PaymentPage /> },
    { path: '/pdf-viewer', element: <PDFViewerPage /> },
    { path: '*', element: <h1>404 Not Found</h1> } // Default route for invalid paths. 404 Not Found page.
  ])
  return (
    <div className='overflow-hidden m-0 p-0 box-border'>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
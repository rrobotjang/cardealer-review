import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DealerDetailPage from './pages/DealerDetailPage'
import DealersPage from './pages/DealersPage'
import HomePage from './pages/HomePage'
import PostReviewPage from './pages/PostReviewPage'

function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-5">404</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/dealers/:id" element={<DealerDetailPage />} />
        <Route path="/dealers/:id/review" element={<PostReviewPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

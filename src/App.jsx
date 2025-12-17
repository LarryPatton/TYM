import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import CaseStudiesList from './pages/CaseStudiesList';
import CaseStudyDetail from './pages/CaseStudyDetail';
import CaseIndex from './pages/CaseIndex';
import CaseChapter from './pages/CaseChapter';
import ScrollToTop from './components/ScrollToTop';

// Gallery Pages
import GalleryHome from './pages/GalleryHome';
import GalleryModule from './pages/GalleryModule';
import GallerySubmodule from './pages/GallerySubmodule';
import GalleryWorkDetail from './pages/GalleryWorkDetail';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/case-studies" element={<CaseStudiesList />} />
          <Route path="work/case-studies/:slug" element={<CaseStudyDetail />} />
          
          {/* Sequential Case Study Routes */}
          <Route path="work/the-case" element={<CaseIndex />} />
          <Route path="work/the-case/:chapterId" element={<CaseChapter />} />

          {/* New Gallery Routes */}
          <Route path="gallery" element={<GalleryHome />} />
          <Route path="gallery/:module" element={<GalleryModule />} />
          <Route path="gallery/:module/:submodule" element={<GallerySubmodule />} />
          <Route path="gallery/:module/:submodule/:slug" element={<GalleryWorkDetail />} />

          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
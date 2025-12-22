import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import CaseStudiesList from './pages/CaseStudiesList';
import CaseStudyDetail from './pages/CaseStudyDetail';
import CaseIndex from './pages/CaseIndex';
import CaseChapter from './pages/CaseChapter';
import ShowcaseDemos from './pages/ShowcaseDemos';
import ShowcaseSidebarDemos from './pages/ShowcaseSidebarDemos';
import ServiceDemo from './pages/ServiceDemo';
import DesignSystem from './pages/DesignSystem';
import ScrollToTop from './components/ScrollToTop';

// Gallery Pages
import GalleryHome from './pages/GalleryHome';
import GalleryModule from './pages/GalleryModule';
import GallerySubmodule from './pages/GallerySubmodule';
import GalleryWorkDetail from './pages/GalleryWorkDetail';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/TYM">
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

          {/* Showcase Demos */}
          <Route path="showcase-demos" element={<ShowcaseDemos />} />
          <Route path="showcase-sidebar-demos" element={<ShowcaseSidebarDemos />} />
          <Route path="service-demo" element={<ServiceDemo />} />
          <Route path="design-system" element={<DesignSystem />} />

          {/* New Gallery Routes */}
          <Route path="gallery" element={<GalleryHome />} />
          <Route path="gallery/:module" element={<GalleryModule />} />
          <Route path="gallery/:module/:submodule" element={<GallerySubmodule />} />
          <Route path="gallery/:module/:submodule/:slug" element={<GalleryWorkDetail />} />

          <Route path="about" element={<About />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

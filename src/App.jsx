import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { ThemeProvider } from './hooks/useTheme';
import { ScrollLockProvider } from './contexts/ScrollLockContext';
import { LenisProvider } from './contexts/LenisContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import CaseStudiesList from './pages/CaseStudiesList';
import CaseStudyDetail from './pages/CaseStudyDetail';
import CaseIndex from './pages/CaseIndex';
import PhaseDetail from './pages/PhaseDetail';
import ShowcaseDemos from './pages/ShowcaseDemos';
import SchemeDetail from './pages/SchemeDetail';
import ShowcaseSidebarDemos from './pages/ShowcaseSidebarDemos';
import ServiceDemo from './pages/ServiceDemo';
import DesignSystem from './pages/DesignSystem';
import ScrollytellingDemo from './pages/ScrollytellingDemo';
import ScrollytellingAdvanced from './pages/ScrollytellingAdvanced';
import ScrollytellingExpert from './pages/ScrollytellingExpert';
import MouseCursorDemo from './pages/demos/MouseCursorDemo';
import ScrollNavigationDemo from './pages/demos/ScrollNavigationDemo';
import ContentTransitionDemo from './pages/demos/ContentTransitionDemo';
import VisualEffectsDemo from './pages/demos/VisualEffectsDemo';
import ImmersiveGalleryDemo from './pages/demos/ImmersiveGalleryDemo';
import TimelineDemo from './pages/demos/TimelineDemo';
import DataStorytellingDemo from './pages/demos/DataStorytellingDemo';
import LiquidThemeDemo from './pages/demos/LiquidThemeDemo';
import InteractiveBackgroundDemo from './pages/demos/InteractiveBackgroundDemo';
import ColorRevealDemo from './pages/demos/ColorRevealDemo';
import ScrollToTop from './components/ScrollToTop';
import WorkPreview from './pages/WorkPreview';

// Gallery Pages
import GalleryHome from './pages/GalleryHome';
import GalleryModule from './pages/GalleryModule';
import GallerySubmodule from './pages/GallerySubmodule';
import GalleryWorkDetail from './pages/GalleryWorkDetail';

function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <ScrollLockProvider>
          <BrowserRouter basename="/TYM">
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="work-preview" element={<WorkPreview />} />
            <Route path="work/case-studies" element={<CaseStudiesList />} />
            <Route path="work/case-studies/:slug" element={<CaseStudyDetail />} />
            
            {/* Case Study Routes - 4 Phases */}
            <Route path="work/the-case" element={<CaseIndex />} />
            <Route path="work/the-case/:phaseId" element={<PhaseDetail />} />

            {/* Showcase Demos */}
            <Route path="showcase-demos" element={<ShowcaseDemos />} />
            <Route path="showcase-demos/:schemeId" element={<SchemeDetail />} />
            <Route path="showcase-sidebar-demos" element={<ShowcaseSidebarDemos />} />
            <Route path="service-demo" element={<ServiceDemo />} />
            <Route path="design-system" element={<DesignSystem />} />
            <Route path="scrollytelling-demo" element={<ScrollytellingDemo />} />
            <Route path="scrollytelling-advanced" element={<ScrollytellingAdvanced />} />
            <Route path="scrollytelling-expert" element={<ScrollytellingExpert />} />
            
            {/* New Interaction Demos */}
            <Route path="demo/mouse-cursor" element={<MouseCursorDemo />} />
            <Route path="demo/scroll-navigation" element={<ScrollNavigationDemo />} />
            <Route path="demo/content-transition" element={<ContentTransitionDemo />} />
            <Route path="demo/visual-effects" element={<VisualEffectsDemo />} />
            <Route path="demo/immersive-gallery" element={<ImmersiveGalleryDemo />} />
            <Route path="demo/timeline" element={<TimelineDemo />} />
            <Route path="demo/data-storytelling" element={<DataStorytellingDemo />} />
            <Route path="demo/liquid-theme" element={<LiquidThemeDemo />} />
            <Route path="demo/interactive-background" element={<InteractiveBackgroundDemo />} />
            <Route path="showcase-demos/color-reveal" element={<ColorRevealDemo />} />

            {/* New Gallery Routes */}
            <Route path="gallery" element={<GalleryHome />} />
            <Route path="gallery/:module" element={<GalleryModule />} />
            <Route path="gallery/:module/:submodule" element={<GallerySubmodule />} />
            <Route path="gallery/:module/:submodule/:slug" element={<GalleryWorkDetail />} />

            <Route path="about" element={<About />} />
          </Route>
          </Routes>
          </BrowserRouter>
        </ScrollLockProvider>
      </LenisProvider>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Layout from './components/Layout';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import ThemeList from './pages/ThemeList';
import InteractionDemo from './pages/InteractionDemo';
import HeroDemo from './pages/HeroDemo';
import ThemePreviewDemo from './pages/ThemePreviewDemo';
import CardBackDemo from './pages/CardBackDemo';
import Template2 from './pages/templates/Template2';
import Template3 from './pages/templates/Template3';
import Template4 from './pages/templates/Template4';
import ProjectDetailDispatcher from './pages/ProjectDetailDispatcher';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<ProjectList />} />
          
          {/* 动态分发详情页路由 */}
          <Route path="projects/:id" element={<ProjectDetailDispatcher />} />
          
          {/* 模板预览路由 (保留用于测试) */}
          <Route path="projects/t2/:id" element={<Template2 />} />
          <Route path="projects/t3/:id" element={<Template3 />} />
          <Route path="projects/t4/:id" element={<Template4 />} />

          <Route path="themes" element={<ThemeList />} />
          <Route path="demo" element={<InteractionDemo />} />
          <Route path="demo2" element={<HeroDemo />} />
          <Route path="demo3" element={<ThemePreviewDemo />} />
          <Route path="demo5" element={<CardBackDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
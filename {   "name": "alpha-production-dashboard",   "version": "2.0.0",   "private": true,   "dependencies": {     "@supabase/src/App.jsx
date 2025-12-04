import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ProjectSelector from './components/ProjectSelector';
import SummaryTab from './components/SummaryTab';
import OrdersTab from './components/OrdersTab';
import ShipsMapTab from './components/ShipsMapTab';
import LogisticsTab from './components/LogisticsTab';
import ProductionTab from './components/ProductionTab';
import ProjectMapTab from './components/ProjectMapTab';
import FacadeMapTab from './components/FacadeMapTab';
import './App.css';

const supabase = createClient(
  'https://lrbpcfzhlooxultrzzix.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYnBjZnpobG9veHVsdHJ6eml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0NzExODIsImV4cCI6MjA0NjA0NzE4Mn0.wqtSy7R32LtLI5Tde1f0I8P_Y1tRfWjJZpDyWVPih0I'
);

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'סיכום', icon: '📊' },
    { id: 'orders', label: 'הזמנות', icon: '📦' },
    { id: 'ships', label: 'מפת אוניות', icon: '🚢' },
    { id: 'logistics', label: 'לוגיסטיקה', icon: '🚛' },
    { id: 'production', label: 'ייצור', icon: '🏭' },
    { id: 'project-map', label: 'מפת פרויקט', icon: '🗺️' },
    { id: 'facade-map', label: 'מפת חזיתות', icon: '🏢' }
  ];

  const renderTabContent = () => {
    if (!selectedProject) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div style={{ fontSize: '18px' }}>בחר פרויקט כדי להתחיל</div>
        </div>
      );
    }

    switch(activeTab) {
      case 'summary':
        return <SummaryTab projectId={selectedProject.id} supabase={supabase} />;
      case 'orders':
        return <OrdersTab projectId={selectedProject.id} supabase={supabase} />;
      case 'ships':
        return <ShipsMapTab projectId={selectedProject.id} supabase={supabase} />;
      case 'logistics':
        return <LogisticsTab projectId={selectedProject.id} supabase={supabase} />;
      case 'production':
        return <ProductionTab projectId={selectedProject.id} supabase={supabase} />;
      case 'project-map':
        return <ProjectMapTab projectId={selectedProject.id} supabase={supabase} />;
      case 'facade-map':
        return <FacadeMapTab projectId={selectedProject.id} supabase={supabase} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🏗️ Alpha Dashboard v2.0</h1>
            <p className="header-subtitle">מערכת ניהול ייצור ואלומיניום</p>
          </div>
          <ProjectSelector 
            supabase={supabase}
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
          />
        </div>
      </header>

      <nav className="tabs-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;

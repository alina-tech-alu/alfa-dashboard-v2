import { useState, useEffect } from 'react';
import './FacadeMapTab.css';

function FacadeMapTab({ projectId, supabase }) {
  const [facades, setFacades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchFacades();
    }
  }, [projectId]);

  const fetchFacades = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('facades')
        .select('*')
        .eq('project_id', projectId)
        .order('name', { ascending: true });

      if (error) throw error;
      setFacades(data || []);
    } catch (error) {
      console.error('Error fetching facades:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען חזיתות...</div>;
  }

  if (facades.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏢</div>
        <div className="empty-text">אין חזיתות מוגדרות לפרויקט זה</div>
      </div>
    );
  }

  return (
    <div className="facade-map-tab">
      <h2 className="facade-title">מפת חזיתות ({facades.length})</h2>
      <div className="facades-grid">
        {facades.map(facade => (
          <div key={facade.id} className="facade-card">
            <div className="facade-header">
              <div className="facade-name">חזית {facade.name}</div>
              <div className="facade-floors">{facade.floors} קומות</div>
            </div>
            
            <div className="facade-preview">
              {facade.pdf_url ? (
                <div className="pdf-indicator">
                  <span className="pdf-icon">📄</span>
                  <span className="pdf-text">PDF זמין</span>
                </div>
              ) : (
                <div className="no-pdf">
                  <span>אין PDF</span>
                </div>
              )}
            </div>
            
            {facade.grid_data && (
              <div className="facade-info">
                <div className="info-label">נתוני רשת מוגדרים</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacadeMapTab;

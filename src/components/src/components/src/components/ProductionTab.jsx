import { useState, useEffect } from 'react';
import './ProductionTab.css';

function ProductionTab({ projectId, supabase }) {
  const [production, setProduction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProduction();
    }
  }, [projectId]);

  const fetchProduction = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('production_status')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProduction(data || []);
    } catch (error) {
      console.error('Error fetching production:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'קיבלתי בעבודה': '#f59e0b',
      'בייצור': '#3b82f6',
      'הושלם': '#10b981',
      'נשלח להתקנה': '#06b6d4'
    };
    return colors[status] || '#64748b';
  };

  if (loading) {
    return <div className="loading">טוען נתוני ייצור...</div>;
  }

  if (production.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏭</div>
        <div className="empty-text">אין פריטים בייצור</div>
      </div>
    );
  }

  return (
    <div className="production-tab">
      <h2 className="production-title">ייצור ({production.length})</h2>
      <div className="production-grid">
        {production.map(item => (
          <div key={item.id} className="production-card">
            <div className="production-header">
              <div className="unit-id">יחידה: {item.unit_id}</div>
              <div 
                className="production-status"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </div>
            </div>
            
            <div className="production-details">
              {item.production_start_date && (
                <div className="production-detail">
                  <span className="detail-label">תחילת ייצור:</span>
                  <span className="detail-value">
                    {new Date(item.production_start_date).toLocaleDateString('he-IL')}
                  </span>
                </div>
              )}
              
              {item.production_end_date && (
                <div className="production-detail">
                  <span className="detail-label">סיום ייצור:</span>
                  <span className="detail-value">
                    {new Date(item.production_end_date).toLocaleDateString('he-IL')}
                  </span>
                </div>
              )}
              
              {item.notes && (
                <div className="production-notes">
                  <span className="detail-label">הערות:</span>
                  <div className="notes-text">{item.notes}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductionTab;

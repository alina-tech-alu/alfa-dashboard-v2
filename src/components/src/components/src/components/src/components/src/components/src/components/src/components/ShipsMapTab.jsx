import { useState, useEffect } from 'react';
import './ShipsMapTab.css';

function ShipsMapTab({ projectId, supabase }) {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchShips();
    }
  }, [projectId]);

  const fetchShips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ships')
        .select('*')
        .eq('project_id', projectId)
        .order('eta', { ascending: true });

      if (error) throw error;
      setShips(data || []);
    } catch (error) {
      console.error('Error fetching ships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'בדרך': '#3b82f6',
      'הגיע': '#10b981',
      'עוכב': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  if (loading) {
    return <div className="loading">טוען מידע על אוניות...</div>;
  }

  if (ships.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚢</div>
        <div className="empty-text">אין אוניות לפרויקט זה</div>
      </div>
    );
  }

  return (
    <div className="ships-map-tab">
      <h2 className="ships-title">מפת אוניות ({ships.length})</h2>
      <div className="ships-list">
        {ships.map(ship => (
          <div key={ship.id} className="ship-card">
            <div className="ship-header">
              <div className="ship-id">🚢 {ship.id}</div>
              <div 
                className="ship-status"
                style={{ backgroundColor: getStatusColor(ship.status) }}
              >
                {ship.status}
              </div>
            </div>
            
            <div className="ship-details">
              {ship.route && (
                <div className="ship-detail">
                  <span className="detail-label">מסלול:</span>
                  <span className="detail-value">{ship.route}</span>
                </div>
              )}
              
              {ship.eta && (
                <div className="ship-detail">
                  <span className="detail-label">הגעה משוערת:</span>
                  <span className="detail-value">
                    {new Date(ship.eta).toLocaleDateString('he-IL')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShipsMapTab;

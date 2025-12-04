import { useState, useEffect } from 'react';
import './SummaryTab.css';

function SummaryTab({ projectId, supabase }) {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    activeShips: 0,
    inProduction: 0,
    installed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchSummary();
    }
  }, [projectId]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      // Count orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      // Count active ships
      const { count: shipsCount } = await supabase
        .from('ships')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('status', 'בדרך');

      // Count in production
      const { count: productionCount } = await supabase
        .from('production_status')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .in('status', ['בייצור', 'הושלם']);

      // Count installed
      const { count: installedCount } = await supabase
        .from('installation_status')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('status', 'הותקן');

      setSummary({
        totalOrders: ordersCount || 0,
        activeShips: shipsCount || 0,
        inProduction: productionCount || 0,
        installed: installedCount || 0
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען נתונים...</div>;
  }

  const cards = [
    { title: 'סה"כ הזמנות', value: summary.totalOrders, icon: '📦', color: '#667eea' },
    { title: 'אוניות פעילות', value: summary.activeShips, icon: '🚢', color: '#f59e0b' },
    { title: 'בייצור', value: summary.inProduction, icon: '🏭', color: '#10b981' },
    { title: 'הותקן', value: summary.installed, icon: '✅', color: '#06b6d4' }
  ];

  return (
    <div className="summary-tab">
      <h2 className="summary-title">סיכום פרויקט</h2>
      <div className="summary-grid">
        {cards.map((card, index) => (
          <div key={index} className="summary-card" style={{ borderTopColor: card.color }}>
            <div className="card-header">
              <span className="card-icon">{card.icon}</span>
              <span className="card-title">{card.title}</span>
            </div>
            <div className="card-value" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummaryTab;

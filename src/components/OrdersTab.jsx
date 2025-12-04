import { useState, useEffect } from 'react';
import './OrdersTab.css';

function OrdersTab({ projectId, supabase }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchOrders();
    }
  }, [projectId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('project_id', projectId)
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'הוזמן': '#f59e0b',
      'בדרך': '#3b82f6',
      'התקבל במחסן': '#10b981',
      'בייצור': '#8b5cf6',
      'מותקן': '#06b6d4'
    };
    return colors[status] || '#64748b';
  };

  if (loading) {
    return <div className="loading">טוען הזמנות...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <div className="empty-text">אין הזמנות בפרויקט זה</div>
      </div>
    );
  }

  return (
    <div className="orders-tab">
      <h2 className="orders-title">הזמנות ({orders.length})</h2>
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-number">#{order.order_number}</div>
              <div 
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </div>
            </div>
            
            <div className="order-details">
              {order.supplier && (
                <div className="order-detail">
                  <span className="detail-label">ספק:</span>
                  <span className="detail-value">{order.supplier}</span>
                </div>
              )}
              
              <div className="order-detail">
                <span className="detail-label">תאריך הזמנה:</span>
                <span className="detail-value">
                  {new Date(order.order_date).toLocaleDateString('he-IL')}
                </span>
              </div>
              
              {order.delivery_date && (
                <div className="order-detail">
                  <span className="detail-label">תאריך אספקה:</span>
                  <span className="detail-value">
                    {new Date(order.delivery_date).toLocaleDateString('he-IL')}
                  </span>
                </div>
              )}
              
              {order.items && (
                <div className="order-detail">
                  <span className="detail-label">פריטים:</span>
                  <span className="detail-value">{order.items}</span>
                </div>
              )}
              
              {order.notes && (
                <div className="order-notes">
                  <span className="detail-label">הערות:</span>
                  <div className="notes-text">{order.notes}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersTab;

import { useState, useEffect } from 'react';

function ProjectMapTab({ projectId, supabase }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
      <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '8px' }}>
        מפת פרויקט
      </h2>
      <p style={{ color: '#64748b', fontSize: '16px' }}>
        מודול זה בפיתוח
      </p>
    </div>
  );
}

export default ProjectMapTab;

import { useState, useEffect } from 'react';
import './ProjectSelector.css';

function ProjectSelector({ supabase, selectedProject, onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      
      // Auto-select first project if none selected
      if (data && data.length > 0 && !selectedProject) {
        onProjectSelect(data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-selector">
      <label className="selector-label">פרויקט נוכחי:</label>
      <select 
        className="selector-dropdown"
        value={selectedProject?.id || ''}
        onChange={(e) => {
          const project = projects.find(p => p.id === e.target.value);
          onProjectSelect(project);
        }}
        disabled={loading}
      >
        {loading ? (
          <option>טוען פרויקטים...</option>
        ) : projects.length === 0 ? (
          <option>אין פרויקטים</option>
        ) : (
          <>
            <option value="">בחר פרויקט</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.status})
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}

export default ProjectSelector;

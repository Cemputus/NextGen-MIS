/**
 * Export Utilities for Excel and PDF
 */
import axios from 'axios';

/**
 * Export data to Excel via backend
 */
export const exportToExcel = async (data = null, filename = 'export', filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const exportType = filename.includes('fex') ? 'fex' : 'dashboard';
    
    const response = await axios.get('/api/export/excel', {
      headers: { Authorization: `Bearer ${token}` },
      params: { ...filters, type: exportType },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    // Fallback: try POST
    try {
      const token = localStorage.getItem('token');
      const exportType = filename.includes('fex') ? 'fex' : 'dashboard';
      const response = await axios.post('/api/export/excel', 
        { filters, type: exportType },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      alert('Failed to export to Excel. Please try again.');
      throw err;
    }
  }
};

/**
 * Export dashboard to PDF via backend
 */
export const exportToPDF = async (filters = {}, reportType = 'dashboard') => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      '/api/report/generate',
      { filters, reportType },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    // Fallback: try GET request
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/report/generate', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, reportType },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      alert('Failed to export to PDF. Please try again.');
      throw err;
    }
  }
};

/**
 * Export current dashboard data
 */
export const exportDashboard = async (stats, charts, filters = {}) => {
  return exportToExcel(null, 'dashboard_export', filters);
};

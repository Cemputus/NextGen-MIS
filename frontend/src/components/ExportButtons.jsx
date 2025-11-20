/**
 * Export Buttons Component
 * Provides Excel and PDF export functionality
 */
import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { exportToExcel, exportToPDF, exportDashboard } from '../utils/exportUtils';

const ExportButtons = ({ stats, charts, filters = {}, data = null, filename = 'export' }) => {
  const [exporting, setExporting] = useState({ excel: false, pdf: false });

  const handleExcelExport = async () => {
    try {
      setExporting({ ...exporting, excel: true });
      
      if (data) {
        // Export specific data
        await exportToExcel(data, filename, filters);
      } else if (stats && charts) {
        // Export dashboard
        await exportDashboard(stats, charts, filters);
      } else {
        // Export stats only
        await exportToExcel([stats], filename, filters);
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel. Please try again.');
    } finally {
      setExporting({ ...exporting, excel: false });
    }
  };

  const handlePDFExport = async () => {
    try {
      setExporting({ ...exporting, pdf: true });
      await exportToPDF(filters, 'dashboard');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export to PDF. Please try again.');
    } finally {
      setExporting({ ...exporting, pdf: false });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleExcelExport}
        disabled={exporting.excel}
        className="gap-2"
      >
        {exporting.excel ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Excel
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handlePDFExport}
        disabled={exporting.pdf}
        className="gap-2"
      >
        {exporting.pdf ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportButtons;


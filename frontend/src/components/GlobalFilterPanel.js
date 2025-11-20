/**
 * Global Filter Panel - Smooth, Professional UI with Advanced Styling
 * Simple, independent filters (no cascading)
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';

const GlobalFilterPanel = ({ onFilterChange, savedFilters = [] }) => {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    faculties: [],
    departments: [],
    programs: [],
    courses: [],
    semesters: [],
    high_schools: [],
    intake_years: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load all filter options independently
  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analytics/filter-options', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFilterOptions(res.data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (value === '' || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    if (searchTerm) {
      if (/^[AB]\d{5}$/.test(searchTerm)) {
        handleFilterChange('access_number', searchTerm);
      } else if (/\d{2}[BMD]\d{2}\/\d{3}/.test(searchTerm)) {
        handleFilterChange('reg_number', searchTerm);
      } else {
        handleFilterChange('student_name', searchTerm);
      }
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(k => filters[k]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <p className="text-sm text-muted-foreground">Refine your search and analysis</p>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by Access Number, Reg No, or Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-12 text-base border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                size="default" 
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Filter Grid - All Independent */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              <Select
                value={filters.faculty_id || ''}
                onChange={(e) => handleFilterChange('faculty_id', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Faculties</option>
                {filterOptions.faculties?.map(f => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.faculty_name}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.department_id || ''}
                onChange={(e) => handleFilterChange('department_id', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {filterOptions.departments?.map(d => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.program_id || ''}
                onChange={(e) => handleFilterChange('program_id', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Programs</option>
                {filterOptions.programs?.map(p => (
                  <option key={p.program_id} value={p.program_id}>
                    {p.program_name}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.course_code || ''}
                onChange={(e) => handleFilterChange('course_code', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Courses</option>
                {filterOptions.courses?.map(c => (
                  <option key={c.course_code} value={c.course_code}>
                    {c.course_code}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.semester_id || ''}
                onChange={(e) => handleFilterChange('semester_id', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Semesters</option>
                {filterOptions.semesters?.map(s => (
                  <option key={s.semester_id} value={s.semester_id}>
                    {s.semester_name}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.high_school || ''}
                onChange={(e) => handleFilterChange('high_school', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All High Schools</option>
                {filterOptions.high_schools?.map(hs => (
                  <option key={hs.high_school} value={hs.high_school}>
                    {hs.high_school}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.intake_year || ''}
                onChange={(e) => handleFilterChange('intake_year', e.target.value || null)}
                disabled={loading}
                className="h-11 border-2 rounded-lg shadow-sm hover:shadow-md transition-all focus:border-blue-500"
              >
                <option value="">All Years</option>
                {filterOptions.intake_years?.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>

            {/* Active Filters & Clear */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-between pt-4 border-t border-gray-200"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="gap-1 pr-1 bg-blue-100 text-blue-700 border-blue-200 font-medium"
                      >
                        {key}: {value}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 rounded-full"
                          onClick={() => handleFilterChange(key, null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GlobalFilterPanel;

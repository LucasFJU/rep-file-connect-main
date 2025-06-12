
import { useState } from "react";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const FileFilters = ({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeChange,
  selectedStatuses,
  onStatusChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: FileFiltersProps) => {
  const fileTypes = [
    { value: 'personalized', label: 'Personalized' },
    { value: 'public', label: 'Public' }
  ];

  const fileStatuses = [
    { value: 'uploaded', label: 'Uploaded' },
    { value: 'sent', label: 'Sent' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Upload Date' },
    { value: 'size', label: 'File Size' }
  ];

  const handleTypeToggle = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypeChange(updated);
  };

  const handleStatusToggle = (status: string) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(updated);
  };

  const clearFilters = () => {
    onSearchChange('');
    onTypeChange([]);
    onStatusChange([]);
    onSortChange('date');
    onSortOrderChange('desc');
  };

  const hasActiveFilters = searchTerm || selectedTypes.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-2" />
              Type
              {selectedTypes.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 text-xs">
                  {selectedTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>File Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fileTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleTypeToggle(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-2" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 text-xs">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>File Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fileStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={() => handleStatusToggle(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-3 w-3" />
            ) : (
              <SortDesc className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchTerm}"
            </Badge>
          )}
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              Type: {fileTypes.find(t => t.value === type)?.label}
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              Status: {fileStatuses.find(s => s.value === status)?.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileFilters;

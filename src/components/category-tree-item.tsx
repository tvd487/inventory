'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Category } from '@/types/inventory';
import { cn } from '@/lib/utils';

interface CategoryTreeItemProps {
  category: Category;
  level?: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTreeItem({ 
  category, 
  level = 0, 
  onEdit, 
  onDelete 
}: CategoryTreeItemProps) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="space-y-1">
      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors",
        level > 0 && "ml-6"
      )}>
        <div className="flex items-center space-x-2">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 w-6 p-0"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-6" />}
          <div>
            <div className="font-medium">{category.name}</div>
            {category.description && (
              <div className="text-sm text-muted-foreground">{category.description}</div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="space-y-1">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
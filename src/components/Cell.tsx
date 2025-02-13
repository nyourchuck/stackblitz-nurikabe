import React from 'react';
import { Cell as CellType } from '../types/nurikabe';
import { X } from 'lucide-react';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}

export function Cell({ cell, onClick, onHover, onLeave }: CellProps) {
  const getBgColor = () => {
    if (cell.isBlack) return 'bg-gray-900';
    if (cell.isPink) return 'bg-pink-200';
    if (cell.value !== null) return 'bg-white';
    return 'bg-gray-200';
  };

  const getTextColor = () => {
    if (cell.value !== null && cell.isFixed) return 'text-black';
    if (cell.value !== null && !cell.isFixed) return 'text-gray-400';
    return 'text-black';
  };

  return (
    <div
      className={`
        w-12 h-12 border border-gray-300 flex items-center justify-center
        cursor-pointer transition-colors duration-200
        ${getBgColor()}
        ${cell.isHovered ? 'ring-2 ring-blue-500' : ''}
      `}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
    >
      {cell.value !== null && (
        <span className={`text-xl font-bold ${getTextColor()}`}>
          {cell.value}
        </span>
      )}
      {cell.hasX && !cell.isBlack && cell.value === null && (
        <X className="w-6 h-6 text-red-500" />
      )}
    </div>
  );
}
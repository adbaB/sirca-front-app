'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  allowMultiple?: boolean;
}

interface AccordionItemProps {
  id?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Accordion({ children, className = '', allowMultiple = false }: AccordionProps) {
  // If children need auto-managed state when uncontrolled
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  return (
    <div className={`divide-y divide-[#f1f5f1] ${className}`}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return null;

        const element = child as React.ReactElement<AccordionItemProps>;
        const itemId = element.props.id || String(idx);
        const isChildControlled = element.props.isOpen !== undefined;

        const isOpen = isChildControlled ? element.props.isOpen : !!openIds[itemId];

        const onToggle = isChildControlled
          ? element.props.onToggle
          : () => {
              setOpenIds((prev) => {
                if (allowMultiple) {
                  return { ...prev, [itemId]: !prev[itemId] };
                } else {
                  const newState: Record<string, boolean> = {};
                  if (!prev[itemId]) {
                    newState[itemId] = true;
                  }
                  return newState;
                }
              });
            };

        return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
          isOpen,
          onToggle,
        });
      })}
    </div>
  );
}

interface IconElementProps {
  className?: string;
  style?: React.CSSProperties;
}

export function AccordionItem({
  title,
  children,
  isOpen = false,
  onToggle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  icon,
  rightElement,
}: AccordionItemProps) {
  return (
    <div className={`transition-all duration-200 ${className}`}>
      {/* Header Button */}
      <button
        onClick={onToggle}
        className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#f8faf8] transition-colors group ${headerClassName}`}
      >
        <div className="flex items-center gap-4">
          {icon && React.isValidElement(icon) && (
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200"
              style={{ backgroundColor: isOpen ? '#dcfce7' : '#f1f5f1' }}
            >
              {React.cloneElement(icon as React.ReactElement<IconElementProps>, {
                className: `h-5 w-5 ${(icon as React.ReactElement<IconElementProps>).props.className || ''}`,
                style: {
                  color: isOpen ? '#16a34a' : '#6b7f6b',
                  ...(icon as React.ReactElement<IconElementProps>).props.style,
                },
              })}
            </div>
          )}
          <div>
            {typeof title === 'string' ? (
              <p className="text-sm font-bold" style={{ color: '#1a2e1a' }}>
                {title}
              </p>
            ) : (
              title
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 ml-14 md:ml-0">
          {rightElement}
          <div className="text-gray-400 group-hover:text-gray-600 hidden md:block">
            <ChevronDown
              className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>
        </div>
      </button>

      {/* Body Content */}
      {isOpen && (
        <div className={`px-6 pb-6 pt-2 bg-[#fafbfa] border-t border-[#f1f5f1] ${bodyClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
}

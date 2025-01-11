import React from 'react';
import { Clock, Check, CircleX, ArrowRightLeft, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { BorrowGameRequestDTO } from '../../types/requests';

export interface BorrowStatusProps {
  request: BorrowGameRequestDTO;
  onStatusChange?: () => void;
}

export const BorrowStatus: React.FC<BorrowStatusProps> = ({ request, onStatusChange }) => {
  const getStatusInfo = () => {
    if (!request) {
      return {
        icon: <CircleX className="w-6 h-6" />,
        title: 'Status Unavailable',
        description: 'Could not load request status',
        bgClass: 'bg-red-900/20',
        borderClass: 'border-red-900/30',
        textClass: 'text-red-200'
      };
    }

    if (request.returnDate) {
      return {
        icon: <Check className="h-6 w-6" />,
        title: 'Game Returned',
        description: `Returned on ${format(new Date(request.returnDate), 'PP', { locale: pl })}`,
        bgClass: 'bg-green-900/20',
        borderClass: 'border-green-900/30',
        textClass: 'text-green-200'
      };
    }

    if (request.acceptDate) {
      return {
        icon: <ArrowRightLeft className="h-6 w-6" />,
        title: 'Borrow Active',
        description: `Borrowed since ${format(new Date(request.acceptDate), 'PP', { locale: pl })}`,
        bgClass: 'bg-amber-900/20',
        borderClass: 'border-amber-900/30',
        textClass: 'text-amber-200'
      };
    }

    return {
      icon: <Clock className="h-6 w-6" />,
      title: 'Request Pending',
      description: `Requested on ${format(new Date(request.createdDate), 'PP', { locale: pl })}`,
      bgClass: 'bg-amber-900/20',
      borderClass: 'border-amber-900/30',
      textClass: 'text-amber-200'
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`p-4 ${status.bgClass} rounded-lg border ${status.borderClass}
                   transition-all duration-300 hover:border-opacity-50`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-black/20 flex items-center 
                      justify-center ${status.textClass}`}>
          {status.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medieval text-lg text-amber-100">
            {status.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-amber-200/70">
            <CalendarDays className="w-4 h-4" />
            <span>{status.description}</span>
          </div>
        </div>
      </div>

      {request.acceptDate && !request.returnDate && (
        <div className="mt-4 pt-4 border-t border-amber-900/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-amber-200/70">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Currently borrowed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-200/70">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>
                {format(new Date(request.acceptDate), "'Borrowed on' PP", { locale: pl })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowStatus;
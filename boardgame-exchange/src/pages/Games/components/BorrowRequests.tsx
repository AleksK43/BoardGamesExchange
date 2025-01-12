import React, { useState, useEffect, useCallback } from 'react';
import { Clock, X, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { gameService } from '../../../services/api';
import { BorrowGameRequestDTO } from '../../../types/requests';
import BorrowingProcess from '../../../components/BorrowingProcess';

const BorrowRequests: React.FC = () => {
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [requests, setRequests] = useState<BorrowGameRequestDTO[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [selectedRequestForReturn, setSelectedRequestForReturn] = useState<BorrowGameRequestDTO | null>(null);
  const [showBorrowingProcess, setShowBorrowingProcess] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user) return;

    try {
      startLoading();
      const response = await gameService.getBorrowRequests();
      
      console.group('Borrow Requests Debugging');
      console.log('Current User:', user);
      console.log('Raw Borrow Requests:', response);

      const pendingRequests = response.filter(req => {
        const isCurrentUserOwner = req.boardGame.owner.id === user.id;
        const isNotReturned = req.returnDate === null;

        return isCurrentUserOwner && isNotReturned;
      });

      console.log('Filtered Pending Requests:', pendingRequests);
      console.groupEnd();

      setRequests(pendingRequests);
    } catch (error) {
      console.error('Failed to fetch borrow requests:', error);
      showNotification('error', 'Failed to load borrow requests');
    } finally {
      stopLoading();
    }
  }, [user, startLoading, stopLoading, showNotification]);


  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, user]);

  const handleManageRequest = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowBorrowingProcess(true);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <p className="text-amber-200/70 font-crimson">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medieval text-amber-100">Borrow Requests</h2>
        <div className="text-amber-200/70">
          Total Requests: {requests.length}
        </div>
      </div>
      
      <div className="grid gap-4">
        {requests.map(request => (
          <div 
            key={request.id}
            className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                     rounded-lg border border-amber-900/30 p-6 hover:border-amber-500/50 
                     transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medieval text-xl text-amber-100 mb-2">
                    {request.boardGame.title}
                  </h3>
                  <p className="text-amber-200/70 font-crimson text-sm mb-1">
                    Requested by: {request.borrowedToUser.firstname} {request.borrowedToUser.lastname}
                  </p>
                  <p className="text-amber-200/70 font-crimson text-sm">
                    Requested on: {format(new Date(request.createdDate), 'PP')}
                  </p>
                  {request.acceptDate && (
                    <p className="text-green-400/70 font-crimson text-sm mt-1">
                      Accepted on: {format(new Date(request.acceptDate), 'PP')}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                               rounded-lg border border-amber-900/30 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-900/30 p-2 rounded-full">
                        <Phone className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medieval text-amber-200 text-sm mb-1">Contact Number</h4>
                        <p className="text-amber-100 font-crimson text-base truncate">
                          {request.borrowedToUser.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-900/30 p-2 rounded-full">
                        <Mail className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medieval text-amber-200 text-sm mb-1">Email Address</h4>
                        <p className="text-amber-100 font-crimson text-base truncate">
                          {request.borrowedToUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {request.acceptDate && !request.returnDate ? (
                <button
                  onClick={() => {
                    setSelectedRequestForReturn(request);
                    setShowBorrowingProcess(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 
                           hover:from-green-700 hover:to-green-800
                           text-amber-100 rounded-lg transition-colors 
                           font-medieval"
                >
                  Confirm Return
                </button>
              ) : (
                <button
                  onClick={() => handleManageRequest(request.id)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 
                           hover:from-amber-700 hover:to-amber-800
                           text-amber-100 rounded-lg transition-colors 
                           font-medieval"
                >
                  Manage Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showBorrowingProcess && (selectedRequestId || selectedRequestForReturn) && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowBorrowingProcess(false);
            setSelectedRequestId(null);
            setSelectedRequestForReturn(null);
          }}
        >
          <div 
            className="w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowBorrowingProcess(false);
                setSelectedRequestId(null);
                setSelectedRequestForReturn(null);
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-900/80 text-red-100 
                         rounded-full flex items-center justify-center hover:bg-red-800 
                         transition-colors z-10"
            >
              <X size={16} />
            </button>
            <BorrowingProcess
              borrowRequestId={selectedRequestId || selectedRequestForReturn?.id}
              mode={selectedRequestForReturn ? "manage" : "manage"}
              onClose={() => {
                setShowBorrowingProcess(false);
                setSelectedRequestId(null);
                setSelectedRequestForReturn(null);
                fetchRequests();
              }}
              onStatusChange={fetchRequests}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { gameService } from '../../../services/api';
import { Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { BorrowGameRequestDTO } from '../../../types/requests';

const BorrowRequests: React.FC = () => {
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const [requests, setRequests] = useState<BorrowGameRequestDTO[]>([]);

  const fetchRequests = async () => {
    try {
      startLoading();
      const response = await gameService.getBorrowRequests();
      setRequests(response);
    } catch (error) {
      console.error('Failed to fetch borrow requests:', error);
      showNotification('error', 'Failed to load borrow requests');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      await gameService.acceptBorrowRequest(requestId);
      showNotification('success', 'Request accepted successfully');
      fetchRequests();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to accept request');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await gameService.deleteBorrowRequest(requestId);
      showNotification('success', 'Request rejected successfully');
      fetchRequests();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Failed to reject request');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medieval text-amber-100">Borrow Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-amber-200/70 font-crimson">No pending requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div 
              key={request.id}
              className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                       rounded-lg border border-amber-900/30 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medieval text-amber-100 text-lg">
                    {request.boardGame.title}
                  </h3>
                  <p className="text-amber-200/70 text-sm">
                    Requested by: {request.borrowedToUser.firstname} {request.borrowedToUser.lastname}
                  </p>
                  <p className="text-amber-200/70 text-sm">
                    Requested on: {format(new Date(request.createdDate), 'PP')}
                  </p>
                </div>
                
                {!request.acceptDate && !request.returnDate && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="p-2 bg-green-900/80 rounded-full hover:bg-green-800 
                               transition-colors text-green-100"
                      title="Accept request"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="p-2 bg-red-900/80 rounded-full hover:bg-red-800 
                               transition-colors text-red-100"
                      title="Reject request"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;
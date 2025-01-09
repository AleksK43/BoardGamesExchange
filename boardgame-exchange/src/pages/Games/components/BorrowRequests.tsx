import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useLoading } from '../../../providers/LoadingProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { gameService } from '../../../services/api';
import { Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { BorrowGameRequestDTO } from '../../../types/requests';
import BorrowingProcess from '../../../components/BorrowingProcess';

const BorrowRequests: React.FC = () => {
  const { showNotification } = useNotification();
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [requests, setRequests] = useState<BorrowGameRequestDTO[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [showBorrowingProcess, setShowBorrowingProcess] = useState(false);

  const fetchRequests = async () => {
    try {
      startLoading();
      const response = await gameService.getBorrowRequests();
      // Filtrujemy tylko oczekujące requesty i te w trakcie zwrotu
      const pendingRequests = response.filter(req => 
        (!req.acceptDate || (req.acceptDate && !req.returnDate)) &&
        req.boardGame.owner.id === user?.id
      );
      setRequests(pendingRequests);
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

  const handleManageRequest = (requestId: number) => {
    setSelectedRequestId(requestId);
    setShowBorrowingProcess(true);
  };

  const renderRequest = (request: BorrowGameRequestDTO) => {
    const isOwner = request.boardGame.owner.id === user?.id;
    if (!isOwner) return null;

    return (
      <div 
        key={request.id}
        className="bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                 rounded-lg border border-amber-900/30 p-4"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="font-medieval text-amber-100 text-lg">
              {request.boardGame.title}
            </h3>
            <div className="space-y-1 mt-2">
              <p className="text-amber-200/70 text-sm">
                Requested by: {request.borrowedToUser.firstname} {request.borrowedToUser.lastname}
              </p>
              <p className="text-amber-200/70 text-sm">
                Requested on: {format(new Date(request.createdDate), 'PP')}
              </p>
              {request.acceptDate && (
                <p className="text-green-400/70 text-sm">
                  Accepted on: {format(new Date(request.acceptDate), 'PP')}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <button
              onClick={() => handleManageRequest(request.id)}
              className="px-4 py-2 bg-amber-700/80 rounded-lg hover:bg-amber-600/80 
                       transition-colors text-amber-100 font-medieval"
            >
              Manage Request
            </button>
          </div>
        </div>
      </div>
    );
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
          {requests.map(renderRequest)}
        </div>
      )}

      {showBorrowingProcess && selectedRequestId && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowBorrowingProcess(false);
            setSelectedRequestId(null);
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
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-900/80 text-red-100 
                       rounded-full flex items-center justify-center hover:bg-red-800 
                       transition-colors z-10"
            >
              <X size={16} />
            </button>
            <BorrowingProcess
              borrowRequestId={selectedRequestId}
              mode="manage"
              onClose={() => {
                setShowBorrowingProcess(false);
                setSelectedRequestId(null);
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
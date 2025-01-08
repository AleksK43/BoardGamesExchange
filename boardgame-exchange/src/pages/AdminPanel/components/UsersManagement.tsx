import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, UserX, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { adminService } from '../../../services/adminApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { AdminUser, AdminUserType } from '../../../types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface UsersManagementProps {
 userType: AdminUserType;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ userType }) => {
 const [users, setUsers] = useState<AdminUser[]>([]);
 const [loading, setLoading] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const [sortField, setSortField] = useState<keyof AdminUser>('registrationDate');
 const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
 const { showNotification } = useNotification();

 const fetchUsers = async () => {
   try {
     setLoading(true);
     let response: AdminUser[] = [];
     
     switch (userType) {
       case AdminUserType.ADMIN:
         response = await adminService.getAdmins();
         break;
       case AdminUserType.MODERATOR:
         response = await adminService.getModerators();
         break;
       case AdminUserType.STANDARD:
         response = await adminService.getStandardUsers();
         break;
       default:
         response = await adminService.getAllUsers();
     }
     
     setUsers(response);
   } catch (error) {
     console.error('Błąd podczas pobierania użytkowników:', error);
     showNotification('error', 'Błąd podczas pobierania użytkowników');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchUsers();
 }, [userType]);

 const handleAction = async (action: string, userId: number) => {
   try {
     setLoading(true);
     console.log(`Wykonywanie akcji: ${action} dla użytkownika o ID: ${userId}`);

     let updatedUser;
     switch (action) {
       case 'promote':
         updatedUser = await adminService.makeUserModerator(userId);
         showNotification('success', 'Użytkownik został awansowany na moderatora');
         break;
       case 'block':
         updatedUser = await adminService.blockUser(userId);
         
         // Wymuszone ustawienie flagi blocked
         if (updatedUser) {
           (updatedUser as AdminUser).blocked = true;
         }

         console.log('Dane użytkownika po blokowaniu:', {
           updatedUser,
           forcedBlockedState: (updatedUser as AdminUser).blocked
         });

         showNotification('success', 'Użytkownik został zablokowany');
         break;
       case 'unblock':
         updatedUser = await adminService.activateUser(userId);
         showNotification('success', 'Użytkownik został odblokowany');
         break;
       case 'remove':
         if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
           updatedUser = await adminService.removeUser(userId);
           showNotification('success', 'Użytkownik został usunięty');
         }
         break;
     }

     console.log('Dane po wykonanej akcji:', updatedUser);
     
     if (updatedUser) {
       console.log('Szczegóły użytkownika:', {
         blocked: updatedUser.blocked,
         removeDate: updatedUser.removeDate
       });
     }

     fetchUsers();
   } catch (error) {
     console.error(`Błąd podczas wykonywania akcji ${action}:`, error);
     showNotification('error', 'Wystąpił błąd podczas wykonywania akcji');
   } finally {
     setLoading(false);
   }
 };

 const handleSort = (field: keyof AdminUser) => {
   if (field === sortField) {
     setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
   } else {
     setSortField(field);
     setSortDirection('asc');
   }
 };

 const getUserStatus = (user: AdminUser) => {
   // Szczegółowa diagnostyka stanu użytkownika
   console.log('Diagnostyka użytkownika:', {
     id: user.id,
     email: user.email,
     removeDate: user.removeDate,
     originalUserObject: user
   });

   // Jeśli removeDate istnieje, traktuj jako usuniętego
   if (user.removeDate) {
     return {
       label: 'Usunięty',
       className: 'bg-red-900/50 text-red-200',
       icon: <UserX className="w-4 h-4" />
     };
   }

   // Niestandardowe sprawdzenie zablokowania
   const isBlocked = 
     user.blocked === true || 
     Object.prototype.hasOwnProperty.call(user, 'blocked') && 
     user.blocked !== false;

   if (isBlocked) {
     return {
       label: 'Zablokowany',
       className: 'bg-amber-900/50 text-amber-200',
       icon: <Lock className="w-4 h-4" />
     };
   }

   return {
     label: 'Aktywny',
     className: 'bg-green-900/50 text-green-200',
     icon: <Shield className="w-4 h-4" />
   };
 };

 const sortedUsers = [...users].sort((a, b) => {
   const aValue = a[sortField];
   const bValue = b[sortField];
   const direction = sortDirection === 'asc' ? 1 : -1;
   
   if (aValue === null) return 1;
   if (bValue === null) return -1;
   
   return aValue < bValue ? -direction : direction;
 }).filter(user => 
   user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
   `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
   (user.city || '').toLowerCase().includes(searchTerm.toLowerCase())
 );

 const SortIcon = ({ field }: { field: keyof AdminUser }) => (
   <span className="inline-block ml-1">
     {sortField === field ? (
       sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
     ) : null}
   </span>
 );

 const getUserTypeLabel = (type: AdminUserType) => {
   switch (type) {
     case AdminUserType.ADMIN:
       return 'Administratorzy';
     case AdminUserType.MODERATOR:
       return 'Moderatorzy';
     case AdminUserType.STANDARD:
       return 'Standardowi użytkownicy';
     default:
       return 'Wszyscy użytkownicy';
   }
 };

 return (
   <div className="space-y-6">
     <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-medieval text-amber-100">
         {getUserTypeLabel(userType)}
       </h2>
       <div className="text-amber-200/70">
         Liczba użytkowników: {sortedUsers.length}
       </div>
     </div>

     <div className="mb-6">
       <input
         type="text"
         placeholder="Szukaj użytkowników..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2
                  border border-amber-500/30 focus:border-amber-500 focus:outline-none"
       />
     </div>

     <div className="overflow-x-auto">
       <table className="w-full border-collapse">
         <thead>
           <tr className="text-left">
             <th 
               className="p-4 font-medieval text-amber-100 cursor-pointer hover:text-amber-400"
               onClick={() => handleSort('email')}
             >
               Email <SortIcon field="email" />
             </th>
             <th 
               className="p-4 font-medieval text-amber-100 cursor-pointer hover:text-amber-400"
               onClick={() => handleSort('registrationDate')}
             >
               Data rejestracji <SortIcon field="registrationDate" />
             </th>
             <th 
               className="p-4 font-medieval text-amber-100 cursor-pointer hover:text-amber-400"
               onClick={() => handleSort('city')}
             >
               Miasto <SortIcon field="city" />
             </th>
             <th className="p-4 font-medieval text-amber-100">Status</th>
             <th className="p-4 font-medieval text-amber-100">Akcje</th>
           </tr>
         </thead>
         <tbody>
           {sortedUsers.map((user) => (
             <tr key={user.id} className="border-t border-amber-900/30 hover:bg-amber-900/20">
               <td className="p-4 text-amber-100">
                 <div>{user.email}</div>
                 <div className="text-sm text-amber-400/70">
                   {user.firstname} {user.lastname}
                 </div>
                 {user.blocked && (
                   <div className="flex items-center gap-2 mt-1 text-xs text-amber-500">
                     <AlertTriangle className="w-3 h-3" />
                     <span>Konto zablokowane</span>
                   </div>
                 )}
               </td>
               <td className="p-4 text-amber-100">
                 {format(new Date(user.registrationDate), 'dd MMMM yyyy', { locale: pl })}
               </td>
               <td className="p-4 text-amber-100">{user.city || '-'}</td>
               <td className="p-4">
                 <div className={`px-3 py-1.5 rounded-full text-sm inline-flex items-center gap-2 
                               ${getUserStatus(user).className}`}>
                   {getUserStatus(user).icon}
                   <span>{getUserStatus(user).label}</span>
                 </div>
               </td>
               <td className="p-4">
                 <div className="flex gap-2">
                   {userType === AdminUserType.STANDARD && !user.blocked && !user.removeDate && (
                     <button
                       onClick={() => handleAction('promote', user.id)}
                       className="p-2 bg-amber-900/50 rounded-full hover:bg-amber-800/50 
                                text-amber-100 transition-colors"
                       title="Awansuj na moderatora"
                     >
                       <Shield size={16} />
                     </button>
                   )}
                   
                   {!user.removeDate && (
                     user.blocked ? (
                       <button
                         onClick={() => handleAction('unblock', user.id)}
                         className="p-2 bg-green-900/50 rounded-full hover:bg-green-800/50 
                                  text-green-100 transition-colors"
                         title="Odblokuj użytkownika"
                       >
                         <Unlock size={16} />
                       </button>
                     ) : (
                       <button
                         onClick={() => handleAction('block', user.id)}
                         className="p-2 bg-red-900/50 rounded-full hover:bg-red-800/50 
                                  text-red-100 transition-colors"
                         title="Zablokuj użytkownika"
                       >
                         <Lock size={16} />
                       </button>
                     )
                   )}
                   
                   {!user.removeDate && (
                     <button
                       onClick={() => handleAction('remove', user.id)}
                       className="p-2 bg-red-900/50 rounded-full hover:bg-red-800/50 
                                text-red-100 transition-colors"
                       title="Usuń użytkownika"
                     >
                       <UserX size={16} />
                     </button>
                   )}
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {loading && (
       <div className="flex justify-center py-8">
         <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent 
                      rounded-full animate-spin" />
       </div>
     )}

     {!loading && users.length === 0 && (
       <div className="text-center py-8 text-amber-400">
         Brak użytkowników do wyświetlenia
       </div>
     )}
   </div>
 );
};

export default UsersManagement;
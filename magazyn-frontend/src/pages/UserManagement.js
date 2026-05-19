import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagement = ({ language, toggleLanguage }) => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const roleMap = {
    1: 'Admin',
    2: 'Managing Director',
    3: 'Worker',
  };

  const translations = {
    pl: {
      logout: 'Wyloguj się',
      users: 'Użytkownicy',
      id: 'ID',
      username: 'Nazwa użytkownika',
      role: 'Rola',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'E-mail',
      edit: 'Edytuj',
      delete: 'Usuń',
      save: 'Zapisz',
      cancel: 'Anuluj',
      prev: 'Wstecz',
      next: 'Dalej',
      addUser: 'Dodaj użytkownika',
      noData: 'Brak danych do wyświetlenia.',
    },
    en: {
      logout: 'Log out',
      users: 'Users',
      id: 'ID',
      username: 'Username',
      role: 'Role',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'E-mail',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      prev: 'Previous',
      next: 'Next',
      addUser: 'Add User',
      noData: 'No data to display.',
    },
  };

  const t = translations[language] || translations.pl;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
    fetchUsers(currentPage);
  }, [navigate, currentPage]);

  const fetchUsers = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedUser({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      roleId: user.role_id || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditedUser({});
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');

    const updatedData = {
      ...(editedUser.firstName && { firstName: editedUser.firstName }),
      ...(editedUser.lastName && { lastName: editedUser.lastName }),
      ...(editedUser.email && { email: editedUser.email }),
      ...(editedUser.roleId && { roleId: parseInt(editedUser.roleId, 10) }),
    };

    try {
      await axios.put(`/api/users/${editingUser}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(language === 'pl' ? 'Zmiany zostały zapisane.' : 'Changes saved successfully.');
      setEditingUser(null);
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error saving user data:', err);
      alert(language === 'pl' ? 'Nie udało się zapisać zmian.' : 'Failed to save changes.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      language === 'pl'
        ? 'Czy na pewno chcesz usunąć tego użytkownika?'
        : 'Are you sure you want to delete this user?'
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(language === 'pl' ? 'Użytkownik został usunięty.' : 'User deleted successfully.');
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(language === 'pl' ? 'Nie udało się usunąć użytkownika.' : 'Failed to delete user.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-beige-200 shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Magazyn Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          />
          {userData && (
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-sm text-gray-600">{userData.role}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/user-management/register')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {t.addUser}
          </button>
          <button
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={toggleLanguage}
          >
            {language === 'pl' ? 'EN' : 'PL'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {t.logout}
          </button>
        </div>
      </nav>

      {/* User List */}
      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">{t.users}</h2>
        {users.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">{t.id}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.username}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.role}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.firstName}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.lastName}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.email}</th>
                  <th className="border border-gray-300 px-4 py-2">{t.edit}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    {editingUser === user.id ? (
                      <>
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <select
                            value={editedUser.roleId || ''}
                            onChange={(e) => handleInputChange('roleId', e.target.value)}
                            className="border px-2 py-1 w-full"
                          >
                            {Object.entries(roleMap).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedUser.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedUser.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2"
                          >
                            {t.save}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            {t.cancel}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {roleMap[user.role_id] || 'Brak roli'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{user.first_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.last_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                          >
                            {t.edit}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            {t.delete}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {t.prev}
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {t.next}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">{t.noData}</p>
        )}
      </main>
    </div>
  );
};

export default UserManagement;

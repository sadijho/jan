import React, { useEffect, useState, useCallback } from 'react';
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
      actions: 'Akcje',
      edit: 'Edytuj',
      delete: 'Usuń',
      save: 'Zapisz',
      cancel: 'Anuluj',
      prev: 'Wstecz',
      next: 'Dalej',
      addUser: 'Dodaj użytkownika',
      noData: 'Brak danych do wyświetlenia.',
      page: 'Strona',
      of: 'z',
      noRole: 'Brak roli',
      confirmDelete: 'Czy na pewno chcesz usunąć tego użytkownika?',
      deleteSuccess: 'Użytkownik został usunięty.',
      deleteError: 'Nie udało się usunąć użytkownika.',
      saveSuccess: 'Zmiany zostały zapisane.',
      saveError: 'Nie udało się zapisać zmian.',
    },
    en: {
      logout: 'Log out',
      users: 'Users',
      id: 'ID',
      username: 'Username',
      role: 'Role',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'E-mail',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      prev: 'Previous',
      next: 'Next',
      addUser: 'Add user',
      noData: 'No data to display.',
      page: 'Page',
      of: 'of',
      noRole: 'No role',
      confirmDelete: 'Are you sure you want to delete this user?',
      deleteSuccess: 'User deleted successfully.',
      deleteError: 'Failed to delete user.',
      saveSuccess: 'Changes saved successfully.',
      saveError: 'Failed to save changes.',
    },
  };

  const t = translations[language] || translations.pl;

  const fetchUsers = useCallback(async (page) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setUsers([]);
      setTotalPages(1);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
    } catch (err) {
      setUserData(null);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

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

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');

    const updatedData = {
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
      roleId: parseInt(editedUser.roleId, 10),
    };

    try {
      await axios.put(`/api/users/${editingUser}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t.saveSuccess);
      setEditingUser(null);
      setEditedUser({});
      fetchUsers(currentPage);
    } catch (err) {
      alert(t.saveError);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t.confirmDelete);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(t.deleteSuccess);
      fetchUsers(currentPage);
    } catch (err) {
      alert(t.deleteError);
    }
  };

  const getRoleBadgeClassName = (roleId) => {
    if (roleId === 1) {
      return 'inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700';
    }

    if (roleId === 2) {
      return 'inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700';
    }

    if (roleId === 3) {
      return 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700';
    }

    return 'inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700';
  };

  return (
    <div className="app-shell">
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
            className="btn-success"
          >
            {t.addUser}
          </button>

          <button className="btn-muted" onClick={toggleLanguage}>
            {language === 'pl' ? 'EN' : 'PL'}
          </button>

          <button onClick={handleLogout} className="btn-danger">
            {t.logout}
          </button>
        </div>
      </nav>

      <main className="page-content">
        <section className="page-card">
          <div className="toolbar">
            <h2 className="page-title">{t.users}</h2>

            <button
              onClick={() => navigate('/user-management/register')}
              className="btn-success"
            >
              {t.addUser}
            </button>
          </div>

          {users.length > 0 ? (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.id}</th>
                      <th>{t.username}</th>
                      <th>{t.role}</th>
                      <th>{t.firstName}</th>
                      <th>{t.lastName}</th>
                      <th>{t.email}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.username}</td>

                        <td>
                          {editingUser === user.id ? (
                            <select
                              value={editedUser.roleId || ''}
                              onChange={(e) => handleInputChange('roleId', e.target.value)}
                              className="form-input min-w-[180px]"
                            >
                              {Object.entries(roleMap).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={getRoleBadgeClassName(user.role_id)}>
                              {roleMap[user.role_id] || t.noRole}
                            </span>
                          )}
                        </td>

                        <td>
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editedUser.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="form-input min-w-[140px]"
                            />
                          ) : (
                            user.first_name || '-'
                          )}
                        </td>

                        <td>
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editedUser.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="form-input min-w-[140px]"
                            />
                          ) : (
                            user.last_name || '-'
                          )}
                        </td>

                        <td>
                          {editingUser === user.id ? (
                            <input
                              type="email"
                              value={editedUser.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="form-input min-w-[200px]"
                            />
                          ) : (
                            user.email || '-'
                          )}
                        </td>

                        <td>
                          {editingUser === user.id ? (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={handleSaveEdit} className="btn-success">
                                {t.save}
                              </button>
                              <button onClick={handleCancelEdit} className="btn-muted">
                                {t.cancel}
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="btn-primary"
                              >
                                {t.edit}
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="btn-danger"
                              >
                                {t.delete}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="toolbar mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.prev}
                </button>

                <span className="text-sm font-medium text-gray-600">
                  {t.page} {currentPage} {t.of} {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.next}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">{t.noData}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserManagement;
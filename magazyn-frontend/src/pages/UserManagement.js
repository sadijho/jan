import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { translate } from '../i18n/translations';

const UserManagement = ({ language, toggleLanguage }) => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const t = (key) => translate(language, key);

  const roleMap = {
    1: 'Admin',
    2: 'Managing Director',
    3: 'Worker',
  };

  const links = [
    {
      label: t('common.addUser'),
      path: '/user-management/register',
      color: 'bg-green-500',
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');

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
  }, [currentPage]);

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

      toast.success(t('common.changesSaved'));
      setEditingUser(null);
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error saving user data:', err);
      toast.error(t('common.changesSaveError'));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t('common.confirmDeleteUser'));

    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(t('common.userDeleted'));
      fetchUsers(currentPage);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(t('common.userDeleteError'));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser({
      ...editedUser,
      [field]: value,
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        userData={userData}
        language={language}
        toggleLanguage={toggleLanguage}
        links={links}
      />

      <main className="flex-1 p-6 bg-white shadow-md mt-20">
        <h2 className="text-xl font-bold mb-4">
          {t('common.users')}
        </h2>

        {users.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">{t('table.id')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('common.username')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('common.role')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('common.firstName')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('common.lastName')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('common.email')}</th>
                  <th className="border border-gray-300 px-4 py-2">{t('table.actions')}</th>
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
                            {t('common.save')}
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            {t('common.cancel')}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {roleMap[user.role_id] || t('common.noRole')}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{user.first_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.last_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>

                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                          >
                            {t('common.edit')}
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            {t('common.delete')}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {t('common.previous')}
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {t('common.next')}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            {t('common.noData')}
          </p>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
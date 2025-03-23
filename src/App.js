import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserDetails from './UserDetails';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // جلب البيانات من API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('حدث خطأ أثناء جلب البيانات.');
        setLoading(false);
      });
  }, []);

  // تصفية المستخدمين حسب البحث
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حذف مستخدم
  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // إضافة مستخدم جديد
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = { id: users.length + 1, ...newUser };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '' });
    }
  };

  // تعديل مستخدم
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = () => {
    setUsers(users.map((user) =>
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  // تصدير البيانات كملف CSV
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      users.map(user => `${user.id},${user.name},${user.email}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <p className="text-center mt-10">جاري التحميل...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">قائمة المستخدمين</h1>

          {/* إضافة مستخدم جديد */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">إضافة مستخدم جديد</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
              >
                إضافة مستخدم
              </button>
            </div>
          </div>

          {/* حقل البحث */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* تصدير البيانات */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <button
              onClick={handleExport}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
            >
              تصدير كملف CSV
            </button>
          </div>

          {/* قائمة المستخدمين */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              {filteredUsers.map((user) => (
                <li key={user.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                  {editingUser?.id === user.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSaveUser}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        حفظ
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">
                          {user.name}
                        </Link> - {user.email}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* التوجيه */}
      <Routes>
        <Route path="/user/:userId" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user details:', error));
  }, [userId]);

  if (!user) return <p>جاري التحميل...</p>;

  return (
    <div className="user-details">
      <h2>{user.name}</h2>
      <p>البريد الإلكتروني: {user.email}</p>
      <p>الهاتف: {user.phone}</p>
      <p>الموقع: {user.website}</p>
    </div>
  );
}

export default UserDetails;
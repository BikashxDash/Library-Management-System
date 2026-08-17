// Ye component saare members fetch karta hai aur MemberCard me dikhata hai

import { useState, useEffect } from 'react';
import { getMembers } from '../services/api';
import MemberCard from './MemberCard';

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then((response) => {
        setMembers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading members...</p>;

  return (
    <div>
      <h2>All Members</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        members.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          onDelete={(id) => setMembers(prev => prev.filter(m => m.id !== id))} 
        />  
        ))
      )}
    </div>
  );
}

export default MemberList;
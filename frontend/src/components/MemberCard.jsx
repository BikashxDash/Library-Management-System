// Ye component ek single member ka card dikhata hai

function MemberCard({ member }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{member.name}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>{member.email}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Phone: {member.phone || 'N/A'}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>
        Status: {member.is_active ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}

export default MemberCard;
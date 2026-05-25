import './PatientListTab.css'

const patients = [
  { id: '1', name: 'Nguyễn Văn A', age: 29, gender: 'Nam', status: 'Khẩn cấp', lastVisit: '25/05/2026', phone: '0901 234 567', disease: 'Sốt cao co giật nhẹ' },
  { id: '2', name: 'Trần Thị B', age: 45, gender: 'Nữ', status: 'Cần khám', lastVisit: '24/05/2026', phone: '0912 345 678', disease: 'Đau ngực trái' },
  { id: '3', name: 'Lê Hoàng C', age: 34, gender: 'Nam', status: 'Bình thường', lastVisit: '20/05/2026', phone: '0987 654 321', disease: 'Ho khan kéo dài' },
  { id: '4', name: 'Phạm Minh D', age: 52, gender: 'Nam', status: 'Bình thường', lastVisit: '18/05/2026', phone: '0934 567 890', disease: 'Tiền sử huyết áp cao' },
  { id: '5', name: 'Vũ Thị E', age: 60, gender: 'Nữ', status: 'Khẩn cấp', lastVisit: '15/05/2026', phone: '0945 678 901', disease: 'Đau khớp gối mãn tính' }
]

export function PatientListTab() {
  return (
    <div className="patient-list-tab-content">
      <div className="tab-header-row">
        <div>
          <h1>Danh sách bệnh nhân</h1>
          <p>Quản lý và xem hồ sơ bệnh án EMR của các bệnh nhân bạn phụ trách.</p>
        </div>
        <div className="search-bar-container">
          <input type="text" placeholder="Tìm kiếm bệnh nhân bằng tên, số điện thoại..." />
        </div>
      </div>

      <div className="patient-cards-grid">
        {patients.map(p => (
          <article className="patient-card" key={p.id}>
            <div className="patient-card-header">
              <div className="avatar-circle">
                {p.name.split(' ').pop()?.[0]}
              </div>
              <div>
                <h3>{p.name}</h3>
                <span className="info-text">{p.age} tuổi • {p.gender}</span>
              </div>
            </div>
            <div className="patient-card-body">
              <div className="info-row">
                <span className="label">Bệnh lý chính:</span>
                <span className="value">{p.disease}</span>
              </div>
              <div className="info-row">
                <span className="label">Lần khám cuối:</span>
                <span className="value">{p.lastVisit}</span>
              </div>
              <div className="info-row">
                <span className="label">Số điện thoại:</span>
                <span className="value">{p.phone}</span>
              </div>
            </div>
            <div className="patient-card-footer">
              <span className={`status-badge ${p.status === 'Khẩn cấp' ? 'urgent' : p.status === 'Cần khám' ? 'warning' : 'normal'}`}>
                {p.status}
              </span>
              <button className="view-history-btn" type="button">
                Xem bệnh án
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

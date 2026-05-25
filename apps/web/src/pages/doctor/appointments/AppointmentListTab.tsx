import './AppointmentListTab.css'

const appointments = [
  { id: '1', patient: 'Lê Văn Khang', time: '14:00 - 14:30', date: '25/05/2026', type: 'Khám trực tiếp', reason: 'Tái khám cao huyết áp', status: 'Sắp tới' },
  { id: '2', patient: 'Nguyễn Thị Hoa', time: '15:00 - 15:30', date: '25/05/2026', type: 'Khám trực tiếp', reason: 'Đau dạ dày mãn tính', status: 'Sắp tới' },
  { id: '3', patient: 'Đỗ Hoàng Quân', time: '16:00 - 16:30', date: '25/05/2026', type: 'Khám trực tiếp', reason: 'Xét nghiệm máu & tư vấn', status: 'Sắp tới' },
  { id: '4', patient: 'Trần Văn Tú', time: '09:00 - 09:30', date: '25/05/2026', type: 'Khám trực tiếp', reason: 'Đau mỏi vai gáy', status: 'Đã khám' }
]

export function AppointmentListTab() {
  return (
    <div className="appointment-list-tab-content">
      <div className="tab-header-row">
        <div>
          <h1>Lịch hẹn khám tại phòng khám</h1>
          <p>Danh sách các ca đặt lịch khám trực tiếp (offline) đã được xác nhận hẹn gặp bạn.</p>
        </div>
      </div>

      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Thời gian</th>
              <th>Ngày</th>
              <th>Loại cuộc hẹn</th>
              <th>Lý do khám</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className={a.status === 'Đã khám' ? 'completed' : ''}>
                <td><strong>{a.patient}</strong></td>
                <td><span className="time-highlight">{a.time}</span></td>
                <td>{a.date}</td>
                <td>{a.type}</td>
                <td>{a.reason}</td>
                <td>
                  <span className={`status-pill ${a.status === 'Sắp tới' ? 'incoming' : 'done'}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <button className="action-button-btn" type="button">
                    {a.status === 'Sắp tới' ? 'Bắt đầu khám' : 'Xem bệnh án'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

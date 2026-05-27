import { useMemo, useState } from "react";
import { IconButton } from "../../../components/ui/ActionButton";
import { DataTable, DataTableColumn } from "../../../components/ui/DataTable";
import { FilterSelect } from "../../../components/ui/FilterSelect";
import { MetricCard } from "../../../components/ui/MetricCard";
import { CheckMetricIcon, ClockMetricIcon, UsersMetricIcon } from "../../../components/ui/metricIcons";
import { SearchInput } from "../../../components/ui/SearchInput";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { initialPatients } from "../../../data/patientMockData";
// import { Patient } from "../../../data/scheduleData";

import { PatientProfile } from "../../../components/doctor-patientList/patientTypes";
import '../../manager/doctors/DoctorManagement.css';


export function PatientListTab() {
  const [query, setQuery] = useState('');
  const [examFilter, setExamType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatients = useMemo(() => {
    return initialPatients.filter((p) => {
      const matchesQuery = p.fullName.toLowerCase().includes(query.toLowerCase()) || p.phone.includes(query);
      const matchesExam = examFilter === 'all' || p.examType === examFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesQuery && matchesExam && matchesStatus;
    });
  }, [query, examFilter, statusFilter]);

  const columns: Array<DataTableColumn<PatientProfile>> = [
    {
      key: 'index',
      header: 'STT',
      width: '60px',
      align: 'center',
      render: (_, index) => index + 1,
    },
    {
      key: 'fullName',
      header: 'Họ tên',
      render: (p) => (
        <div className="doctor-cell">
          <div className="doctor-avatar">
            <svg viewBox="0 0 24 24" width="20" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <div>
            <strong>{p.fullName}</strong>
            <span>{p.gender} • {p.age} tuổi</span>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Số điện thoại', align: 'center', render: (p) => p.phone },
    { key: 'examType', header: 'Loại khám', align: 'center', render: (p) => p.examType },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (p) => <StatusBadge status={p.status || 'waiting'} />,
    },
    {
      key: 'actions',
      header: 'Hành động',
      width: '130px',
      align: 'center',
      render: (p) => (
        <IconButton label="Xem chi tiết">
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        </IconButton>
      ),
    },
  ];

  return (
    <section className="doctor-page-content">
      <div className="doctor-heading-row">
        <div>
          <h1>Danh sách bệnh nhân</h1>
          <p>Trang quản lý hồ sơ bệnh nhân trong chuỗi phòng khám.</p>
        </div>
      </div>

      <div className="metrics-grid doctor-metrics-grid">
        <MetricCard label="Tổng số bệnh nhân" value={50} icon={<UsersMetricIcon />} iconClassName="metric-icon-blue" />
        <MetricCard label="Đang chờ" value={12} icon={<ClockMetricIcon />} iconClassName="metric-icon-yellow" />
        <MetricCard label="Đang xử lý" value={5} icon={<UsersMetricIcon />} iconClassName="metric-icon-green" />
        <MetricCard label="Ưu tiên cao" value={2} icon={<CheckMetricIcon />} iconClassName="metric-icon-pink" />
      </div>

      <div className="doctor-toolbar">
        <div className="doctor-toolbar-filters">
          <SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm bệnh nhân..." />
          <FilterSelect
            value={examFilter}
            onChange={(e) => setExamType(e.target.value)}
            options={[
              { value: 'all', label: 'Dịch vụ' },
              { value: 'Tư vấn', label: 'Tư vấn' },
              { value: 'Khám trực tiếp', label: 'Khám trực tiếp' },
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Trạng thái' },
              { value: 'waiting', label: 'Đang chờ' },
              { value: 'in-progress', label: 'Đang khám' },
              { value: 'completed', label: 'Đã kết thúc' },
            ]}
          />
        </div>
      </div>

      <DataTable rows={filteredPatients} columns={columns} getRowKey={(p) => p.id}
        emptyState="Không tìm thấy bệnh nhân nào phù hợp." />

      <div className="doctor-pagination">
        <button disabled>‹</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>›</button>
      </div>
    </section>
  );
}
// @/features/admin/pages/AdminUsersPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/api.ts';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import FilterBar from '@/shared_components/ui/FilterBar.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared_components/ui/pagination';
import { usePagination } from '@/shared_components/hooks/usePagination.ts';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';

// Thêm các Icon SVG inline nội bộ thay vì cài đặt thư viện bên ngoài giúp giao diện chuyên nghiệp hơn
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

interface FilterState {
  search: string;

  [key: string]: any;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: Set<string>;
  enabled: boolean;
}

interface SortConfig {
  key: keyof User;
  order: 'ASC' | 'DESC';
}

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({ search: '', status: '' });
  const [sort, setSort] = useState<SortConfig | null>(null);

  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const { currentPage, pageSize, handlePageChange, reset: resetPagination } = pagination;

  useEffect(() => {
    setLoading(true);
    apiClient.get('/admin/users')
      .then((response) => {
        const data = response as unknown as User[];
        setAllUsers(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Không thể tải danh sách tài khoản người dùng từ hệ thống.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...allUsers];

    if (filters.search) {
      const searchKeyword = filters.search.toLowerCase();
      result = result.filter(
        u =>
          u.username.toLowerCase().includes(searchKeyword) ||
          u.email.toLowerCase().includes(searchKeyword) ||
          u.fullName.toLowerCase().includes(searchKeyword),
      );
    }

    if (filters.status) {
      result = result.filter(u => (u.enabled ? 'active' : 'inactive') === filters.status);
    }

    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.key];
        const bVal = b[sort.key];

        const cleanA = aVal instanceof Set ? Array.from(aVal).join(', ') : aVal;
        const cleanB = bVal instanceof Set ? Array.from(bVal).join(', ') : bVal;

        if (cleanA === cleanB) return 0;
        if (cleanA < cleanB) return sort.order === 'ASC' ? -1 : 1;
        return sort.order === 'ASC' ? 1 : -1;
      });
    }

    return result;
  }, [allUsers, filters, sort]);

  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(start, start + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    resetPagination();
  };

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSort({ key: key as keyof User, order });
  };

  // Định nghĩa các cột hiển thị trên bảng dữ liệu
  // FIX lỗi trùng lặp Key: Đổi key cột cuối cùng thành 'username' (hoặc 'enabled') để không trùng với 'id' cột đầu tiên
  const columns: TableColumn<User>[] = [
    { key: 'id', header: 'ID', sortable: true, width: '70px' },
    {
      key: 'fullName',
      header: 'Họ và tên / Username',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-xs border border-slate-200">
            {row.fullName?.charAt(0).toUpperCase() || row.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.fullName || 'Chưa cập nhật'}</div>
            <div className="text-xs text-slate-500">@{row.username}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Địa chỉ Email', sortable: true },
    {
      key: 'roles',
      header: 'Vai trò',
      render: (val: unknown) => {
        const rolesSet = val as Set<string>;
        const rolesArray = Array.from(rolesSet || []);
        return (
          <div className="flex flex-wrap gap-1">
            {rolesArray.map(role => {
              const isDark = ['ADMIN', 'OWNER'].includes(role);
              return (
                <span key={role} className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {role}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'enabled',
      header: 'Trạng thái',
      sortable: true,
      render: (val: unknown) => {
        const isEnabled = val as boolean;
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              isEnabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {isEnabled ? 'Hoạt động' : 'Tạm khóa'}
          </span>
        );
      },
    },
    {
      key: 'username', // Sửa từ 'id' thành 'username' để triệt tiêu lỗi trùng Key trong React
      header: 'Hành động',
      render: (_, row) => (
        <Link
          to={`/admin/users/${row.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <EditIcon />
          <span>Sửa quyền</span>
        </Link>
      ),
    },
  ];


  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      pages.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Khối Header Trang */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserIcon />
          </div>
          <div>
            <p className="text-slate-500 text-sm mt-0.5">Xem danh sách, kiểm tra trạng thái và phân quyền tài khoản
              thành viên.</p>
          </div>
        </div>

        {/* Widget đếm số lượng tài khoản nhanh */}
        <div
          className="flex items-center space-x-6 text-sm border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng thành viên</span>
            <span className="text-xl font-bold text-slate-800">{filteredAndSortedUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div
          className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Vùng Lọc và Tìm kiếm */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <FilterBar
          onFilterChange={handleFilterChange}
          fields={[
            {
              name: 'status',
              label: 'Trạng thái tài khoản',
              type: 'select',
              options: [
                { value: 'active', label: 'Đang hoạt động' },
                { value: 'inactive', label: 'Đang bị tạm khóa' },
              ],
            },
          ]}
        />
      </div>

      {/* Bảng Dữ liệu chính */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={displayedUsers}
          rowKey="id"
          onSort={handleSort}
          currentSort={sort}
          isLoading={loading}
          emptyMessage="Không tìm thấy người dùng nào phù hợp với bộ lọc."
        />
      </div>

      {/* Thanh Phân trang */}
      {filteredAndSortedUsers.length > 0 && totalPages > 1 && (
        <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Pagination>
            <PaginationContent>
              {/* Nút Quay lại trang trước */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>

              {/* Các số trang được sinh tự động */}
              {renderPageNumbers()}

              {/* Nút Chuyển trang tiếp theo */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

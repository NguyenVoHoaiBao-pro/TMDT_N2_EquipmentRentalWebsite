// @/features/admin/pages/AdminDevicesPage.tsx
import { useEffect, useState, useCallback } from 'react';
import apiClient from '@/services/api.ts';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
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

// Thêm các Icon SVG inline nội bộ để giao diện trực quan hơn
const DeviceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

interface Device {
  id: number;
  productName: string;
  serialNumber: string;
  pricePerDay: number;
  depositValue: number;
  status: string;
}

interface SortConfig {
  key: keyof Device;
  order: 'ASC' | 'DESC';
}

export default function AdminDevicesPage() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [displayedDevices, setDisplayedDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [approving, setApproving] = useState<number | null>(null);

  // Quản lý trạng thái thông báo phản hồi UI thay cho hàm alert() mặc định
  const [uiFeedback, setUiFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const { currentPage, pageSize, handlePageChange } = pagination;

  const applySortAndPaginate = useCallback((
    sourceDevices: Device[],
    appliedSort: SortConfig | null,
    page: number,
    size: number,
  ) => {
    const sorted = [...sourceDevices];

    if (appliedSort) {
      sorted.sort((a, b) => {
        const aVal = a[appliedSort.key];
        const bVal = b[appliedSort.key];

        if (aVal === bVal) return 0;
        if (aVal < bVal) return appliedSort.order === 'ASC' ? -1 : 1;
        return appliedSort.order === 'ASC' ? 1 : -1;
      });
    }

    const start = (page - 1) * size;
    const paginated = sorted.slice(start, start + size);
    setDisplayedDevices(paginated);
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/devices/pending')
      .then((response) => {
        const data = response as unknown as Device[];
        setAllDevices(data);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Không thể tải danh sách thiết bị đang chờ duyệt từ hệ thống.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applySortAndPaginate(allDevices, sort, currentPage, pageSize);
  }, [allDevices, sort, currentPage, pageSize, applySortAndPaginate]);

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSort({ key: key as keyof Device, order });
  };

  const handleApprove = async (id: number) => {
    setApproving(id);
    setUiFeedback(null);
    try {
      await apiClient.put(`/devices/${id}/approve`);
      const updated = allDevices.filter(d => d.id !== id);
      setAllDevices(updated);

      const totalPagesAfterDelete = Math.ceil(updated.length / pageSize);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        handlePageChange(totalPagesAfterDelete);
      }

      setUiFeedback({ type: 'success', message: 'Đã phê duyệt thiết bị vào kho lưu hành thành công!' });
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => setUiFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setUiFeedback({ type: 'error', message: 'Phê duyệt thiết bị thất bại. Vui lòng kiểm tra lại.' });
    } finally {
      setApproving(null);
    }
  };

  // Nâng cấp định dạng cột hiển thị sắc nét hơn
  const columns: TableColumn<Device>[] = [
    { key: 'id', header: 'ID', sortable: true, width: '70px' },
    {
      key: 'productName',
      header: 'Tên thiết bị',
      sortable: true,
      render: (val: unknown) => (
        <span className="font-semibold text-slate-900">{val as string}</span>
      ),
    },
    {
      key: 'serialNumber', // Giữ nguyên trường serialNumber duy nhất tại đây
      header: 'Số Serial (S/N)',
      sortable: true,
      render: (val: unknown) => (
        <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono border border-slate-200">
          {val as string}
        </code>
      ),
    },
    {
      key: 'pricePerDay',
      header: 'Giá thuê / Ngày',
      sortable: true,
      render: (val: unknown) => (
        <span className="font-medium text-emerald-600">{(val as number).toLocaleString()}đ</span>
      ),
    },
    {
      key: 'depositValue',
      header: 'Giá trị đặt cọc',
      sortable: true,
      render: (val: unknown) => (
        <span className="font-medium text-slate-600">{(val as number).toLocaleString()}đ</span>
      ),
    },
    {
      key: 'status', // ĐÃ ĐỔI: Chuyển sang 'status' để triệt tiêu hoàn toàn lỗi trùng lặp key trong React
      header: 'Hành động',
      render: (_, row) => ( // Đọc trực tiếp từ object dòng hiện tại (row)
        <button
          onClick={() => handleApprove(row.id)} // Lấy chính xác số ID để kích hoạt API phê duyệt
          disabled={approving === row.id}
          className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-emerald-600/10 transition-colors cursor-pointer"
        >
          {approving === row.id ? (
            <>
              <span className="animate-spin mr-1">🔄</span>
              <span>Đang duyệt...</span>
            </>
          ) : (
            <>
              <CheckIcon />
              <span>Phê duyệt</span>
            </>
          )}
        </button>
      ),
    },
  ];
  const totalPages = Math.ceil(allDevices.length / pageSize);

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

      // Hiển thị duy nhất trang cuối cùng
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
            <DeviceIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Yêu cầu duyệt thiết bị</h1>
            <p className="text-slate-500 text-sm mt-0.5">Kiểm duyệt thông tin và số Serial của các thiết bị mới đăng ký
              từ Chủ máy.</p>
          </div>
        </div>

        {/* Widget đếm số lượng thiết bị nhanh */}
        <div
          className="flex items-center space-x-6 text-sm border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Đang chờ duyệt</span>
            <span className="text-xl font-bold text-amber-600">{allDevices.length} máy</span>
          </div>
        </div>
      </div>

      {/* Thông báo kết quả phản hồi hệ thống */}
      {uiFeedback && (
        <div className={`p-4 rounded-xl text-sm border flex items-center space-x-2 shadow-sm ${
          uiFeedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{uiFeedback.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="font-medium">{uiFeedback.message}</span>
        </div>
      )}

      {/* Khối hiển thị lỗi tải dữ liệu gốc nếu có */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Bảng Dữ liệu chính */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={displayedDevices}
          rowKey="id"
          onSort={handleSort}
          currentSort={sort}
          isLoading={loading}
          emptyMessage="Hiện tại không có thiết bị nào đang chờ kiểm duyệt."
        />
      </div>

      {/* Thanh Phân trang thông minh */}
      {allDevices.length > 0 && totalPages > 1 && (
        <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Pagination>
            <PaginationContent>
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

              {renderPageNumbers()}

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

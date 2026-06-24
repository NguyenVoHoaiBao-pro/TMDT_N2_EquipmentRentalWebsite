// @/components/layout/SearchInput.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export function SearchInput() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Đọc từ khóa hiện tại từ URL (nếu có) để hiển thị lên ô input
  const currentKeyword = searchParams.get('keyword') || '';
  const [inputValue, setInputValue] = useState(currentKeyword);

  // Đồng bộ hóa ô input nếu URL thay đổi từ một hành động khác (ví dụ: bấm nút "Xóa bộ lọc")
  useEffect(() => {
    setInputValue(currentKeyword);
  }, [currentKeyword]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Khởi tạo một đối tượng URLSearchParams mới dựa trên param hiện tại
    const newParams = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      newParams.set('keyword', inputValue.trim());
    } else {
      newParams.delete('keyword'); // Nếu ô input rỗng thì xóa param keyword đi
    }

    // 🌟 QUAN TRỌNG: Đảm bảo reset trang về trang 1 khi tìm kiếm từ khóa mới
    newParams.set('page', '1');

    // Chuyển hướng: Nếu đang ở trang khác thì đẩy về /products, nếu đang ở /products thì cập nhật URL tại chỗ
    if (location.pathname !== '/products') {
      navigate(`/products?${newParams.toString()}`);
    } else {
      navigate({ search: newParams.toString() });
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="hidden md:block w-fit max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  );
}

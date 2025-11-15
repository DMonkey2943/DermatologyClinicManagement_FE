'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import UserTable from '@/components/users/UserTable';
import Button from '@/components/ui/button/Button';
// import UserFormModal from '@/components/users/UserFormModal';
import userApiRequest from '@/apiRequests/user';
import { UserDataType } from '@/schemaValidations/user.schema';
import { toast } from "sonner";
import SearchInput from '@/components/ui/searchInput/SearchInput';

export default function ClientUserListPage() {
  const [users, setUsers] = useState<UserDataType[]>([]);
  // const [editingUser, setEditingUser] = useState<UserDataType | null>(null);
  // const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Thêm state phân trang
  const [page, setPage] = useState<number>(0); // zero-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // NEW: search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Tự động fetch khi page hoặc pageSize thay đổi
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedQuery]);

  // Debounce searchQuery -> debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Gọi API với skip & limit để phân trang, thêm query q để tìm kiếm
      const { payload } = await userApiRequest.getList({
        skip: page * pageSize,
        limit: pageSize,
        q: debouncedQuery,
      });
      const userList = payload.data ?? [];
      setUsers(userList);

      // Cố gắng lấy tổng số bản ghi từ response (hỗ trợ các key phổ biến)
      const totalFromPayload =
        payload.meta?.total ??
        // payload.total ??
        // payload.count ??
        // payload.pagination?.total ??
        userList.length;

      setTotal(Number(totalFromPayload) || userList.length);

      // Nếu trang hiện tại vượt quá tổng trang sau khi cập nhật total => đưa về trang cuối cùng hợp lệ
      const totalPages = Math.max(1, Math.ceil(Number(totalFromPayload || userList.length) / pageSize));
      if (page > totalPages - 1) {
        setPage(totalPages - 1);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách users:', error);
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleEdit = (user: UserDataType) => {
  //   setEditingUser(user);
  //   setModalType('edit');
  // };

  const handleDelete = async (id: string) => {
    // if (confirm('Bạn có chắc chắn xoá user này?')) {
      setIsLoading(true);
      try {
        await userApiRequest.delete(id);
        toast.success("Xóa tài khoản thành công");
        // Giữ nguyên page hiện tại và refetch
        fetchUsers();
      } catch (error) {
        console.error('Lỗi xóa user: ', error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    // }
  };

  // const handleFormSubmit = async () => {
  //   // Đóng modal và refresh (giữ page)
  //   closeModal();
  //   await fetchUsers(); // Refresh the list
  // };

  // const openAddModal = () => {
  //   setEditingUser(null);
  //   setModalType('add');
  //   // Khi tạo mới, thường muốn về trang đầu để thấy item mới (tuỳ yêu cầu)
  //   setPage(0);
  // };

  // const closeModal = () => {
  //   setEditingUser(null);
  //   setModalType(null);
  // };

  // Handlers phân trang được truyền xuống UserTable
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0); // quay về trang đầu khi thay đổi pageSize
  };

  // Clear search handler used by the inline "X" button
  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(0);
    if (searchRef.current) searchRef.current.focus();
  };

  return (    
      <>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* <Button onClick={openAddModal}>+ Thêm tài khoản</Button> */}
            <Link href={`/admin/users/add`}>
              <Button >+ Thêm tài khoản</Button>
            </Link>
          </div>

          {/* Search placed to the right */}
          <div className="flex items-center justify-end w-full md:w-auto">
            <SearchInput
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              onClear={clearSearch}
              placeholder="Tìm kiếm username, tên, SĐT..."
              className="pl-9 pr-8"
              ariaLabel="Search users"
            />
          </div>
        </div>

        <UserTable 
          users={users} 
          // onEdit={handleEdit} 
          onDelete={handleDelete} 
          isLoading={isLoading}
          // Truyền props phân trang vào UserTable
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
    </>
  );
}
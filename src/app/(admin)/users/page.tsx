'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import UserTable from '@/components/users/UserTable';
import Button from '@/components/ui/button/Button';
import UserFormModal from '@/components/users/UserFormModal';
import { User } from '@/types/user';
import userApiRequest from '@/apiRequests/user';
import { UserDataType } from '@/schemaValidations/user.schema';

export default function UserListPage() {
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const {payload} = await userApiRequest.getList();
      const userList = payload.data;
      console.log(userList);
      setUsers(userList);
    } catch (error) {
      console.error('Lỗi lấy danh sách users:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá user này?')) {
      setIsLoading(true);
      try {
        await userApiRequest.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Lỗi xóa user: ', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async () => {
    // Form đã submit thành công
    // toast.success(editingUser ? 'Cập nhật user thành công' : 'Thêm user thành công');
    
    // Đóng modal và refresh
    closeModal();
    await fetchUsers(); // Refresh the list
  };

  const openAddModal = () => {
    setEditingUser(null);
    setModalType('add');
  };

  const closeModal = () => {
    setEditingUser(null);
    setModalType(null);
  };

  return (
    <div>
      <UserFormModal
        isOpen={!!modalType}
        onClose={closeModal}
        onSuccess={handleFormSubmit}
        editingUser={editingUser}
        modalType={modalType}
      />
      
      <PageBreadcrumb pageTitle="Danh sách Users" />
      
      <div className="space-y-6">
        <ComponentCard title="Danh sách Users">
          <Button onClick={openAddModal}>+ Add User</Button>
          <UserTable 
            users={users} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </ComponentCard>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import UserTable from '@/components/users/UserTable';
import Button from '@/components/ui/button/Button';
import UserFormModal, { UserFormData } from '@/components/users/UserFormModal';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users';
import { User, UserResponse } from '@/types/user';

export default function UserListPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      console.log(res);
      setUsers(res);
    } catch (error) {
      console.error('Lỗi lấy danh sách users:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalType('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn xoá user này?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Lỗi xóa user: ', error);
      }
    }
  };

  const handleModalSubmit = async (formData: UserFormData) => {
    try {
      if (modalType === 'add') {
        const newUser = await createUser({
          username: formData.username,
          password: formData.password!,
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          role: 'STAFF', // Mặc định là STAFF khi tạo mới
        });
        console.log("Created new user: ", newUser);
        setUsers([...users, newUser]);
      } else if (modalType === 'edit' && editingUser) {
        const updatedUser = await updateUser(editingUser.id, {
          username: formData.username,
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number
        });
        console.log("Updated user: ", updatedUser);
        fetchUsers(); // Refresh the list
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting user:', error);
      throw error; // Re-throw to let modal handle the error state
    }
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
        onSubmit={handleModalSubmit}
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
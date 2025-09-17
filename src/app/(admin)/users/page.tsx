'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import UserTable from '@/components/tables/UserTable';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index';
import { getUsers } from '@/services/users';
import { UserResponse, UserUpdate } from '@/types/user';

export default function UserListPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);

  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');

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

  const handleEdit = (user: UserUpdate) => {
    const newUsername = prompt('Nhập username mới:', user.username);
    if (newUsername) {
      return getUsers();
    }
  };

  const handleDelete = (id: string) => {
    // if (confirm('Bạn có chắc chắn xoá user này?')) {
    //   axiosInstance.delete(`/users/${id}`)
    //     .then(() => fetchUsers())
    //     .catch(err => console.error('Lỗi xoá user:', err));
    // }
  };

  const handleSubmit = () => {    
    // if (username && password) {
    //   axiosInstance.post('/users', { username, password })
    //     .then(() => fetchUsers())
    //     .catch(err => console.error('Lỗi thêm user:', err));
    //     closeModal();
    // } else {
    //   alert('Vui lòng nhập đầy đủ thông tin');
    // }
  };
  const openAddModal = () =>{
    setName('');
    setPassword('');
    setModalType('add');
  }
  const closeModal = () => {
    setModalType(null);
  };
  return (
    <div>
      <Modal isOpen={!!modalType} onClose={closeModal}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">
            {modalType === 'add' ? 'Thêm Platform mới' : 'Chỉnh sửa Platform'}
          </h2>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Tên tài khoản"
            value={username}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>Huỷ</Button>
            <Button onClick={handleSubmit}>Lưu</Button>
          </div>
        </div>
      </Modal>
      <PageBreadcrumb pageTitle="Danh sách Users" />
      <div className="space-y-6">
        <ComponentCard 
          title="Danh sách Users" 
        >
          <Button onClick={openAddModal}>+ Add User</Button>

          <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
        </ComponentCard>
      </div>
    </div>
  );
}

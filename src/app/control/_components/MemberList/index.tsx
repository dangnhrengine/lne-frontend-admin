import { Pagination, Table } from '@/components/common/ui';
import { Column } from '@/components/common/ui/Table';
import { useTableState } from '@/hooks/useTableState';
import { Calendar } from 'lucide-react';

// Sample data type for demo
interface RecordType {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  date: string;
  amount: number;
  department: string;
  manager: string;
}

export const TableDemo: React.FC = () => {
  // Sample data
  const sampleData: RecordType[] = Array.from({ length: 100 }, (_, i) => ({
    id: `ID${String(i + 1).padStart(6, '0')}`,
    name: `項目 ${i + 1}`,
    code: `CODE${String(i + 1).padStart(4, '0')}`,
    type: ['タイプA', 'タイプB', 'タイプC'][i % 3],
    status: ['承認済み', '保留中', '却下'][i % 3],
    date: `2024/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    amount: Math.floor(Math.random() * 100000),
    department: ['営業部', '開発部', '総務部'][i % 3],
    manager: `管理者${(i % 10) + 1}`,
  }));

  // Use the table state hook
  const {
    paginatedData,
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    total,
    handleSort,
    handlePageChange,
  } = useTableState(sampleData, 20);

  // Column definitions
  const columns: Column<RecordType>[] = [
    {
      key: 'id',
      title: 'ID',
      width: '100px',
      sortable: true,
    },
    {
      key: 'name',
      title: '名称',
      width: '150px',
      sortable: true,
    },
    {
      key: 'code',
      title: 'コード',
      width: '120px',
      sortable: true,
    },
    {
      key: 'type',
      title: 'タイプ',
      width: '100px',
      sortable: true,
    },
    {
      key: 'status',
      title: 'ステータス',
      width: '100px',
      render: (status) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            status === '承認済み'
              ? 'bg-green-100 text-green-800'
              : status === '保留中'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      key: 'date',
      title: '日付',
      width: '110px',
      sortable: true,
      render: (date) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      title: '金額',
      width: '100px',
      align: 'right',
      sortable: true,
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      key: 'department',
      title: '部署',
      width: '100px',
      sortable: true,
    },
    {
      key: 'manager',
      title: '管理者',
      width: '100px',
      sortable: true,
    },
    {
      key: 'actions',
      title: '操作',
      width: '80px',
      align: 'center',
      render: (_, record) => (
        <button className="rounded bg-gray-800 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-700">
          編集
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="検索..."
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
              検索
            </button>
          </div>
          <button className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">
            新規追加
          </button>
        </div>
      </div>

      {/* Separate Table Component */}
      <Table
        data={paginatedData}
        columns={columns}
        rowKey="id"
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        className="shadow-sm"
      />

      {/* Separate Pagination Component */}
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={true}
        pageSizeOptions={[10, 20, 50, 100]}
        className="rounded-b-lg shadow-sm"
      />
    </div>
  );
};

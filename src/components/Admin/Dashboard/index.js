import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    // Dữ liệu biểu đồ mẫu
    const data = [
        { name: 'January', users: 4000 },
        { name: 'February', users: 3000 },
        { name: 'March', users: 2000 },
        { name: 'April', users: 2780 },
        { name: 'May', users: 1890 },
        { name: 'June', users: 2390 },
        { name: 'July', users: 3490 },
        { name: 'August', users: 4000 },
        { name: 'September', users: 3000 },
        { name: 'October', users: 2000 },
        { name: 'November', users: 2780 },
        { name: 'December', users: 1890 },

        { name: 'Active Users', value: 3000 },
        { name: 'Inactive Users', value: 2000 },
    ];

    const COLORS = ['#0088FE', '#FFBB28']; // Màu cho các phần tử của biểu đồ

    return (
        <div style={{ marginLeft: '16%' }} className="container mx-auto mt-28">
            {/* <h1 className="text-3xl font-bold mb-6">Dashboard</h1> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-blue-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Users</h2>
                    <p className="text-gray-600">Total users: 1000</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="bg-green-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Posts</h2>
                    <p className="text-gray-600">Total posts: 500</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="bg-yellow-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>
                    <p className="text-gray-600">Total comments: 2000</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Card 4 */}
                <div className="bg-orange-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                    <p className="text-gray-600">Monthly visitors: 5000</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#ff7300" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className='flex justify-between mt-8'>
                {/*bên trái biểu đồ tròn*/}
                <div className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300" style={{ width: '49%' }}>
                    <h2 className="text-xl font-semibold text-white mb-4">User Statistics</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/*bên phải Thống kê doanh thu */}
                <div className="bg-gradient-to-br from-blue-200 to-green-400 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300" style={{ width: '49%' }}>
                    <h2 className="text-xl font-semibold text-white mb-4">Revenue Statistics</h2>
                    <div className="d-flex justify-content-between mb-4">
                        <span className="text-white">Total Revenue</span>
                        <span className="text-2xl font-bold text-white">$7,431.14 USD</span>
                    </div>
                    {/* Biểu đồ dạng thanh */}
                    <div className="mb-4">
                        <div className="text-sm font-semibold text-white mb-2">Gross value</div>
                        <div className="progress bg-white rounded-lg shadow-md" style={{ height: '23px' }}>
                            <div className="progress-bar rounded-lg bg-sky-500" role="progressbar" style={{ width: '80%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <p className='text-right mr-2'> 80% </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="text-sm font-semibold text-white mb-2">Net volume from sales</div>
                        <div className="progress bg-white rounded-lg shadow-md" style={{ height: '23px' }}>
                            <div className="progress-bar rounded-lg bg-green-400" role="progressbar" style={{ width: '33%' }} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">
                                <p className='text-right mr-2'> 33% </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="text-sm font-semibold text-white mb-2">New volume from sales</div>
                        <div className="progress bg-white rounded-lg shadow-md" style={{ height: '23px' }}>
                            <div className="progress-bar rounded-lg bg-red-500" role="progressbar" style={{ width: '9%' }} aria-valuenow="9" aria-valuemin="0" aria-valuemax="100">
                                <p className='text-right mr-2'> 9% </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Biểu đồ đường */}
            <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                <h2 className="text-xl font-semibold mb-4">Monthly Users Chart</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;

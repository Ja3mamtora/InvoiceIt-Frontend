import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LayoutDashboardIcon as DashboardIcon, Book, Users, ShoppingCart, Pencil, TrendingUp, Loader, Menu, X } from 'lucide-react';

export default function Dashboard() {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [quotationsData, customersData, productsData] = await Promise.all([
        fetch(`${import.meta.env.VITE_BURL}/allQuotation/dashboard`, { credentials: 'include' }).then(res => res.json()),
        fetch(`${import.meta.env.VITE_BURL}/allCustomer`, { credentials: 'include' }).then(res => res.json()),
        fetch(`${import.meta.env.VITE_BURL}/allProduct`, { credentials: 'include' }).then(res => res.json())
      ]);

      setQuotations(quotationsData);
      setCustomers(customersData.customers);
      setProducts(productsData);

      const revenueByMonth = quotationsData.reduce((acc, quotation) => {
        const month = new Date(quotation.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + quotation.grandTotal;
        return acc;
      }, {});

      const monthlyRevenueData = Object.entries(revenueByMonth).map(([month, total]) => ({
        month: new Date(2023, month).toLocaleString('default', { month: 'short' }),
        total
      }));

      setMonthlyRevenue(monthlyRevenueData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { title: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Products', icon: ShoppingCart, path: '/products' },
    { title: 'Quotations', icon: Book, path: '/quotations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600"><img src='./image.png' className="h-10 w-auto"></img></span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out hover:border-indigo-400 focus:outline-none focus:border-indigo-700"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={() => navigate('/create-quotation')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Create New Quotation
              </button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium hover:bg-indigo-50 hover:border-indigo-400 transition duration-150 ease-in-out"
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => navigate('/create-quotation')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Create New Quotation
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                icon={<Book className="h-8 w-8 text-indigo-500" />}
                title="Total Quotations"
                value={quotations.length}
              />
              <DashboardCard
                icon={<Users className="h-8 w-8 text-green-500" />}
                title="Total Customers"
                value={customers.length}
              />
              <DashboardCard
                icon={<ShoppingCart className="h-8 w-8 text-purple-500" />}
                title="Total Products"
                value={products.length}
              />
              <DashboardCard
                icon={<TrendingUp className="h-8 w-8 text-red-500" />}
                title="Total Revenue"
                value={`₹${quotations.reduce((sum, q) => sum + q.grandTotal, 0).toLocaleString()}`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartCard title="Monthly Revenue">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#6366f1" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Quotation Trends">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={quotations.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="grandTotal" stroke="#10b981" name="Quotation Value" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataTable
                title="Recent Quotations"
                data={quotations.slice(-5)}
                columns={[
                  { key: 'id', header: 'ID' },
                  { key: 'createdAt', header: 'Date', format: (value) => new Date(value).toLocaleDateString() },
                  { key: 'customer', header: 'Customer'},
                  { key: 'grandTotal', header: 'Total', format: (value) => `₹${value.toLocaleString()}` },
                ]}
              />

              <DataTable
                title="Top Customers"
                data={customers.slice(0, 5)}
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'email', header: 'Email' },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function DataTable({ title, data, columns }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.format ? column.format(item[column.key]) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


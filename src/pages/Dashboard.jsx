import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from 'recharts';

import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleAlert,
  Package,
  Plus,
  Tags,
  Wallet,
  ArrowRight,
  MoreHorizontal,
  TrendingUp
} from 'lucide-react';

import { useStore } from '../context/StoreContext';

// Chart Data
const chartData = [
  { name: 'Mon', stock: 320 },
  { name: 'Tue', stock: 390 },
  { name: 'Wed', stock: 350 },
  { name: 'Thu', stock: 470 },
  { name: 'Fri', stock: 430 },
  { name: 'Sat', stock: 520 },
  { name: 'Sun', stock: 590 }
];

// Currency Formatter
const money = n => `₦${Number(n || 0).toLocaleString('en-NG')}`;

// Dashboard Component
export default function Dashboard() {
  const { products, categories, settings, activities } = useStore();

  const navigate = useNavigate();

  // Calculate Inventory Statistics
  const totalUnits = products.reduce(
    (s, p) => s + Number(p.quantity || 0),
    0
  );

  const stockValue = products.reduce(
    (s, p) => s + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );

  const low = products.filter(
    p => Number(p.quantity) <= Number(settings.lowStock)
  );

  // Dashboard Statistics
  const stats = [
    {
      label: 'Total products',
      value: products.length.toLocaleString(),
      change: 'In your catalogue',
      icon: Package,
      tone: 'purple',
      trend: '+12.8%'
    },
    {
      label: 'Total categories',
      value: categories.length.toLocaleString(),
      change: 'Organised groups',
      icon: Tags,
      tone: 'blue',
      trend: '+4.2%'
    },
    {
      label: 'Units in stock',
      value: totalUnits.toLocaleString(),
      change: 'Across all products',
      icon: Boxes,
      tone: 'green',
      trend: '+8.1%'
    },
    {
      label: 'Inventory value',
      value: money(stockValue),
      change: 'At selling price',
      icon: Wallet,
      tone: 'orange',
      trend: '+6.5%'
    }
  ];

  return (
    <div className="dashboard-page">

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>

          <h1>Dashboard</h1>

          <p>
            Here’s what’s happening with your inventory today.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="btn btn-light"
            onClick={() => navigate('/products')}
          >
            View products
            <ArrowRight size={16} />
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/products?new=1')}
          >
            <Plus size={17} />
            Add product
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div>
          <span className="welcome-tag">
            <span className="live-dot" />
            YOUR INVENTORY AT A GLANCE
          </span>

          <h2>Good to see you again 👋</h2>

          <p>
            Keep your products organised and your business one step ahead.
          </p>

          <button
            className="banner-button"
            onClick={() => navigate('/products')}
          >
            Manage inventory
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="banner-illustration">
          <div className="float-card float-card-one">
            <Package size={19} />

            <span>
              <b>{products.length} products</b>
              <small>In your store</small>
            </span>
          </div>

          <div className="banner-box">
            <Boxes size={82} />
          </div>

          <div className="float-card float-card-two">
            <TrendingUp size={18} />

            <span>
              <b>Stock overview</b>
              <small>Updated just now</small>
            </span>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map(({ label, value, change, icon: Icon, tone, trend }) => (
          <article className="stat-card" key={label}>
            <div className="stat-top">
              <div className={`stat-icon ${tone}`}>
                <Icon size={20} />
              </div>

              <span className="trend-pill">
                <ArrowUpRight size={14} />
                {trend}
              </span>
            </div>

            <span className="stat-label">
              {label}
            </span>

            <strong className="stat-value">
              {value}
            </strong>

            <span className="stat-foot">
              {change}
            </span>
          </article>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">

        {/* Stock Movement Chart */}
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>Stock movement</h3>
              <p>Inventory activity over the last 7 days</p>
            </div>

            <button
              className="select-like"
              onClick={() => alert('Showing the last 7 days')}
            >
              Last 7 days
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="chart-summary">
            <strong>{totalUnits.toLocaleString()}</strong>

            <span>
              <ArrowUpRight size={14} />
              Current units in stock
            </span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 8,
                  left: -22,
                  bottom: 0
                }}
              >
                <defs>
                  <linearGradient
                    id="stockFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#7866ed"
                      stopOpacity={0.24}
                    />

                    <stop
                      offset="95%"
                      stopColor="#7866ed"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#eff0f6"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9999aa',
                    fontSize: 12
                  }}
                  dy={10}
                />

                <Tooltip
                  contentStyle={{
                    border: '1px solid #ececf4',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px #20203312'
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="#7664e8"
                  strokeWidth={3}
                  fill="url(#stockFill)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Stock Health */}
        <section className="panel stock-panel">
          <div className="panel-head">
            <div>
              <h3>Stock health</h3>
              <p>Product availability status</p>
            </div>

            <button
              className="icon-btn"
              onClick={() => navigate('/products')}
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="stock-ring-wrap">
            <div
              className="stock-ring"
              style={{
                '--healthy': `${
                  products.length
                    ? ((products.length - low.length) / products.length) * 100
                    : 0
                }%`
              }}
            >
              <div>
                <strong>
                  {
                    products.length
                      ? Math.round(
                          ((products.length - low.length) / products.length) * 100
                        )
                      : 0
                  }%
                </strong>

                <span>Healthy</span>
              </div>
            </div>
          </div>

          <div className="stock-legend">
            <div>
              <i className="legend-dot healthy-dot" />
              <span>Healthy stock</span>
              <b>{products.length - low.length}</b>
            </div>

            <div>
              <i className="legend-dot low-dot" />
              <span>Low stock</span>
              <b>{low.length}</b>
            </div>
          </div>

          <button
            className="panel-link"
            onClick={() => navigate('/products')}
          >
            Review stock levels
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      {/* Bottom Dashboard Grid */}
      <div className="dashboard-grid bottom-grid">

        {/* Recent Products */}
        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h3>Recent products</h3>
              <p>Your latest inventory items</p>
            </div>

            <button
              className="panel-link"
              onClick={() => navigate('/products')}
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="recent-list">
            {products.slice(0, 4).map(p => (
              <div className="recent-product" key={p.id}>
                <img
                  src={p.image}
                  alt={p.name}
                  onError={e => {
                    e.currentTarget.src =
                      'https://placehold.co/80x80?text=Item';
                  }}
                />

                <div className="recent-product-info">
                  <strong>{p.name}</strong>
                  <span>
                    {p.sku} · {p.category}
                  </span>
                </div>

                <div className="recent-product-price">
                  <strong>{money(p.price)}</strong>

                  <span
                    className={
                      p.quantity <= settings.lowStock
                        ? 'text-danger'
                        : 'text-success'
                    }
                  >
                    {p.quantity} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="panel activity-panel">
          <div className="panel-head">
            <div>
              <h3>Recent activity</h3>
              <p>Latest updates in your store</p>
            </div>

            <button
              className="icon-btn"
              title="Refresh activity"
              onClick={() => window.location.reload()}
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="activity-list">
            {activities.slice(0, 4).map(a => (
              <div className="activity-item" key={a.id}>
                <div className={`activity-icon ${a.type}`}>
                  {
                    a.type === 'warning'
                      ? <CircleAlert size={16} />
                      : a.type === 'category'
                        ? <Tags size={16} />
                        : <Package size={16} />
                  }
                </div>

                <div>
                  <strong>{a.text}</strong>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Low Stock Alert */}
      {low.length > 0 && (
        <div className="low-stock-strip">
          <div className="low-stock-icon">
            <CircleAlert size={19} />
          </div>

          <div>
            <strong>
              {low.length} product{low.length > 1 ? 's' : ''} running low
            </strong>

            <span>
              Some products are at or below your low-stock threshold of{' '}
              {settings.lowStock} units.
            </span>
          </div>

          <button onClick={() => navigate('/products')}>
            Check products
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { usePage } from '@inertiajs/react';

export default function index() {
  const { orders, transactions, products } = usePage().props;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Volume (Last 30 Days)</h2>
        
          {
            "type": "line",
            "data": {
              "labels": ${JSON.stringify(orders.map(o => o.date))},
              "datasets": [{
                "label": "Orders",
                "data": ${JSON.stringify(orders.map(o => o.count))},
                "borderColor": "#3b82f6",
                "backgroundColor": "rgba(59, 130, 246, 0.2)",
                "fill": true,
                "tension": 0.4
              }]
            },
            "options": {
              "scales": {
                "y": { "beginAtZero": true, "title": { "display": true, "text": "Number of Orders" } },
                "x": { "title": { "display": true, "text": "Date" } }
              }
            }
          }
     
        </div>

        {/* Transactions Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Transaction Amounts by Payment Method</h2>
     
          {
            "type": "bar",
            "data": {
              "labels": ${JSON.stringify(transactions.map(t => t.method))},
              "datasets": [{
                "label": "Total Amount ($)",
                "data": ${JSON.stringify(transactions.map(t => t.total))},
                "backgroundColor": ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
                "borderColor": ["#059669", "#d97706", "#dc2626", "#7c3aed"],
                "borderWidth": 1
              }]
            },
            "options": {
              "scales": {
                "y": { "beginAtZero": true, "title": { "display": true, "text": "Amount ($)" } },
                "x": { "title": { "display": true, "text": "Payment Method" } }
              }
            }
          }
         
        </div>

        {/* Products Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Product Stock by Category</h2>
        
          {
            "type": "pie",
            "data": {
              "labels": ${JSON.stringify(products.map(p => p.category))},
              "datasets": [{
                "data": ${JSON.stringify(products.map(p => p.stock))},
                "backgroundColor": ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"],
                "borderColor": ["#059669", "#d97706", "#dc2626", "#7c3aed", "#2563eb"],
                "borderWidth": 1
              }]
            },
            "options": {
              "plugins": {
                "legend": { "position": "right" }
              }
            }
          }
       
        </div>
      </div>
    </div>
  );
}
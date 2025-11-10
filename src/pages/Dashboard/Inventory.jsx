import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

function Inventory() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h2>
        <p className="text-gray-600">Manage your inventory items here.</p>
      </div>
    </DashboardLayout>
  )
}

export default Inventory
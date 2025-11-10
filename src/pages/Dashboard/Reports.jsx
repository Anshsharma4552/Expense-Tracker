import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

function Reports() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
        <p className="text-gray-600">View detailed financial reports here.</p>
      </div>
    </DashboardLayout>
  )
}

export default Reports
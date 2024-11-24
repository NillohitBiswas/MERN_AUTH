import React, { useState } from 'react'
import { Search } from 'lucide-react'

export function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="relative">
        <input
          type="text"
          id="search-input" // Added id attribute
          name="search" // Added name attribute
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tracks..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-lime-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </form>
  )
}
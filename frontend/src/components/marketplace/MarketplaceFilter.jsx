const MarketplaceFilter = () => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm space-y-5">

      <div>
        <h3 className="font-semibold mb-2">Search</h3>
        <input
          type="text"
          placeholder="Search items..."
          className="w-full border rounded-lg px-3 py-2 outline-none"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Category</h3>

        <select className="w-full border rounded-lg px-3 py-2">
          <option>All</option>
          <option>Books</option>
          <option>Electronics</option>
          <option>Cycle</option>
          <option>Clothes</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
        Apply Filters
      </button>

    </div>
  );
};

export default MarketplaceFilter;
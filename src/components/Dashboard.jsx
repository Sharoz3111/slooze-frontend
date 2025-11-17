import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import useTheme from "../hooks/useTheme";

export default function Dashboard() {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState(0);

  async function load() {
    const list = await getProducts();
    setProducts(list);

    const count = list.filter((p) => p.qty < 20).length;
    setLowStock(count);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen p-6 bg-transparent text-white"
          : "min-h-screen p-6 bg-transparent text-gray-900"
      }
    >
      {/* Dashboard Title */}
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
        📊 Dashboard
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

        {/* Total Products */}
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-between backdrop-blur-xl border border-indigo-300/20">
          <div>
            <h3 className="text-lg opacity-90">Total Products</h3>
            <p className="text-4xl font-bold mt-2 drop-shadow">{products.length}</p>
          </div>
          <span className="text-5xl opacity-40">📦</span>
        </div>

        {/* Low Stock */}
        <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-between backdrop-blur-xl border border-red-300/20">
          <div>
            <h3 className="text-lg opacity-90">Low Stock Items</h3>
            <p className="text-4xl font-bold mt-2 drop-shadow">{lowStock}</p>
          </div>
          <span className="text-5xl opacity-40">⚠️</span>
        </div>

      </div>

      {/* Coming Soon Section */}
      <div
        className={
          theme === "dark"
            ? "mt-10 text-sm opacity-60 bg-white/5 p-4 rounded-xl backdrop-blur-xl border border-white/10"
            : "mt-10 text-sm opacity-70 bg-white/50 p-4 rounded-xl backdrop-blur-xl border border-gray-300/30"
        }
      >
        More analytics coming soon…
      </div>
    </div>
  );
}

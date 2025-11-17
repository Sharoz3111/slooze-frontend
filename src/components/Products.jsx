import React, { useEffect, useState, useMemo } from "react";
import { getProducts } from "../services/api";
import ProductForm from "./ProductForm";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [query, setQuery] = useState("");

  const { user } = useAuth();
  const { theme } = useTheme();

  // Load all products
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  async function refreshList() {
    const data = await getProducts();
    setProducts(data);
  }

  // Open Add Product modal
  function handleAdd() {
    setEditProduct(null);
    setShowForm(true);
  }

  // Open Edit Product modal
  function handleEdit(product) {
    setEditProduct(product);
    setShowForm(true);
  }

  // Filter products
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
          : "min-h-screen p-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-gray-900"
      }
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            📦 Products
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Manage commodities — add, edit and monitor stock levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={
              theme === "dark"
                ? "bg-gray-800/70 p-1 rounded-full shadow-inner"
                : "bg-white/70 p-1 rounded-full shadow"
            }
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or SKU..."
              className="px-4 py-2 w-64 rounded-full outline-none bg-transparent placeholder:opacity-60"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg shadow hover:from-indigo-700 transition-all"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div
        className={
          theme === "dark"
            ? "bg-gray-800/40 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-gray-700/50"
            : "bg-white/60 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-gray-300/40"
        }
      >
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm opacity-70"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        theme === "dark"
                          ? "border-b border-gray-700 hover:bg-gray-800 transition-all"
                          : "border-b border-gray-200 hover:bg-indigo-50 transition-all"
                      }
                    >
                      <td className="p-3 font-semibold">{p.name}</td>
                      <td className="p-3 text-sm opacity-80">{p.sku}</td>

                      {/* Price badge */}
                      <td className="p-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                          ₹{Math.max(0, Number(p.price) || 0)}
                        </span>
                      </td>

                      {/* Qty badge */}
                      <td className="p-3">
                        {Number(p.qty) <= 10 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                            {p.qty} (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            {p.qty}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <ProductForm
          existing={editProduct}
          close={() => {
            setShowForm(false);
            setEditProduct(null);
          }}
          refresh={async () => {
            await refreshList();
          }}
        />
      )}
    </div>
  );
}

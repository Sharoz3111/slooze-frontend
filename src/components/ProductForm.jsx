import React, { useState } from "react";
import { addProduct, updateProduct } from "../services/api";
import useTheme from "../hooks/useTheme";

export default function ProductForm({ existing, close, refresh }) {
  const { theme } = useTheme();

  const [name, setName] = useState(existing?.name || "");
  const [sku, setSku] = useState(existing?.sku || "");
  const [price, setPrice] = useState(existing?.price ?? "");
  const [qty, setQty] = useState(existing?.qty ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function sanitizeNumber(value) {
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) return 0;
    return num < 0 ? 0 : num;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (!sku.trim()) return setError("SKU is required.");
    if (price === "" || Number(price) < 0)
      return setError("Price must be 0 or above.");
    if (qty === "" || Number(qty) < 0)
      return setError("Quantity must be 0 or above.");

    setLoading(true);

    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      price: sanitizeNumber(price),
      qty: sanitizeNumber(qty),
    };

    try {
      if (existing) {
        await updateProduct({ ...productData, id: existing.id });
      } else {
        await addProduct(productData);
      }

      await refresh();
      close();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={
          theme === "dark"
            ? "bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md"
            : "bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md"
        }
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">
          {existing ? "Edit Product" : "Add New Product"}
        </h2>

        {error && (
          <div className="bg-red-200 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold mb-1">SKU</label>
            <input
              type="text"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              min="0"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Qty */}
          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              min="0"
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-all"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

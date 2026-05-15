"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Camera, ChevronDown, ArrowLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const categories = ["Road", "Electricity", "Water", "Waste", "Public Building"];

export default function ReportPage() {
  const router = useRouter();
  const [location, setLocation] = useState("Kumasi, Ghana");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleLocation = () => {
    setLocation((prev) =>
      prev === "Kumasi, Ghana" ? "Accra, Ghana" : "Kumasi, Ghana"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/track");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Report an Issue</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location
            </label>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
              <MapPin className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
              <span className="flex-1 text-gray-800 text-sm">{location}</span>
              <button
                type="button"
                onClick={toggleLocation}
                className="text-xs font-semibold text-blue-500 hover:text-blue-600"
              >
                Change
              </button>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Photo
            </label>
            <label className="flex flex-col items-center justify-center w-full h-36 bg-white rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors overflow-hidden">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Upload a photo
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          </div>

          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-left"
            >
              <span className={category ? "text-gray-800" : "text-gray-400"}>
                {category || "Select a category"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      category === cat
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the issue"
              rows={4}
              className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-500 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}

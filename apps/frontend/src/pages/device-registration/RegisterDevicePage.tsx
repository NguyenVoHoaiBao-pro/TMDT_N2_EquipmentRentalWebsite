import { Fragment, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { Button } from '@/shared_components/ui/button';

export default function RegisterDevicePage() {
  // Gom State tập trung để quản lý cho toàn bộ form
  const [condition, setCondition] = useState(95); // Mặc định 95% giống mẫu

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log('Submit registration data');
  };

  return (
    <Fragment>
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen bg-gray-50/50">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Register New Device</h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide the essential details to list your professional hardware on the EquipRent marketplace.
          </p>
        </div>

        {/* Form Layout: Grid 12 cột */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Cột trái: Checklist (Chiếm 3 cột trên desktop, dính cứng khi cuộn) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 order-2 lg:order-1">
            <div className="bg-white p-4 border rounded-xl shadow-sm">
              <h2 className="font-semibold text-sm text-slate-800 mb-3">Verification Checklist</h2>
              {/* Nơi render VerificationChecklist Component */}
              <div className="text-xs text-gray-400 italic">Checklist components loading...</div>
            </div>
          </aside>

          {/* Cột phải: Khối nhập liệu chính (Chiếm 9 cột) */}
          <div className="lg:col-span-9 space-y-6 order-1 lg:order-2">

            {/* Vùng chứa các Card nhập liệu (Identification, Terms, Uploads) */}
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Device Identification</h2>

              {/* Thử nghiệm Mockup Thanh trượt Trạng thái thiết bị */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Device Condition</label>
                  <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md">
                    Excellent ({condition}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={condition}
                  onChange={(e) => setCondition(Number(e.target.value))}
                  className="w-full accent-teal-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <button type="button" className="text-gray-500 hover:text-slate-800 text-sm font-medium transition">
                Save as Draft
              </button>
              <Button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium px-5 transition duration-200"
              >
                List Device for Approval &nbsp;➔
              </Button>
            </div>

          </div>
        </form>
      </main>

      <Footer />
      <BackToTop />
    </Fragment>
  );
}

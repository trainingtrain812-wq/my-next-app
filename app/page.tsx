"use client";

import { useState, useEffect, FormEvent } from "react";

// تعريف نوع المهمة
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState(""); // إذا كان اسم المتغير عندك newTask، قم بتغييره هنا
  const [loading, setLoading] = useState(true);

  // دالة جلب المهام من الـ API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'حدث خطأ أثناء جلب البيانات');
      }

      setTasks(result.data || []);
    } catch (error: any) {
      console.error("خطأ في جلب المهام:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // دالة إضافة مهمة جديدة عبر الـ API
  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return; // تأكد أن هذا يطابق اسم المتغير في useState

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title }), // إرسال العنوان للـ API
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة المهمة');
      }

      // إذا نجح الطلب، نفرغ الحقل ونعيد جلب المهام
      setTitle(""); 
      fetchTasks(); 
    } catch (error: any) {
      console.error("خطأ في إضافة المهمة:", error.message);
      alert("حدث خطأ أثناء إضافة المهمة: " + error.message);
    }
  };

  // جلب المهام عند تحميل الصفحة لأول مرة
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">قائمة المهام</h1>
      
      {/* نموذج إضافة مهمة */}
      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أضف مهمة جديدة..."
          className="border p-2 rounded flex-1 text-black"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          إضافة
        </button>
      </form>

      {/* عرض المهام */}
      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className="border p-3 rounded flex justify-between items-center bg-gray-50 text-black"
            >
              <span>{task.title}</span>
              <span>{task.completed ? "✅ مكتملة" : "⏳ قيد الانتظار"}</span>
            </li>
          ))}
          {tasks.length === 0 && <p className="text-gray-500">لا توجد مهام حالياً.</p>}
        </ul>
      )}
    </main>
  );
}
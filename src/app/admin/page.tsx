"use client";

import { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
  status: "pending" | "contacted" | "completed";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "completed">("all");

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth");
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchInquiries();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword("");
        fetchInquiries();
      } else {
        setLoginError(data.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setInquiries([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries");
      const data = await response.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    try {
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const getStatusBadge = (status: Inquiry["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    const labels = {
      pending: "대기중",
      contacted: "연락완료",
      completed: "상담완료",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredInquiries = filter === "all" ? inquiries : inquiries.filter((inq) => inq.status === filter);

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((inq) => inq.status === "pending").length,
    contacted: inquiries.filter((inq) => inq.status === "contacted").length,
    completed: inquiries.filter((inq) => inq.status === "completed").length,
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🏢</div>
              <h1 className="text-2xl font-bold text-gray-900">로켓콜 어드민</h1>
              <p className="text-gray-500 mt-2">관리자 비밀번호를 입력해주세요</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="비밀번호 입력"
                  required
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-3 rounded-xl font-bold transition-all duration-300"
              >
                {isLoggingIn ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                ← 랜딩페이지로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏢</span>
              <h1 className="text-2xl font-bold text-gray-900">로켓콜 어드민</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ← 랜딩페이지로
              </a>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-500 text-sm">전체 문의</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-500 text-sm">대기중</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">{stats.contacted}</div>
            <div className="text-gray-500 text-sm">연락완료</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-500 text-sm">상담완료</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "contacted", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "all" && "전체"}
              {status === "pending" && "대기중"}
              {status === "contacted" && "연락완료"}
              {status === "completed" && "상담완료"}
            </button>
          ))}
          <button
            onClick={fetchInquiries}
            className="ml-auto px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
          >
            🔄 새로고침
          </button>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">문의 내역이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      접수일시
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전화번호
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상담문의
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {inquiry.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {inquiry.message || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <select
                            value={inquiry.status}
                            onChange={(e) =>
                              updateStatus(inquiry.id, e.target.value as Inquiry["status"])
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            <option value="pending">대기중</option>
                            <option value="contacted">연락완료</option>
                            <option value="completed">상담완료</option>
                          </select>
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

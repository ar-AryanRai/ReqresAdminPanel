import React, { useEffect, useState } from "react";
import axios from "axios";
import { clearToken } from "../utils/auth";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");

  const fetchUsers = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${pageNum}`
      );
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (error) {
      setMessage("Error fetching users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://reqres.in/api/users/${editingUser.id}`,
        editingUser
      );
      setMessage("User updated successfully!");
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...editingUser } : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      setMessage("Error updating user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setMessage("User deleted successfully!");
    } catch (error) {
      setMessage("Error deleting user.");
    }
  };

  const logout = () => {
    clearToken();
    window.location.reload();
  };

  return (
    <div className="px-10 py-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">User List</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer active:scale-90"
        >
          Logout
        </button>
      </div>

      {message && (
        <p className="text-green-500 mb-4">
          {message}
          <span className="hidden">
            {setTimeout(() => setMessage(""), 3000)}
          </span>
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-100 p-4 rounded shadow">
              <img
                src={user.avatar}
                alt={user.email}
                className="rounded-full w-24 h-24 mx-auto"
              />
              <h3 className="text-center font-semibold mt-2">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-center text-sm">{user.email}</p>
              <div className="flex justify-around mt-3">
                <button
                  onClick={() => setEditingUser(user)}
                  className="text-blue-600 cursor-pointer bg-black/10 px-6 py-1 rounded active:scale-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 cursor-pointer active:scale-90 bg-black/10 px-6 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingUser && (
        <form
          onSubmit={handleEditSubmit}
          className="mt-6 bg-white p-4 rounded shadow max-w-md mx-auto"
        >
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>
          <input
            type="text"
            placeholder="First Name"
            value={editingUser.first_name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, first_name: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={editingUser.last_name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, last_name: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer active:scale-90 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="text-red-500 cursor-pointer active:scale-90"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-center mt-6">
        {/* {page !== 1 ? (
          <button
            onClick={() => fetchUsers(page - 1)}
            className="mx-2 px-3 py-1 bg-gray-300 rounded cursor-pointer active:scale-90 hover:bg-gray-400"
          >
            Prev
          </button>
        ) : null}
        <span className="px-3 py-1">Page {page}</span>
        {page !== totalPages ? (
          <button
            onClick={() => fetchUsers(page + 1)}
            className="mx-2 px-3 py-1 bg-gray-300 rounded cursor-pointer active:scale-90 hover:bg-gray-400"
          >
            Next
          </button>
        ) : null} */}

        <button
          disabled={page === 1}
          onClick={() => fetchUsers(page - 1)}
          className={`mx-2 px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-300 active:scale-90 hover:bg-gray-400 cursor-pointer"
          }`}
        >
          Prev
        </button>
        <span className="px-3 py-1">Page {page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => fetchUsers(page + 1)}
          className={` ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 cursor-pointer active:scale-90"
          } mx-2 px-3 py-1 bg-gray-300 rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;

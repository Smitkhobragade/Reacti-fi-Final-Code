import React, { useState } from "react";
import moment from "moment/moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TodoCard({ id, todoName, time, status }) {
  const [user] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoName, setEditedTodoName] = useState(todoName);

  const deleteTodo = (id) => {
    deleteDoc(doc(db, `user/${user.uid}/todos/${id}`))
      .then(() => {
        toast.success("Todo Deleted");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const toggleComplete = () => {
    updateDoc(doc(db, `user/${user.uid}/todos/${id}`), {
      status: !status, // Toggle completion status
      time: serverTimestamp(),
    })
      .then(() => {
        toast.success("Todo Status Updated");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const editTodo = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateDoc(doc(db, `user/${user.uid}/todos/${id}`), {
      todoName: editedTodoName,
      time: serverTimestamp(),
    })
      .then(() => {
        setIsEditing(false);
        toast.success("Todo Edited");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div
      className={`${
        status ? "bg-green-100" : "bg-red-100"
      } flex items-center justify-between max-w-lg p-3 rounded-lg mt-3 ml-5 shadow-md`}
    >
      <div>
        {isEditing ? (
          <input
            type="text"
            value={editedTodoName}
            onChange={(e) => setEditedTodoName(e.target.value)}
            className="border p-2 outline-none rounded-lg"
          />
        ) : (
          <>
            <p className="text-lg font-semibold">{todoName}</p>
            <p className="text-xs text-gray-500">
              {moment(time).format("LT")}
            </p>
          </>
        )}
      </div>

      <div>
        {isEditing ? (
          <button
            onClick={saveEdit}
            className="bg-blue-500 text-white text-sm font-bold rounded-lg p-2 hover:scale-110 transition-all duration-200 ease-in-out ml-3"
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={editTodo}
              className="bg-yellow-500 text-white text-sm font-bold rounded-lg p-2 hover:scale-110 transition-all duration-200 ease-in-out ml-3"
            >
              Edit
            </button>
            <button
              onClick={toggleComplete}
              className={`${
                status ? "bg-red-500" : "bg-green-500"
              } text-white text-sm font-bold rounded-lg p-2 hover:scale-110 transition-all duration-200 ease-in-out ml-3`}
            >
              {status ? "Mark Incomplete" : "Mark Complete"}
            </button>
            <button
              onClick={() => deleteTodo(id)}
              className="bg-red-500 text-white text-sm font-bold rounded-lg p-2 hover:scale-110 transition-all duration-200 ease-in-out ml-3"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoCard;

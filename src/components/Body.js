import React, { useEffect, useState } from "react";
import TodoCard from "./TodoCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Body() {
  const [addTodoModal, setAddTodoModal] = useState(false);
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, `user/${user?.uid}/todos`), orderBy("time", "desc")),
      (snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            todoName: doc.data().todoName,
            time: doc.data().time,
            status: doc.data().status,
          }))
        );
      }
    );

    return () => unsubscribe(); // Cleanup function
  }, [user]);

  const addTodo = (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      toast.error("Please enter a todo name"); // Notify user if input is empty
      return;
    }

    addDoc(collection(db, `user/${user?.uid}/todos`), {
      todoName: input,
      status: false,
      time: serverTimestamp(),
    })
      .then(() => {
        toast.success("Todo Added"); // Notify user on successful addition
        setInput(""); // Clear input after adding
        setAddTodoModal(false); // Close modal after adding
      })
      .catch((err) => toast.error(err.message)); // Notify user if there's an error
  };

  const cancelAddTodo = () => {
    setInput(""); // Clear input field
    setAddTodoModal(false); // Close modal
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-[80%] p-5">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <button
          onClick={() => setAddTodoModal(true)}
          className="bg-green-500 p-3 text-white text-sm font-bold rounded-lg hover:scale-110 transition-all duration-200 ease-in-out"
        >
          Add Todo
        </button>
      </div>

      {/* Todos */}
      <div className="w-full max-w-lg">
        {addTodoModal && (
          <div className="flex items-center justify-between mb-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Todo name"
              className="border p-2 flex-1 outline-none rounded-lg"
            />
            <button
              onClick={addTodo}
              className="bg-green-500 p-3 text-white text-sm font-bold rounded-lg hover:scale-110 transition-all duration-200 ease-in-out ml-3"
            >
              Add
            </button>
            <button
              onClick={cancelAddTodo}
              className="bg-red-500 p-3 text-white text-sm font-bold rounded-lg hover:scale-110 transition-all duration-200 ease-in-out ml-3"
            >
              Cancel
            </button>
          </div>
        )}

        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            id={todo.id}
            todoName={todo?.todoName}
            time={todo.time?.toDate().getTime()}
            status={todo?.status}
          />
        ))}
      </div>
    </div>
  );
}

export default Body;

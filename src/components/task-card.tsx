"use client";

import { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2Icon } from "lucide-react";
import * as React from "react";
import styles from './task-card.module.css';

export default function TaskCard({
  task,
  deleteTask,
  updateTask,
}: {
  task: Task;
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}) {
  const [mouseIsOver, setMouseIsOver] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.cardEditMode}
      >
        <textarea
          className={styles.textarea}
          value={task.content}
          autoFocus
          placeholder="Enter task content"
          onBlur={toggleEditMode}
          onKeyDown={(e) => e.key === "Enter" && e.shiftKey && toggleEditMode()}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.cardDragging}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.card}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
    >
      <p className={styles.content}>
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className={styles.deleteButton}
          onClick={() => deleteTask(task.id)}
        >
          <Trash2Icon className={styles.icon} />
        </button>
      )}
    </div>
  );
}

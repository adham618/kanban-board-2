"use client";

import TaskCard from "@/components/task-card";
import { Column, Task } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import styles from "./column-container.module.css";

export default function ColumnContainer({
  index,
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: {
  index: number;
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, title: string) => void;
  createTask: (columnId: string | number) => void;
  tasks: Task[];
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);
  const tasksId = React.useMemo(() => tasks.map((task) => task.id), [tasks]);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.container} ${styles.draggingContainer}`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.container}
    >
      <div
        {...attributes}
        {...listeners}
        className={styles.header}
        onClick={() => setEditMode(true)}
      >
        <div className="flex items-center gap-2">
          <div className={styles.index}>
            {index + 1}
          </div>
          {!editMode && (
            <h2 className={styles.title}>{column.title}</h2>
          )}
          {editMode && (
            <input
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              type="text"
              className={styles.input}
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className={styles.deleteButton}
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
      <div className={styles.tasksContainer}>
        {tasks.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No tasks added yet.</p>
          </div>
        )}
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        type="button"
        className={styles.addTaskButton}
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

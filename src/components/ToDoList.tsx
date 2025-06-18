"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import TaskDialog from "./TaskDialog";

function ToDoList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFromQuery = searchParams.get("status") as
    | "all"
    | "pending"
    | "in_progress"
    | "done"
    | null;

  const taskStatus = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "in_progress" | "done"
  >(statusFromQuery ?? "all");

  const utils = api.useUtils();
  const { data: tasks = [], isLoading } = api.task.getAll.useQuery();

  const createTask = api.task.create.useMutation({
    onSuccess: () => utils.task.getAll.invalidate(),
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      closeEditDialog();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      closeDeleteDialog();
    },
  });

  // Sincronizza stato con query param se cambia esternamente
  useEffect(() => {
    if (statusFromQuery && statusFromQuery !== selectedStatus) {
      setSelectedStatus(statusFromQuery);
    }
  }, [statusFromQuery]);

  const onChangeStatus = (value: string) => {
    if (
      value === "all" ||
      value === "pending" ||
      value === "in_progress" ||
      value === "done"
    ) {
      setSelectedStatus(value);
      const url = new URL(window.location.href);
      if (value === "all") {
        url.searchParams.delete("status");
      } else {
        url.searchParams.set("status", value);
      }
      router.replace(url.toString());
    }
  };

  const handleAddTask = () => {
    setAddDialogOpen(true);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    createTask.mutate({ title, description, status: "pending" });
    setTitle("");
    setDescription("");
    setAddDialogOpen(false);
  };

  const handleEdit = (task: (typeof tasks)[0]) => {
    setEditingTask({
      id: String(task.id),
      title: task.title,
      description: task.description ?? "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    updateTask.mutate({
      id: editingTask.id,
      title: editingTask.title,
      description: editingTask.description,
      status: selectedStatus === "all" ? "pending" : selectedStatus,
    });
  };

  const handleDelete = (id: string) => {
    setTaskToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!taskToDeleteId) return;
    deleteTask.mutate({ id: taskToDeleteId });
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setTitle("");
    setDescription("");
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTaskToDeleteId(null);
  };

  const filteredTasks =
    selectedStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-4 md:px-0 md:py-8 fixed bottom-0 md:sticky md:top-[3.75rem] z-10 self-center w-full bg-neutral-950 max-w-5xl">
        <div className="w-full order-2 md:order-1">
          <Tabs value={selectedStatus} onValueChange={onChangeStatus} className="h-12">
            <TabsList className="w-full h-full bg-neutral-800 rounded-2xl flex">
              {taskStatus.map((task) => (
                <TabsTrigger
                  key={task.value}
                  className="hover:cursor-pointer rounded-2xl text-white data-[state=active]:bg-purple-800 flex-1"
                  value={task.value}
                >
                  {task.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Button
          className="hover:cursor-pointer bg-purple-800 hover:bg-purple-600 rounded-full md:rounded-2xl self-end md:self-auto order-1 md:order-2 md:h-12"
          onClick={handleAddTask}
        >
          <span className="hidden md:block">Add Task</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 order-1 md:order-2 mt-8 md:mt-0 md:mb-8 mb-28">
        {isLoading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full text-center">No tasks :(</div>
        ) : (
          filteredTasks.map((task) => (
            <div className="break-inside-avoid mb-4" key={task.id}>
              <Card
                key={task.id}
                className="gap-y-2 py-4 rounded-2xl bg-neutral-900 border-2 border-neutral-800 text-neutral-50 w-full"
              >
                <CardContent>
                  <p className="text-lg font-semibold break-words">
                    {task.title}
                  </p>
                </CardContent>
                <CardContent>
                  <p className="break-words">{task.description || ""}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-2">
                  <Select
                    value={task.status}
                    onValueChange={(status) =>
                      updateTask.mutate({
                        id: String(task.id),
                        title: task.title,
                        description: task.description ?? "",
                        status: status as "pending" | "in_progress" | "done",
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full hover:cursor-pointer rounded-2xl border-neutral-800          
                      ${
                        task.status === "pending"
                          ? "bg-yellow-600 text-neutral-50 font-semibold hover:bg-yellow-500"
                          : task.status === "in_progress"
                          ? "bg-sky-600 text-neutral-50 font-semibold hover:bg-sky-500"
                          : "bg-green-700 text-neutral-50 font-semibold hover:bg-green-600"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-neutral-800 text-neutral-50 border-neutral-800">
                      {taskStatus
                        .filter((task) => task.value !== "all")
                        .map((task, index) => (
                          <SelectItem
                            key={index}
                            value={task.value}
                            className="rounded-2xl hover:cursor-pointer"
                          >
                            {task.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="hover:cursor-pointer bg-purple-800 hover:bg-purple-600 rounded-2xl"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="hover:cursor-pointer bg-purple-800 hover:bg-purple-600 rounded-2xl"
                    size="sm"
                    onClick={() => handleDelete(String(task.id))}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
      </div>

      <TaskDialog
        type="add"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onConfirm={handleCreate}
        onCancel={closeAddDialog}
        loading={createTask.isPending}
      />

      <TaskDialog
        type="edit"
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editingTask?.title || ""}
        description={editingTask?.description || ""}
        onTitleChange={(val) => setEditingTask({ ...editingTask!, title: val })}
        onDescriptionChange={(val) =>
          setEditingTask({ ...editingTask!, description: val })
        }
        onConfirm={handleSaveEdit}
        onCancel={closeEditDialog}
        loading={updateTask.isPending}
      />

      <TaskDialog
        type="delete"
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
        loading={deleteTask.isPending}
      />
    </div>
  );
}

export default ToDoList;

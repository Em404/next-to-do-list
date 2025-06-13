"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/trpc/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

function Task() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFromQuery = searchParams.get("status") as
    | "all"
    | "pending"
    | "in_progress"
    | "done"
    | null;

  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "in_progress" | "done"
  >(statusFromQuery ?? "all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

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

  const onChangeStatus = (
    value: "all" | "pending" | "in_progress" | "done"
  ) => {
    setSelectedStatus(value);
    const url = new URL(window.location.href);
    if (value === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", value);
    }
    router.replace(url.toString());
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    createTask.mutate({ title, description, status: "pending" });
    setTitle("");
    setDescription("");
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
      status: selectedStatus === "all" ? "pending" : selectedStatus, // mantiene lo status selezionato o default pending
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

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTaskToDeleteId(null);
  };

  // Filtra i task da mostrare in base a selectedStatus
  const filteredTasks =
    selectedStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold py-4 sticky top-0 bg-white z-10">
        Task List
      </h1>

      <div>
        {/* cards for tasks */}
        <div className="grid gap-4 overflow-y-auto">
          {isLoading ? (
            <div className="col-span-full text-center">Loading...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full text-center">No tasks</div>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`
          transition-colors
          ${
            task.status === "pending"
              ? "bg-yellow-100 hover:bg-yellow-200"
              : task.status === "in_progress"
              ? "bg-blue-100 hover:bg-blue-200"
              : "bg-green-100 hover:bg-green-200"
          }
        `}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">
                    {task.description || ""}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
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
                    <SelectTrigger className="w-full hover:cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="hover:cursor-pointer"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="hover:cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(String(task.id))}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 ">
        {/* Form new task */}
        <div className="space-y-6 mb-8 order-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-center md:justify-end">
            <Button
              className="hover:cursor-pointer w-full md:w-auto"
              onClick={handleCreate}
              disabled={createTask.isPending}
            >
              Add Task
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedStatus} onValueChange={onChangeStatus}>
          <TabsList
            className={`w-full
                  ${selectedStatus === "pending" ? "bg-yellow-100" : ""}
                  ${selectedStatus === "in_progress" ? "bg-blue-100" : ""}
                  ${selectedStatus === "done" ? "bg-green-100" : ""}
                `}
          >
            <TabsTrigger className="hover:cursor-pointer" value="all">
              All
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="in_progress">
              In Progress
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="done">
              Done
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Dialog modifica */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-2 py-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
              />
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={closeEditDialog}
            >
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer"
              onClick={handleSaveEdit}
              disabled={updateTask.isPending}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog eliminazione */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this task? This action is
            irreversible.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={closeDeleteDialog}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={confirmDelete}
              disabled={deleteTask.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Task;

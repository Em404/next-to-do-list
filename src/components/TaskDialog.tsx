import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type DialogType = "add" | "edit" | "delete";

interface TaskDialogProps {
  type: DialogType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TaskDialog({
  type,
  open,
  onOpenChange,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onConfirm,
  onCancel,
  loading = false,
}: TaskDialogProps) {
  const isAdd = type === "add";
  const isEdit = type === "edit";
  const isDelete = type === "delete";

  const dialogTitle = isAdd
    ? "Add new Task"
    : isEdit
    ? "Edit Task"
    : "Confirm Deletion";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 text-neutral-50 border-neutral-800 selection:bg-neutral-50">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {(isAdd || isEdit) && (
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <textarea
                id="title"
                value={title}
                onChange={(e) => onTitleChange?.(e.target.value)}
                placeholder="Enter task title"
                className="rounded-2xl selection:bg-neutral-50 selection:text-neutral-950 break-words w-full p-2 border-2 border-neutral-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
                placeholder="Optional description"
                className="rounded-2xl selection:bg-neutral-50 selection:text-neutral-950 break-words w-full p-2 border-2 border-neutral-800"
              />
            </div>
          </div>
        )}

        {isDelete && (
          <p>
            Are you sure you want to delete this task? This action is
            irreversible.
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            className="hover:cursor-pointer bg-transparent hover:bg-neutral-700 hover:text-neutral-50 rounded-2xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`hover:cursor-pointer rounded-2xl ${
              isDelete
                ? "bg-red-500 hover:bg-red-400 text-white"
                : "bg-purple-800 hover:bg-purple-600 text-white w-full md:w-auto"
            }`}
          >
            {isAdd && (
              <>
                Add Task <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </>
            )}
            {isEdit && "Save changes"}
            {isDelete && "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

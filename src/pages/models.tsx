import React, { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { ModelTable } from "../components/Model/model-table";
import type { Model } from "../components/Model/model-table";
import { AddModelForm } from "../components/Model/add-model-form";
import Loader from "../components/ui/loader";
import { toast } from "sonner";
import {
  useGetAllModels,
  useGetDevices,
  useAddModel,
  useUpdateModel,
  useDeleteModel,
} from '../service/api';
import type { ModelFormValues } from "../components/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const Models: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

  // API hooks
  const { data: models = [], isLoading: modelsLoading } = useGetAllModels();
  const { data: devices = [], isLoading: devicesLoading } = useGetDevices();
  const addModel = useAddModel();
  const updateModel = useUpdateModel();
  const deleteModel = useDeleteModel();

  const isLoading = modelsLoading || devicesLoading;

  const handleAdd = () => {
    setEditingModel(null);
    setSheetOpen(true);
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setSheetOpen(true);
  };

  const handleFormSubmit = (data: ModelFormValues) => {
    if (editingModel) {
      // Edit mode
      updateModel.mutate(
        {
          id: editingModel.id,
          deviceId: data.deviceId,
          modelName: data.modelName,
        },
        {
          onSuccess: () => {
            toast.success("Model updated successfully");
            setSheetOpen(false);
            setEditingModel(null);
          },
          onError: (error: any) => {
            const errorMessage = error?.message || error?.info?.message || "Failed to update model";
            toast.error(errorMessage);
          },
        }
      );
    } else {
      // Add mode
      addModel.mutate(
        {
          deviceId: data.deviceId,
          modelName: data.modelName,
        },
        {
          onSuccess: () => {
            toast.success("Model added successfully");
            setSheetOpen(false);
          },
          onError: (error: any) => {
            const errorMessage = error?.message || error?.info?.message || "Failed to add model";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const handleToggle = (model: Model) => {
    if (model && model.id) {
      // Toggle isActive
      const newIsActive = !model.isActive;
      updateModel.mutate(
        {
          id: model.id,
          isActive: newIsActive,
        },
        {
          onSuccess: () => {
            toast.success(
              newIsActive ? "Model enabled successfully" : "Model disabled successfully"
            );
          },
          onError: (error: any) => {
            const errorMessage = error?.message || error?.info?.message || "Failed to update model status";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const handleDelete = (model: Model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (modelToDelete && modelToDelete.id) {
      deleteModel.mutate(modelToDelete.id, {
        onSuccess: () => {
          toast.success("Model deleted successfully");
          setDeleteDialogOpen(false);
          setModelToDelete(null);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to delete model";
          toast.error(errorMessage);
        },
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <ModelTable
          models={models}
          devices={devices}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <AddModelForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setSheetOpen(false);
              setEditingModel(null);
            }}
            defaultValues={
              editingModel
                ? {
                    deviceId: String(editingModel.deviceId),
                    modelName: editingModel.modelName,
                  }
                : undefined
            }
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete <strong>{modelToDelete?.modelName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Models;

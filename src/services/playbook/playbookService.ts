import { useMutation, useQuery, useQueryClient } from "react-query";
import { batchApiClient } from "../core/batchApi";
import { useCallback } from "react";

export type Playbook = {
  id: string;
  title: string;
  description: string;
  owners: string;
  schema: string;
  githubRepo: string;
  createdAt: Date;
  updatedAt: Date;
}

const PLAYBOOK_API_ENDPOINT = "/api/playbooks";

export const usePlaybook = () => {
  const queryClient = useQueryClient();

  const { data: playbooks, isLoading, isError, error, refetch } = useQuery<Playbook[]>({
    queryKey: ["playbooks"],
    queryFn: () => batchApiClient.get<Playbook[]>(PLAYBOOK_API_ENDPOINT) as Promise<Playbook[]>
  })

  const createPlaybookMutation = useMutation({
    mutationFn: (playbook: Playbook) => batchApiClient.post(PLAYBOOK_API_ENDPOINT, playbook) as Promise<Playbook[]>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbooks"] });
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: (playbook: Playbook) =>
      batchApiClient.put<Playbook>(`${PLAYBOOK_API_ENDPOINT}/${playbook.id}`, playbook) as Promise<Playbook>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (playbookId: number) =>
      batchApiClient.delete<void>(`${PLAYBOOK_API_ENDPOINT}/${playbookId}`) as Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createPlaybook = useCallback((playbook: Playbook) => {
    createPlaybookMutation.mutate(playbook);
  }, [createPlaybookMutation]);

  const updatePlaybook = useCallback(
    (playbook: Playbook) => {
      updateUserMutation.mutate(playbook);
    },
    [updateUserMutation]
  );

  const deletePlaybook = useCallback(
    (playbookId: number) => {
      deleteUserMutation.mutate(playbookId);
    },
    [deleteUserMutation]
  );

  return {
    playbooks,
    isLoading,
    isError,
    error,
    createPlaybook,
    updatePlaybook,
    deletePlaybook,
    refetch,
    isCreateLoading: createPlaybookMutation.isLoading,
    isUpdateLoading: updateUserMutation.isLoading,
    isDeleteLoading: deleteUserMutation.isLoading,
    isCreateError: createPlaybookMutation.isError,
    isUpdateError: updateUserMutation.isError,
    isDeleteError: deleteUserMutation.isError,
    createError: createPlaybookMutation.error,
    updateError: updateUserMutation.error,
    deleteError: deleteUserMutation.error
  }
}
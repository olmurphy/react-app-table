import { useMutation, useQuery, useQueryClient } from "react-query";
import { batchApiClient } from "../core/batchApi";
import { useCallback } from "react";

export type Playbook = {
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

  const createPlaybook = useCallback((playbook: Playbook) => {
    createPlaybookMutation.mutate(playbook);
  }, [createPlaybookMutation]);

  return {
    playbooks,
    isLoading,
    isError,
    error,
    refetch,
    createPlaybook,
  }
}
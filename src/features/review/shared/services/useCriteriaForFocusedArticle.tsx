// External library
import useSWR from "swr";

// Hooks
import useToaster from "@components/feedback/Toaster";

// Service
import Axios from "../../../../infrastructure/http/axiosClient";

// Types
interface HttpResponse {
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

interface CriteriaForFocusedArticleProps {
  articleId: number;
}

export default function useFetchCriteriaForFocusedArticle({
  articleId,
}: CriteriaForFocusedArticleProps) {
  const id = localStorage.getItem("systematicReviewId");
  const toast = useToaster();

  const path =
    id && articleId
      ? `systematic-study/${id}/report/study-review/${articleId}/criteria`
      : null;

  const { data, isLoading, error, mutate } = useSWR(path, fetchAllCriteria, {
    revalidateOnFocus: false,
    onError: () => {
      toast({
        title: "Erro ao carregar critérios",
        description:
          "Não foi possível buscar os critérios deste artigo. Os dados exibidos podem estar desatualizados.",
        status: "error",
      });
    },
  });

  async function fetchAllCriteria() {
    try {
      if (!path) return;
      const response = await Axios.get<HttpResponse>(path);
      return response.data;
    } catch (error) {
      console.error("Error fetching criteria", error);
      throw error;
    }
  }

  return {
    criteria: data,
    mutate,
    isLoading,
    error,
  };
}

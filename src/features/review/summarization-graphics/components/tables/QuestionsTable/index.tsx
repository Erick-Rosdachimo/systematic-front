import { Box } from "@chakra-ui/react";
import { ColumnDef, GenericExpandedTable } from "../ChartTable/GenericExpandedTable";
import { useTranslation } from "react-i18next";

type QuestionRow = {
  answer: string;
  studies: string;
  total: number;
  percentage: number;
};

interface QuestionsTableProps {
  data: Record<string, number[]>;
}

export const QuestionsTable = ({ data }: QuestionsTableProps) => {
  const { t } = useTranslation("review/summarization-graphics");

  const totalResponses = Object.values(data).reduce((sum, ids) => sum + ids.length, 0);

  const rows: QuestionRow[] = Object.entries(data)
    .filter(([_, ids]) => ids.length > 0)
    .map(([answer, ids]) => ({
      answer,
      studies: ids.join(", "),
      total: ids.length,
      percentage: (ids.length / totalResponses) * 100, 
    }));

  const columns: ColumnDef<QuestionRow>[] = [
    { key: "answer", label: t("questionsTable.answer"), width: "30%", sortable: true },
    { key: "studies", label: t("questionsTable.studies"), width: "40%", sortable: true, isNumeric: true, render: (row) => row.studies },
    { key: "total", label: t("questionsTable.total"), width: "15%", isNumeric: true, sortable: true },
    { key: "percentage", label: t("questionsTable.percentage"), width: "15%", isNumeric: true, sortable: true, render: (row) => row.percentage.toFixed(2) + "%" },
  ];

  return (
    <Box w="100%" display="block">
      <GenericExpandedTable<QuestionRow> data={rows} columns={columns} />
    </Box>
  );
};
import { Box } from "@chakra-ui/react";
import { QuestionsCharts } from "../../QuestionsCharts";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
  selectedQuestionId?: string;
  columnsVisible: ColumnVisibility;
};

export default function FormQuestionsRenderer({
  filteredStudies,
  type,
  selectedQuestionId,
  chartId,
  columnsVisible
}: Props) {
  return (
    <Box 
      id={chartId}
      w="100%"
      display="block" 
      pt={4} 
      pb={10}
    >
      <QuestionsCharts
        filteredStudies={filteredStudies as ArticleInterface[]}
        type={type}
        selectedQuestionId={selectedQuestionId}
        columnsVisible={columnsVisible}
      />
    </Box>
  );
}
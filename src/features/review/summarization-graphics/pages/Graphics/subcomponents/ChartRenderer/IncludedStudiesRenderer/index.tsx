import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import LayoutFactoryChart from "@features/review/summarization-graphics/components/tables/ChartTable/LayoutFactoryChart";
import { IncludedStudiesLineChart } from "../../IncludedStudiesLineChart";
import BubbleChart from "@features/review/summarization-graphics/components/charts/BubbleChart";
import useBubbleDataGeneric, { BubbleItem } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Props = {
  filteredStudies: (StudyInterface | ArticleInterface)[];
  type: string;
  chartId: string;
};

export default function IncludedStudiesRenderer({ filteredStudies, type, chartId}: Props) {
  const { t } = useTranslation("review/summarization-graphics");
  const includedStudies = filteredStudies.filter((s) => s.extractionStatus === "INCLUDED");

  // 👇 Criamos as variáveis pra saber quem tá na tela
  const isTable = type === "Table" || type === "Tabela";
  const isBubble = type === "Bubble Chart" || type === "Gráfico de Bolhas";

  let content;
  
  if (isTable) {
    content = (
      <Box w="100%">
        <LayoutFactoryChart articles={includedStudies as ArticleInterface[]} isLoading={false} />
      </Box>
    );
  } else if (type === "Line Chart" || type === "Gráfico de Linhas") {
    content = (
      // 👇 Armadura de 100% pro Line Chart não virar um palito de dente!
      <Box w="100%">
        <IncludedStudiesLineChart filteredStudies={includedStudies} />
      </Box>
    );
  } else if (isBubble) {
    const items: BubbleItem[] = includedStudies.flatMap(study => 
      study.searchSources.map(src => ({ x: Number(study.year), group: src, y: 1 }))
    );
    const { series, yCategories } = useBubbleDataGeneric(items);
    content = (
      <BubbleChart
        title="Search Sources Evolution"
        series={series}            
        yCategories={yCategories}  
        yaxisText="Search Sources"
      />
    );
  } else {
    content = <div>{t("typeNotSupported")}</div>;
  }

  return (
    // 👇 O Palco Padrão Ouro que criamos antes!
    <Box 
      id={chartId}
      w="100%"
      minH={isTable ? "auto" : "1000px"} // Mantive seus 1000px de altura pros gráficos
      display="flex"
      justifyContent="center" 
      alignItems={isTable ? "flex-start" : "center"} // Tabela pro topo, gráfico pro meio  
      pt={isTable ? 4 : 24} // Empurrãozinho pra descolar os gráficos do teto
      pb={10}
    >
      <Box 
        w="100%" 
        maxW={isBubble ? "1600px" : "1200px"} // Bubble ganha tela quase toda, os outros 1200px
        display="flex" 
        justifyContent="center"
      > 
        {content}
      </Box>
    </Box>
  );
}
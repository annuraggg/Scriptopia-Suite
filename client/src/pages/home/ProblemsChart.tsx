import { useEffect } from "react";
import * as echarts from "echarts";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

const ProblemsChart = ({
  easy,
  medium,
  hard,
}: {
  easy: number;
  medium: number;
  hard: number;
}) => {
  useEffect(() => {
    const chartDom = document.getElementById("questionsChartsDashboard");
    const myChart = echarts.init(chartDom);
    const option = {
      color: ["#31d550", "#fea801", "#f94c4c"],
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Questions Solved",
          type: "pie",
          radius: ["70%", "80%"],
          padAngle: 10,
          itemStyle: {
            borderRadius: 20,
          },
          label: {
            show: false,
          },
          data: [
            { value: easy, name: "Easy" },
            { value: medium, name: "Medium" },
            { value: hard, name: "Hard" },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <>
      <Card className="w-full h-64 overflow-visible">
        <CardHeader className="flex items-center justify-center">
          Problems Solved
        </CardHeader>
        <CardBody className="flex items-center justify-center overflow-visible">
          <div
            id="questionsChartsDashboard"
            className=" w-full h-full absolute overflow-visible"
          >
            QuestionsChart
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ProblemsChart;

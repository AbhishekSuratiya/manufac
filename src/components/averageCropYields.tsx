import cropData, {CropDataType} from "../data/cropData.ts";
import {ReactECharts, ReactEChartsProps} from "./reactEChart.tsx";

type CropYields = {
  [cropName: string]: {
    totalYield: number;
    count: number;
  };
};

type CropAverageYield = [string, number]

function calculateAverageYields(data: CropDataType[]): CropAverageYield[] {
  const cropYields: CropYields = {};
  data.forEach((entry: CropDataType) => {
    const cropName = entry["Crop Name"];
    let yieldValue = entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
    if (yieldValue === '') yieldValue = 0;

    if (!cropYields[cropName]) {
      cropYields[cropName] = {totalYield: 0, count: 0};
    }
    if (typeof yieldValue === "number") {
      cropYields[cropName].totalYield += yieldValue;
      cropYields[cropName].count += 1;
    }
  });
  return Object.entries(cropYields).map(([cropName, stats]) => ([
    cropName,
    Math.round(stats.totalYield / stats.count)
  ]));
}


const AverageCropYields = () => {
  const result = calculateAverageYields(cropData);

  const option: ReactEChartsProps["option"] = {
    dataset: {
      source: result
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {},
    },
    grid: {
      left: "10%",
      right: "10%",
      top: "10%",
      bottom: "10%",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
      },
    ],
  }

  return <ReactECharts option={option}/>
}

export default AverageCropYields;
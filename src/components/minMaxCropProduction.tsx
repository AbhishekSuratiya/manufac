import cropData, {CropDataType} from "../data/cropData.ts";
import {Table} from '@mantine/core';

type MaxMinResult = {
  year: string;
  max: { "Crop Name": string; production: number } | null;
  min: { "Crop Name": string; production: number } | null;
};

const findMaxMinProductionByYear = (data: CropDataType[]): MaxMinResult[] => {
  const groupedByYear = data.reduce((acc: Record<string, CropDataType[]>, crop) => {
    const year = crop.Year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(crop);
    return acc;
  }, {});

  return Object.entries(groupedByYear).map(([year, crops]) => {
    const filteredCrops = crops.filter(crop => crop["Crop Production (UOM:t(Tonnes))"] !== "");

    if (filteredCrops.length === 0) return {year, max: null, min: null};

    const maxCrop = filteredCrops.reduce((max, crop) => {
      const production = parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string) || 0;
      return production > (parseFloat(max["Crop Production (UOM:t(Tonnes))"] as string) || 0) ? crop : max;
    });

    const minCrop = filteredCrops.reduce((min, crop) => {
      const production = parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string) || 0;
      return production < (parseFloat(min["Crop Production (UOM:t(Tonnes))"] as string) || 0) ? crop : min;
    });

    return {
      year,
      max: {
        "Crop Name": maxCrop["Crop Name"],
        production: parseFloat(maxCrop["Crop Production (UOM:t(Tonnes))"] as string)
      },
      min: {
        "Crop Name": minCrop["Crop Name"],
        production: parseFloat(minCrop["Crop Production (UOM:t(Tonnes))"] as string)
      },
    };
  });
};

const MinMaxCropProduction = () => {
  const data = findMaxMinProductionByYear(cropData)
  const rows = data.map((row: MaxMinResult) => (
    <Table.Tr key={row.year}>
      <Table.Td>{row.year.match(/\b\d{4}\b/)?.[0]}</Table.Td>
      <Table.Td>{`${row.max?.["Crop Name"]} / ${row.max?.production} Tonnes`}</Table.Td>
      <Table.Td>{`${row.min?.["Crop Name"]} / ${row.min?.production} Tonnes`}</Table.Td>
    </Table.Tr>
  ));

  return <div style={{height: '500px', overflow: 'scroll'}}>
    <Table
      stickyHeader verticalSpacing="sm" striped highlightOnHover withTableBorder
      withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>Maximum Production / (in Tonnes)</Table.Th>
          <Table.Th>Minimum Production / (in Tonnes)</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  </div>
}

export default MinMaxCropProduction;
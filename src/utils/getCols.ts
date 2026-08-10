import {
  weekWidth,
  dayWidth,
  outsideWrapperId,
  leftColumnWidth,
  screenWidthMultiplier,
  zoom2ColumnWidth
} from "@/constants";

export const getCols = (zoom: number): number => {
  const wrapperWidth = document.getElementById(outsideWrapperId)?.clientWidth || 0;
  const componentWidth = wrapperWidth - leftColumnWidth;
  let ceiledValue = 0;

  switch (zoom) {
    case 1:
      return Math.ceil(componentWidth / dayWidth) * screenWidthMultiplier;
    case 2:
      return Math.ceil(componentWidth / zoom2ColumnWidth) * screenWidthMultiplier;
    default:
      ceiledValue = Math.ceil((componentWidth / weekWidth) * screenWidthMultiplier);
      return ceiledValue % 2 === 0 ? ceiledValue : ceiledValue + 1;
  }
};

export const getVisibleCols = (zoom: number): number => getCols(zoom) / screenWidthMultiplier;

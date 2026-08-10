import { leftColumnWidth, outsideWrapperId, screenWidthMultiplier } from "@/constants";

export const getCanvasWidth = (): number => {
  const wrapperWidth = document.getElementById(outsideWrapperId)?.clientWidth || 0;

  return (wrapperWidth - leftColumnWidth) * screenWidthMultiplier;
};

import type { JSX } from "react";
import { PaginatedSchedulerData, SchedulerProjectData, TileMoveData } from "@/types/global";

export type TilesProps = {
  zoom: number;
  data: PaginatedSchedulerData;
  onTileClick?: (data: SchedulerProjectData) => void;
  onTileMove?: (data: TileMoveData) => void;
};

export type PlacedTiles = JSX.Element[];

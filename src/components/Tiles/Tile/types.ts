import { SchedulerProjectData } from "@/types/global";

export type TileProps = {
  row: number;
  data: SchedulerProjectData;
  zoom: number;
  onTileClick?: (data: SchedulerProjectData) => void;
  /**
   * When true, the tile can be dragged to reschedule it (an ancestor is
   * expected to handle the drop and call the consumer's onTileMove)
   */
  draggable?: boolean;
};

export type StyledTextProps = {
  $bold?: boolean;
};

import dayjs from "dayjs";
import { DragEvent, JSX, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { drawGrid } from "@/utils/drawGrid/drawGrid";
import { boxHeight, canvasWrapperId, leftColumnWidth, outsideWrapperId } from "@/constants";
import { Loader, Tiles } from "@/components";
import { useCalendar } from "@/context/CalendarProvider";
import { resizeCanvas } from "@/utils/resizeCanvas";
import { getCanvasWidth } from "@/utils/getCanvasWidth";
import { getCellRangeRect, resolveGridCell } from "@/utils/resolveGridCell";
import { getCellTimeUnit } from "@/utils/zoomUnits";
import { GridProps } from "./types";
import { StyledCanvas, StyledInnerWrapper, StyledSelectedCell, StyledSpan, StyledWrapper } from "./styles";

type DragSelection = {
  resourceIndex: number;
  anchorDate: Date;
  currentDate: Date;
};

export function Grid({
  zoom,
  rows,
  data,
  onTileClick,
  onCellClick,
  onCellRangeSelect,
  onTileMove,
  selectedCell,
  ref
}: GridProps & { ref?: React.Ref<HTMLDivElement> }): JSX.Element {
  const { handleScrollNext, handleScrollPrev, date, isLoading, cols, startDate, navigation } =
    useCalendar();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLSpanElement | null>(null);
  const refLeft = useRef<HTMLSpanElement | null>(null);
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);
  const dragSelectionRef = useRef<DragSelection | null>(null);

  const updateDragSelection = useCallback((next: DragSelection | null) => {
    dragSelectionRef.current = next;
    setDragSelection(next);
  }, []);

  const setInnerRef = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

  const theme = useTheme();

  const rowsPerPerson = data.map((person) => Math.max(person.data.length, 1));

  const highlightRect = dragSelection
    ? getCellRangeRect(
        startDate,
        rowsPerPerson,
        dragSelection.resourceIndex,
        dragSelection.anchorDate,
        dragSelection.currentDate,
        zoom
      )
    : selectedCell
      ? getCellRangeRect(
          startDate,
          rowsPerPerson,
          data.findIndex((person) => person.id === selectedCell.resourceId),
          selectedCell.startDate,
          selectedCell.endDate,
          zoom
        )
      : null;

  const resolveCell = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const { left, top } = canvas.getBoundingClientRect();
      return resolveGridCell(startDate, { x: clientX - left, y: clientY - top }, rowsPerPerson, zoom);
    },
    [rowsPerPerson, startDate, zoom]
  );

  const handleCanvasMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!onCellClick && !onCellRangeSelect) return;
      const cell = resolveCell(e.clientX, e.clientY);
      if (!cell || !data[cell.resourceIndex]) return;
      updateDragSelection({ resourceIndex: cell.resourceIndex, anchorDate: cell.date, currentDate: cell.date });
    },
    [data, onCellClick, onCellRangeSelect, resolveCell, updateDragSelection]
  );

  const isDragSelecting = dragSelection !== null;

  useEffect(() => {
    if (!isDragSelecting) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const current = dragSelectionRef.current;
      const cell = resolveCell(e.clientX, e.clientY);
      if (!cell || !current) return;
      updateDragSelection({ ...current, currentDate: cell.date });
    };

    const handleMouseUp = () => {
      const current = dragSelectionRef.current;
      updateDragSelection(null);
      if (!current) return;

      const resource = data[current.resourceIndex];
      if (!resource) return;

      const [start, end] =
        current.anchorDate.getTime() <= current.currentDate.getTime()
          ? [current.anchorDate, current.currentDate]
          : [current.currentDate, current.anchorDate];

      if (start.getTime() === end.getTime()) {
        onCellClick?.({ resourceId: resource.id, date: start });
      } else {
        onCellRangeSelect?.({ resourceId: resource.id, startDate: start, endDate: end });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragSelecting, data, onCellClick, onCellRangeSelect, resolveCell, updateDragSelection]);

  const handleDragOver = useCallback((e: DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLCanvasElement>) => {
      if (!onTileMove) return;
      e.preventDefault();
      const payload = e.dataTransfer.getData("application/json");
      if (!payload) return;

      const { id: tileId, grabOffset }: { id: string; grabOffset: number } = JSON.parse(payload);

      let previousResourceId: string | undefined;
      let duration = 0;
      for (const person of data) {
        for (const row of person.data) {
          const project = row.find((p) => p.id === tileId);
          if (project) {
            previousResourceId = person.id;
            duration = project.endDate.getTime() - project.startDate.getTime();
            break;
          }
        }
        if (previousResourceId) break;
      }
      if (!previousResourceId) return;

      const cell = resolveCell(e.clientX, e.clientY);
      const resource = cell && data[cell.resourceIndex];
      if (!cell || !resource) return;

      const newStartDate = dayjs(cell.date).subtract(grabOffset, getCellTimeUnit(zoom)).toDate();

      onTileMove({
        id: tileId,
        previousResourceId,
        resourceId: resource.id,
        startDate: newStartDate,
        endDate: new Date(newStartDate.getTime() + duration)
      });
    },
    [data, onTileMove, resolveCell, zoom]
  );

  const handleResize = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const width = getCanvasWidth();
      const height = rows * boxHeight + 1;
      resizeCanvas(ctx, width, height);
      drawGrid(ctx, zoom, rows, cols, startDate, theme);
    },
    [cols, startDate, rows, zoom, theme]
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    canvas.style.letterSpacing = "1px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const observer = new ResizeObserver(() => {
      handleResize(ctx);
    });

    observer.observe(wrapper);
    handleResize(ctx);

    return () => observer.disconnect();
  }, [handleResize, date, rows, zoom]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !navigation) return;

    el.classList.remove("slide-next", "slide-prev");
    void el.offsetWidth;
    el.classList.add(navigation.direction === "next" ? "slide-next" : "slide-prev");
  }, [navigation]);

  useEffect(() => {
    if (!refRight.current) return;
    const observerRight = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollNext() : null),
      { root: document.getElementById(outsideWrapperId) }
    );
    observerRight.observe(refRight.current);

    return () => observerRight.disconnect();
  }, [handleScrollNext]);

  useEffect(() => {
    if (!refLeft.current) return;
    const observerLeft = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollPrev() : null),
      {
        root: document.getElementById(outsideWrapperId),
        rootMargin: `0px 0px 0px -${leftColumnWidth}px`
      }
    );
    observerLeft.observe(refLeft.current);

    return () => observerLeft.disconnect();
  }, [handleScrollPrev]);

  return (
    <StyledWrapper id={canvasWrapperId} ref={wrapperRef}>
      <StyledInnerWrapper ref={setInnerRef}>
        <StyledSpan position="left" ref={refLeft} />
        <Loader isLoading={isLoading} position="left" />
        <StyledCanvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onDragOver={onTileMove ? handleDragOver : undefined}
          onDrop={onTileMove ? handleDrop : undefined}
        />
        <Tiles data={data} zoom={zoom} onTileClick={onTileClick} onTileMove={onTileMove} />
        {highlightRect && (
          <StyledSelectedCell
            style={{
              left: `${highlightRect.x}px`,
              top: `${highlightRect.y}px`,
              width: `${highlightRect.width}px`,
              height: `${highlightRect.height}px`
            }}
          />
        )}
        <StyledSpan ref={refRight} position="right" />
        <Loader isLoading={isLoading} position="right" />
      </StyledInnerWrapper>
    </StyledWrapper>
  );
}

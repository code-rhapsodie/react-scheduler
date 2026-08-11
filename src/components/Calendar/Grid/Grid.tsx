import { JSX, useCallback, useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import { drawGrid } from "@/utils/drawGrid/drawGrid";
import { boxHeight, canvasWrapperId, leftColumnWidth, outsideWrapperId } from "@/constants";
import { Loader, Tiles } from "@/components";
import { useCalendar } from "@/context/CalendarProvider";
import { resizeCanvas } from "@/utils/resizeCanvas";
import { getCanvasWidth } from "@/utils/getCanvasWidth";
import { GridProps } from "./types";
import { StyledCanvas, StyledInnerWrapper, StyledSpan, StyledWrapper } from "./styles";

export function Grid({
  zoom,
  rows,
  data,
  onTileClick,
  ref
}: GridProps & { ref?: React.Ref<HTMLDivElement> }): JSX.Element {
  const { handleScrollNext, handleScrollPrev, date, isLoading, cols, startDate } = useCalendar();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLSpanElement | null>(null);
  const refLeft = useRef<HTMLSpanElement | null>(null);

  const theme = useTheme();

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
      <StyledInnerWrapper ref={ref}>
        <StyledSpan position="left" ref={refLeft} />
        <Loader isLoading={isLoading} position="left" />
        <StyledCanvas ref={canvasRef} />
        <Tiles data={data} zoom={zoom} onTileClick={onTileClick} />
        <StyledSpan ref={refRight} position="right" />
        <Loader isLoading={isLoading} position="right" />
      </StyledInnerWrapper>
    </StyledWrapper>
  );
}

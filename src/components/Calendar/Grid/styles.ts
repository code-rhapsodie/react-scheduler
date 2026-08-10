import styled, { IStyledComponent } from "styled-components";
import { StyledSpanProps } from "./types";

export const StyledWrapper: IStyledComponent<any, any> = styled.div`
  height: calc(100vh - headerHeight);
`;

export const StyledInnerWrapper: IStyledComponent<any, any> = styled.div`
  position: relative;
`;

export const StyledCanvas: IStyledComponent<any, any> = styled.canvas``;
export const StyledCanvasHeader: IStyledComponent<any, any> = styled.canvas``;

export const StyledSpan: IStyledComponent<any, any> = styled.span<StyledSpanProps>`
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  left: ${({ position }) => (position === "left" ? 0 : "auto")};
  right: ${({ position }) => (position === "right" ? 0 : "auto")};
`;

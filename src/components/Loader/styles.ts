import styled, { IStyledComponent, keyframes } from "styled-components";
import { StyledWrapperProps } from "./types";

export const StyledWrapper: IStyledComponent<any, any> = styled.div<StyledWrapperProps>`
  width: 388px;
  height: 100%;
  position: absolute;
  top: 0;
  left: ${({ $position }) => ($position === "left" ? 0 : "auto")};
  right: ${({ $position }) => ($position === "right" ? 0 : "auto")};
  background-color: ${({ theme }) => `color-mix(in srgb, ${theme.colors.background} 70%, transparent)`};
  overflow: hidden;
  z-index: 1;
`;

const move = keyframes`
from{
    left: -100%;
}
to{
    left: 100%;
}`;

export const StyledWalker: IStyledComponent<any, any> = styled.div`
  width: inherit;
  height: 100%;
  position: absolute;
  background: ${({ theme }) =>
    `linear-gradient(90deg, transparent, color-mix(in srgb, ${theme.colors.accent} 14%, transparent) 50%, transparent)`};
  animation: ${move} 1.4s ease-in-out infinite;
`;

import styled, { IStyledComponent } from "styled-components";
import { leftColumnWidth, tileHeight } from "@/constants";
import { marginPaddingReset, truncate } from "@/styles";
import { StyledTextProps } from "./types";

export const StyledTileWrapper: IStyledComponent<any, any> = styled.button`
  ${marginPaddingReset}
  height: ${tileHeight}px;
  position: absolute;
  outline: none;
  border: none;
  border-radius: 4px;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;
  cursor: pointer;
`;

export const StyledTextWrapper: IStyledComponent<any, any> = styled.div`
  margin: 10px 16px;
  position: relative;
  display: flex;
  font-size: 10px;
  letter-spacing: 0.5px;
  line-height: 12px;
`;

export const StyledText: IStyledComponent<any, any> = styled.p<StyledTextProps>`
  ${marginPaddingReset}
  ${truncate}
  display: inline;
  font-weight: ${({ bold }) => (bold ? "600" : "400")};
  &:first-child {
    &::after {
      content: "|";
      margin: 0 3px;
    }
  }
`;

export const StyledDescription: IStyledComponent<any, any> = styled.p`
  ${marginPaddingReset}
  ${truncate}
`;

export const StyledStickyWrapper: IStyledComponent<any, any> = styled.div`
  position: sticky;
  left: ${leftColumnWidth + 16}px;
  overflow: hidden;
`;

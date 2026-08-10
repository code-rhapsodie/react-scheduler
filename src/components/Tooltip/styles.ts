import styled, { IStyledComponent } from "styled-components";
import { marginPaddingReset } from "@/styles";

export const StyledTooltipWrapper: IStyledComponent<any, any> = styled.div`
  padding: 8px 16px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.tooltip};
  border-radius: 8px;
  z-index: 3;
  transition: all 0.25s;
  transition-timing-function: ease-out;
  pointer-events: none;
`;

export const StyledTooltipContent: IStyledComponent<any, any> = styled.div`
  width: 100%;
`;
export const StyledTooltipBeak: IStyledComponent<any, any> = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 14px solid ${({ theme }) => theme.colors.tooltip};
`;

export const StyledContentWrapper: IStyledComponent<any, any> = styled.div``;
export const StyledInnerWrapper: IStyledComponent<any, any> = styled.div`
  display: flex;
  align-items: center;
  &:first-child {
    margin-bottom: 8px;
  }
`;
export const StyledTextWrapper: IStyledComponent<any, any> = styled.div`
  ${marginPaddingReset}
  display: flex;
  align-items: center;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 12px;
  letter-spacing: 0.5px;
`;

export const StyledText: IStyledComponent<any, any> = styled.p`
  ${marginPaddingReset}
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StyledOvertimeWarning: IStyledComponent<any, any> = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.warning};
`;

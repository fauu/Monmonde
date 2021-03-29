import { css } from "@emotion/react";

import { Move } from "~/core";

interface Props {
  move: Move;
  kbdKey: string;
  available: boolean;
  onClick: () => void;
}

export const MoveListItem = ({ move, kbdKey, available, onClick }: Props): JSX.Element => {
  return (
    <div css={styleBase({ available })} onClick={available ? onClick : undefined}>
      <kbd css={keyStyle}>{kbdKey}</kbd> {move.name}
    </div>
  );
};

const styleAvailable = css`
  background-color: rgba(0, 0, 0, 0.5);
  transition-duration: 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const styleNotAvailable = css`
  background-color: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.25);
`;

const styleBase = (p: { available: boolean }) => css`
  ${p.available ? styleAvailable : styleNotAvailable};
  padding: 4px 8px;
  font-weight: 500;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 3px;
  }
`;

const keyStyle = css`
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 14px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: "Roboto Mono";
  text-transform: uppercase;
  text-align: center;
  border: 1px solid #666;
  background: #444;
  border-radius: 2px;
  margin-right: 8px;
`;


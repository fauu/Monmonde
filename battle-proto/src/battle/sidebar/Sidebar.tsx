import { css } from "@emotion/react";

import { SidebarMove } from "~/battle/sidebar";
import { MoveListItem } from "~/battle/sidebar";

interface Props {
  moves: SidebarMove[];
  casting: boolean;
  onMoveClick: (kbdKey: string) => void;
}

export const Sidebar = ({ moves, casting, onMoveClick }: Props): JSX.Element => {
  return (
    <div css={style}>
      <h4 css={moveListHeaderStyle}>Moves:</h4>
      <ul css={moveListStyle}>
        {moves.map((move: SidebarMove) => (
          <MoveListItem
            key={move.move.name}
            move={move.move}
            kbdKey={move.kbdKey}
            available={move.available && !casting}
            onClick={() => onMoveClick(move.kbdKey)}
          />
        ))}
      </ul>
    </div>
  );
};

const style = css`
  flex: 0 0 10rem;
  margin-right: 1rem;
`;

const moveListHeaderStyle = css`
  margin-bottom: 8px;
`;

const moveListStyle = css`
  list-style-type: none;
`;

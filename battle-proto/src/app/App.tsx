import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { HotKeys } from "react-hotkeys";

import { BattleDisplayContainer } from "~/battle";
import { BattleEngine } from "~/battle/engine";
import { Sidebar, SidebarMove } from "~/battle/sidebar";

const keyMap = {
  COMMAND_ACTION: ["q", "w", "e", "r", "t", "y", "a", "s", "d", "f", "1", "2", "3", "4"],
};

export const App = (): JSX.Element => {
  const [battleEngine, setBattleEngine] = useState<BattleEngine>();
  const [sidebarMoves, setSidebarMoves] = useState<SidebarMove[]>([]);
  const [playerMonCasting, setPlayerMonCasting] = useState<boolean>(false);

  useEffect(() => {
    setBattleEngine(
      new BattleEngine({
        onPlayerMonMovesChange: (moves) =>
          setSidebarMoves(
            moves.map(
              (move, i) =>
                ({
                  move: move.move,
                  kbdKey: keyMap.COMMAND_ACTION[i],
                  available: move.available,
                } as SidebarMove)
            )
          ),
        onPlayerMonCastingStateChange: (casting) => setPlayerMonCasting(casting),
      })
    );
  }, []);

  const handleActionKey = (keyIdx: number) => {
    battleEngine?.handleActionKey(keyIdx);
  };

  const keyHandlers = {
    COMMAND_ACTION: (ev?: KeyboardEvent) => {
      if (ev === undefined) return;
      handleActionKey(keyMap["COMMAND_ACTION"].indexOf(ev.key));
    },
  };

  return (
    <HotKeys keyMap={keyMap} handlers={keyHandlers}>
      <div css={style}>
        <Sidebar
          moves={sidebarMoves}
          casting={playerMonCasting}
          onMoveClick={(kbdKey) => handleActionKey(keyMap["COMMAND_ACTION"].indexOf(kbdKey))}
        />
        {battleEngine && <BattleDisplayContainer battleEngine={battleEngine} />}
      </div>
    </HotKeys>
  );
};

const style = css`
  height: 480px;
  margin: auto 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
`;


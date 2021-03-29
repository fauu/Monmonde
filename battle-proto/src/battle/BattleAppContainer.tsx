import { css } from "@emotion/react";
import { useRef, useEffect } from "react";

import { BattleApp } from "~/battle/app";
import { BattleEngine } from "~/battle/engine";

interface Props {
  battleEngine: BattleEngine;
}

export const BattleDisplayContainer = ({ battleEngine }: Props): JSX.Element => {
  const rootEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const battleApp = new BattleApp(battleEngine);

    // For hot reload
    const rootElLastChild = rootEl.current?.lastChild;
    if (rootElLastChild) rootEl.current?.removeChild(rootElLastChild);

    rootEl.current?.appendChild(battleApp.element);
  }, []);

  return <div css={style} ref={rootEl} />;
};

const style = css`
  width: ${BattleApp.SIZE[0]}px;
  height: ${BattleApp.SIZE[1]}px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.5);
`;


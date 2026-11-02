import { useId, useState } from "react";

export function CodingSlider() {
  const id = useId();
  const [position, setPosition] = useState(50);
  const current = position < 33
    ? "Writing code by hand · Neovim"
    : position > 66
      ? "Agent orchestrators · Software factories"
      : "Cursor · Codex · Claude Code";

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-6 py-4">
      <h2 id={`${id}-title`} className="text-xl font-normal tracking-tight">
        How are we building?
      </h2>
      <label htmlFor={id} className="sr-only">Where you are on the coding spectrum</label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={current}
        className="h-6 w-full cursor-pointer accent-zinc-800"
      />
      <div className="grid grid-cols-3 gap-3 text-xs leading-5 text-zinc-500 sm:gap-6 sm:text-sm">
        <div>
          <p className="text-zinc-800">Writing code by hand</p>
          <p>Neovim</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-800">Cursor · Codex</p>
          <p>Claude Code</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-800">Agent orchestrators</p>
          <p>Software factories</p>
        </div>
      </div>
      <output htmlFor={id} className="text-center text-sm text-zinc-600">
        {current}
      </output>
    </section>
  );
}

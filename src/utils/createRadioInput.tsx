export function createRadioInput<t extends string | number>(
  classNamePrefix: string,
  option: t,
  state: {
    value: t;
    action: React.Dispatch<React.SetStateAction<t>>;
  },
  count?: string
): JSX.Element {
  const sizeOptionStyle = {
    display: "block",
    height: "0",
    width: "0",
    opacity: "0",
    padding: "0",
    margin: "0",
  };
  return (
    <li
      key={`${classNamePrefix}--option${option}`}
      onClick={() => state.action(option)}
      className={`${classNamePrefix}--container`}
    >
      <label
        htmlFor={`${classNamePrefix}--option${option}`}
        className={`${classNamePrefix}--${state.value === option ? "active" : "inactive"}`}
      >
        {`${option}${count ? "(" + count + ")" : ""}`}
      </label>
      <input
        type="radio"
        style={{ ...sizeOptionStyle }}
        id={`${classNamePrefix}--option${option}`}
        value={state.value}
        onClick={() => state.action(option)}
      ></input>
    </li>
  );
}

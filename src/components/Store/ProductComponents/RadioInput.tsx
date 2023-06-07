type RadioInputProps<T extends string | number> = {
  classNamePrefix: string;
  option: T;
  state: {
    value: T;
    action: React.Dispatch<React.SetStateAction<T>>;
  };
  count?: string;
};
export default function RadioInput<t extends string | number>(props: RadioInputProps<t>) {
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
      key={`${props.classNamePrefix}--option${props.option}`}
      onClick={() => props.state.action(props.option)}
      className={`${props.classNamePrefix}--container`}
    >
      <label
        htmlFor={`${props.classNamePrefix}--option${props.option}`}
        className={`${props.classNamePrefix}--${props.state.value === props.option ? "active" : "inactive"}`}
      >
        {`${props.option}${props.count ? "(" + props.count + ")" : ""}`}
      </label>
      <input
        type="radio"
        style={{ ...sizeOptionStyle }}
        id={`${props.classNamePrefix}--option${props.option}`}
        value={props.state.value as string | number}
        onClick={() => props.state.action(props.option)}
      ></input>
    </li>
  );
}

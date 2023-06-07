import { FC } from "react";

type StatusBarProps = {
  classNamePrefix: string;
  stage: number;
  stageNames: string[];
};
const StatusBar: FC<StatusBarProps> = (props) => {
  const listItems = props.stageNames.map((stageName, index) => {
    if (index < props.stage) {
      return (
        <li className={`${props.classNamePrefix}__transaction-stages__stage transaction-stages__stage--filled`}>
          {stageName}
        </li>
      );
    } else {
      <li className={`${props.classNamePrefix}__transaction-stages__stage transaction-stages__stage--unfilled`}>
        {stageName}
      </li>;
    }
  });
  return <ol className={`transaction-stages ${props.classNamePrefix}__transaction-stages`}>{...listItems}</ol>;
};
export default StatusBar;

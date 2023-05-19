declare namespace JSX {
  interface IntrinsicElements {
    'range-selector': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
interface simpleRangeEvent extends CustomEvent{
  detail: {
    sliderId: string
    minRangeValue: number
    maxRangeValue: number
  }
}
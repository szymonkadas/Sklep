export default function scButtonsInteractivity(
  ref: React.MutableRefObject<false | NodeJS.Timeout>,
  submitButtonsAvailability: boolean,
  setSubmitButtonsAvailability: (value: React.SetStateAction<boolean>) => void
) {
  if (ref.current) clearTimeout(ref.current);
  if (submitButtonsAvailability) setSubmitButtonsAvailability(false);
  ref.current = setTimeout(() => {
    setSubmitButtonsAvailability(true);
  }, 1300);
}

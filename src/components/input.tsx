import {Input as BaseuiInput, InputProps} from 'baseui/input';
import {FormControl, FormControlProps} from 'baseui/form-control';

type Props = {
  className?: string;
  label: Omit<FormControlProps, 'children'>;
  input: InputProps;
};

function Input({label, input, ...main}: Props) {
  return (
    <div {...main}>
      <FormControl {...label}>
        <BaseuiInput {...input} />
      </FormControl>
    </div>
  );
}

export default Input;

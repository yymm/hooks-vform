import * as React from "react";
import { VFormContextValue, VFormContext } from "./VForm";

//
// validator and normalizer
//
type validatorFunc = (v: string) => string;
type normalizeFunc = (v: string) => boolean;

// validatorFunc
const required = (v: string): string => {
  if (v.length !== 0) return "";
  return "required";
};

// normalizeFunc
const numbers = (v: string): boolean => {
  const regex = new RegExp(/^[0-9]+$/);
  return regex.test(v);
};

const validate = (
  name: string,
  value: string,
  setMessage: (v: string) => void,
  validators: validatorFunc[],
  formName: string,
  ctx: VFormContextValue
) => {
  for (let validator of validators) {
    const message = validator(value);
    setMessage(message);
    if (formName) {
      const formCtx = ctx.value.get(formName);
      if (formCtx) {
        formCtx.set(name, message);
        ctx.value.set(formName, formCtx);
        ctx.setValue(ctx.value);
      }
    }
  }
};

const normalize = (value: string, normalizer: normalizeFunc) => {
  if (!normalizer(value)) {
    value = value.slice(0, -1);
  }
  return value;
};

//
// components
//
type InputType = "text" | "password";

interface InputProps {
  name: string;
  value: string;
  inputType: InputType;
  onChange: (v: string) => void;
  formName?: string;
  validators?: validatorFunc[];
  normalizer?: normalizeFunc;
}

// TODO:
// - className?を引数に
const Input = ({
  name,
  value,
  onChange,
  inputType,
  formName = "",
  validators,
  normalizer
}: InputProps) => {
  const [message, setMessage] = React.useState(value);
  const ctx = React.useContext<VFormContextValue>(VFormContext);
  React.useEffect(() => {
    if (validators) {
      validate(name, value, setMessage, validators, formName, ctx);
    }
  }, []); // effect is called one time at first rendering

  const onChangeInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      let value = e.target.value;
      if (normalizer) {
        value = normalize(value, normalizer);
      }
      if (validators) {
        validate(name, value, setMessage, validators, formName, ctx);
      }
      onChange(value);
    },
    []
  );
  return (
    <div>
      <input type={inputType} value={value} onChange={onChangeInput} />
      <div>{message}</div>
    </div>
  );
};

export { Input, required, numbers };

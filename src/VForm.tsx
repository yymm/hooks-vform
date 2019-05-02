import * as React from "react";

interface VFormContextValue {
  value: Map<string, Map<string, string>>; // React.useState: Map<form_name, Map<input_name, message>>
  setValue: (v: Map<string, Map<string, string>>) => void;
}

const initialVFormValue = new Map<string, Map<string, string>>();

const VFormContext = React.createContext<VFormContextValue>({
  value: initialVFormValue,
  setValue: () => {},
});

const useVForm = () => {
  const [validState, setValidState] = React.useState(initialVFormValue);
  const value = {
    value: validState,
    setValue: setValidState,
  };
  return { VForm: VFormContext.Provider, value: value };
};

const GetValid = (name: string) => {
  const ctx = React.useContext<VFormContextValue>(VFormContext);
  const formCtx = ctx.value.get(name);
  if (formCtx) {
    const values = formCtx.values();
    if (formCtx.size === 0) return false;
    for (let v of values) {
      if (v.length !== 0) return false;
    }
  } else {
    // GetValidして初めてctx.valueがsetされる
    ctx.value.set(name, new Map<string, string>());
    ctx.setValue(ctx.value);
    return false;
  }
  return true;
};

export { useVForm, VFormContextValue, VFormContext, GetValid };

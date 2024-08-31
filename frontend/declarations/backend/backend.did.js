export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Property = IDL.Record({
    'id' : IDL.Nat,
    'rentAmount' : IDL.Nat,
    'description' : IDL.Opt(IDL.Text),
    'address' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Property, 'err' : IDL.Text });
  return IDL.Service({
    'addProperty' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'deleteProperty' : IDL.Func([IDL.Nat], [Result], []),
    'getAllProperties' : IDL.Func([], [IDL.Vec(Property)], ['query']),
    'getProperty' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'updateProperty' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Property = IDL.Record({
    'id' : IDL.Nat,
    'rentAmount' : IDL.Nat,
    'description' : IDL.Opt(IDL.Text),
    'address' : IDL.Text,
  });
  const Payment = IDL.Record({
    'id' : IDL.Nat,
    'userId' : IDL.Principal,
    'propertyId' : IDL.Nat,
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : Property, 'err' : IDL.Text });
  return IDL.Service({
    'addProperty' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'assignProperty' : IDL.Func([IDL.Nat], [Result], []),
    'createUser' : IDL.Func([IDL.Text], [Result], []),
    'deleteProperty' : IDL.Func([IDL.Nat], [Result], []),
    'getAllProperties' : IDL.Func([], [IDL.Vec(Property)], ['query']),
    'getPaymentHistory' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Payment)],
        ['query'],
      ),
    'getProperty' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'payRent' : IDL.Func([IDL.Nat], [Result], []),
    'updateProperty' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

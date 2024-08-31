import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Property {
  'id' : bigint,
  'rentAmount' : bigint,
  'description' : [] | [string],
  'address' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Property } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addProperty' : ActorMethod<[string, bigint, [] | [string]], Result_2>,
  'deleteProperty' : ActorMethod<[bigint], Result>,
  'getAllProperties' : ActorMethod<[], Array<Property>>,
  'getProperty' : ActorMethod<[bigint], Result_1>,
  'updateProperty' : ActorMethod<
    [bigint, string, bigint, [] | [string]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

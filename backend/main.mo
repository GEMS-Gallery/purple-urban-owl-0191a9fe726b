import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
  type Property = {
    id: Nat;
    address: Text;
    rentAmount: Nat;
    description: ?Text;
  };

  type User = {
    id: Principal;
    username: Text;
    propertyId: ?Nat;
  };

  type Payment = {
    id: Nat;
    userId: Principal;
    propertyId: Nat;
    amount: Nat;
    timestamp: Int;
  };

  stable var propertiesEntries : [(Nat, Property)] = [];
  var properties = HashMap.HashMap<Nat, Property>(0, Nat.equal, Nat.hash);

  stable var usersEntries : [(Principal, User)] = [];
  var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);

  stable var paymentsEntries : [(Nat, Payment)] = [];
  var payments = HashMap.HashMap<Nat, Payment>(0, Nat.equal, Nat.hash);

  stable var nextPropertyId : Nat = 0;
  stable var nextPaymentId : Nat = 0;

  // User Management
  public shared(msg) func createUser(username: Text) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case (?_) { #err("User already exists") };
      case null {
        let newUser : User = {
          id = userId;
          username = username;
          propertyId = null;
        };
        users.put(userId, newUser);
        #ok()
      };
    }
  };

  public shared(msg) func assignProperty(propertyId: Nat) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        switch (properties.get(propertyId)) {
          case null { #err("Property not found") };
          case (?_) {
            let updatedUser : User = {
              id = user.id;
              username = user.username;
              propertyId = ?propertyId;
            };
            users.put(userId, updatedUser);
            #ok()
          };
        }
      };
    }
  };

  // Property Management
  public func addProperty(address: Text, rentAmount: Nat, description: ?Text) : async Result.Result<Nat, Text> {
    let id = nextPropertyId;
    nextPropertyId += 1;
    let newProperty : Property = {
      id = id;
      address = address;
      rentAmount = rentAmount;
      description = description;
    };
    properties.put(id, newProperty);
    #ok(id)
  };

  public query func getProperty(id: Nat) : async Result.Result<Property, Text> {
    switch (properties.get(id)) {
      case (null) { #err("Property not found") };
      case (?property) { #ok(property) };
    }
  };

  public func updateProperty(id: Nat, address: Text, rentAmount: Nat, description: ?Text) : async Result.Result<(), Text> {
    switch (properties.get(id)) {
      case (null) { #err("Property not found") };
      case (?existingProperty) {
        let updatedProperty : Property = {
          id = id;
          address = address;
          rentAmount = rentAmount;
          description = description;
        };
        properties.put(id, updatedProperty);
        #ok()
      };
    }
  };

  public func deleteProperty(id: Nat) : async Result.Result<(), Text> {
    switch (properties.remove(id)) {
      case (null) { #err("Property not found") };
      case (?_) { #ok() };
    }
  };

  public query func getAllProperties() : async [Property] {
    Array.map<(Nat, Property), Property>(Array.sort<(Nat, Property)>(Iter.toArray(properties.entries()), func(a, b) { Nat.compare(a.0, b.0) }), func(entry) { entry.1 })
  };

  // Rent Payment
  public shared(msg) func payRent(amount: Nat) : async Result.Result<(), Text> {
    let userId = msg.caller;
    switch (users.get(userId)) {
      case null { #err("User not found") };
      case (?user) {
        switch (user.propertyId) {
          case null { #err("No property assigned to user") };
          case (?propertyId) {
            let paymentId = nextPaymentId;
            nextPaymentId += 1;
            let newPayment : Payment = {
              id = paymentId;
              userId = userId;
              propertyId = propertyId;
              amount = amount;
              timestamp = Time.now();
            };
            payments.put(paymentId, newPayment);
            #ok()
          };
        }
      };
    }
  };

  public query func getPaymentHistory(userId: Principal) : async [Payment] {
    Array.filter<Payment>(Array.map<(Nat, Payment), Payment>(Iter.toArray(payments.entries()), func(entry) { entry.1 }), func(payment) { payment.userId == userId })
  };

  // System functions for upgrades
  system func preupgrade() {
    propertiesEntries := Iter.toArray(properties.entries());
    usersEntries := Iter.toArray(users.entries());
    paymentsEntries := Iter.toArray(payments.entries());
  };

  system func postupgrade() {
    properties := HashMap.fromIter<Nat, Property>(propertiesEntries.vals(), 1, Nat.equal, Nat.hash);
    users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 1, Principal.equal, Principal.hash);
    payments := HashMap.fromIter<Nat, Payment>(paymentsEntries.vals(), 1, Nat.equal, Nat.hash);
  };
}

import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

actor {
  // Define the Property type
  type Property = {
    id: Nat;
    address: Text;
    rentAmount: Nat;
    description: ?Text;
  };

  // Initialize the stable variable to store properties
  stable var propertiesEntries : [(Nat, Property)] = [];
  var properties = HashMap.HashMap<Nat, Property>(0, Nat.equal, Nat.hash);

  // Initialize the next property ID
  stable var nextPropertyId : Nat = 0;

  // Helper function to get the next property ID
  func getNextPropertyId() : Nat {
    nextPropertyId += 1;
    nextPropertyId - 1
  };

  // Add a new property
  public func addProperty(address: Text, rentAmount: Nat, description: ?Text) : async Result.Result<Nat, Text> {
    let id = getNextPropertyId();
    let newProperty : Property = {
      id = id;
      address = address;
      rentAmount = rentAmount;
      description = description;
    };
    properties.put(id, newProperty);
    #ok(id)
  };

  // Get a specific property
  public query func getProperty(id: Nat) : async Result.Result<Property, Text> {
    switch (properties.get(id)) {
      case (null) { #err("Property not found") };
      case (?property) { #ok(property) };
    }
  };

  // Update an existing property
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

  // Delete a property
  public func deleteProperty(id: Nat) : async Result.Result<(), Text> {
    switch (properties.remove(id)) {
      case (null) { #err("Property not found") };
      case (?_) { #ok() };
    }
  };

  // Get all properties
  public query func getAllProperties() : async [Property] {
    Array.map<(Nat, Property), Property>(Array.sort<(Nat, Property)>(Iter.toArray(properties.entries()), func(a, b) { Nat.compare(a.0, b.0) }), func(entry) { entry.1 })
  };

  // System functions for upgrades
  system func preupgrade() {
    propertiesEntries := Iter.toArray(properties.entries());
  };

  system func postupgrade() {
    properties := HashMap.fromIter<Nat, Property>(propertiesEntries.vals(), 1, Nat.equal, Nat.hash);
  };
}

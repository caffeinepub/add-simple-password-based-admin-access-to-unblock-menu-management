import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type CategoryId = Text;
  type FoodItemId = Text;

  type Category = {
    id : CategoryId;
    name : Text;
    order : Nat;
    enabled : Bool;
  };

  type FoodItem = {
    id : FoodItemId;
    name : Text;
    description : Text;
    price : Float;
    hot : Bool;
    image : ?Storage.ExternalBlob;
    categoryId : CategoryId;
    enabled : Bool;
    order : Nat;
  };

  // Include storage and authorization mixins
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  let categoriesMap = Map.empty<CategoryId, Category>();
  let foodItemsMap = Map.empty<FoodItemId, FoodItem>();

  public shared ({ caller }) func addCategory(name : Text, order : Nat) : async CategoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = name.trim(#char ' ');
    let category : Category = {
      id;
      name;
      order;
      enabled = true;
    };
    categoriesMap.add(id, category);
    id;
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categoriesMap.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?cat) {
        let updatedCat = { cat with name };
        categoriesMap.add(id, updatedCat);
      };
    };
  };

  public shared ({ caller }) func toggleCategoryEnabled(id : CategoryId, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categoriesMap.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?cat) {
        let updatedCat = { cat with enabled };
        categoriesMap.add(id, updatedCat);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categoriesMap.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (_) {
        if (foodItemsMap.values().any(func(item) { item.categoryId == id })) {
          Runtime.trap("Cannot delete category with existing food items");
        };
        categoriesMap.remove(id);
      };
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    categoriesMap.values().toArray();
  };

  public shared ({ caller }) func addFoodItem(name : Text, description : Text, price : Float, hot : Bool, categoryId : CategoryId, order : Nat) : async FoodItemId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categoriesMap.get(categoryId)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (_) {
        let foodItemId = name.trim(#char ' ');
        let foodItem : FoodItem = {
          id = foodItemId;
          name;
          description;
          price;
          hot;
          image = null;
          categoryId;
          enabled = true;
          order;
        };
        foodItemsMap.add(foodItemId, foodItem);
        foodItemId;
      };
    };
  };

  public shared ({ caller }) func updateFoodItem(id : FoodItemId, name : Text, description : Text, price : Float, hot : Bool, categoryId : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (categoriesMap.get(categoryId)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (_) {
        switch (foodItemsMap.get(id)) {
          case (null) { Runtime.trap("Food Item not found") };
          case (?item) {
            let updatedItem = {
              item with
              name;
              description;
              price;
              hot;
              categoryId;
            };
            foodItemsMap.add(id, updatedItem);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateFoodItemImage(id : FoodItemId, newImage : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update food item images");
    };

    switch (foodItemsMap.get(id)) {
      case (null) { Runtime.trap("Food Item not found") };
      case (?item) {
        let updatedItem = { item with image = newImage };
        foodItemsMap.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func toggleFoodItemEnabled(id : FoodItemId, enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (foodItemsMap.get(id)) {
      case (null) { Runtime.trap("Food Item not found") };
      case (?item) {
        let updatedItem = { item with enabled };
        foodItemsMap.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteFoodItem(id : FoodItemId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (foodItemsMap.get(id)) {
      case (null) { Runtime.trap("Food Item not found") };
      case (_) { foodItemsMap.remove(id) };
    };
  };

  public query ({ caller }) func getFoodItemsForCategory(categoryId : CategoryId) : async [FoodItem] {
    foodItemsMap.values().toArray().filter(
      func(item) {
        item.categoryId == categoryId;
      }
    );
  };

  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    foodItemsMap.values().toArray();
  };

  public shared ({ caller }) func reorderCategories(newOrder : [CategoryId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    for ((index, id) in newOrder.enumerate()) {
      switch (categoriesMap.get(id)) {
        case (null) {};
        case (?cat) {
          let updatedCat = { cat with order = index };
          categoriesMap.add(id, updatedCat);
        };
      };
    };
  };

  public shared ({ caller }) func reorderFoodItems(newOrder : [FoodItemId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    for ((index, id) in newOrder.enumerate()) {
      switch (foodItemsMap.get(id)) {
        case (null) {};
        case (?item) {
          let updatedItem = { item with order = index };
          foodItemsMap.add(id, updatedItem);
        };
      };
    };
  };

  public type AnalyticsData = {
    totalCategories : Nat;
    totalItems : Nat;
    activeItems : Nat;
  };

  public shared ({ caller }) func getAnalytics() : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let totalCategories = categoriesMap.size();
    let totalItems = foodItemsMap.size();
    let activeItems = foodItemsMap.values().toArray().filter(func(item) { item.enabled }).size();

    {
      totalCategories;
      totalItems;
      activeItems;
    };
  };
};

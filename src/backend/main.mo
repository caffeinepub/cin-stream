import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import ExternalBlob "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
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

  type TitleType = {
    #movie;
    #series;
  };

  type Title = {
    id : Nat;
    title : Text;
    description : Text;
    video : ExternalBlob.ExternalBlob;
    coverImage : ExternalBlob.ExternalBlob;
    titleType : TitleType;
    averageRating : Float;
    ratingCount : Nat;
  };

  type TitleInput = {
    title : Text;
    description : Text;
    video : ExternalBlob.ExternalBlob;
    coverImage : ExternalBlob.ExternalBlob;
    titleType : TitleType;
  };

  type Rating = {
    titleId : Nat;
    userRating : Nat;
  };

  module Title {
    public func compare(t1 : Title, t2 : Title) : Order.Order {
      Text.compare(t1.title, t2.title);
    };
  };

  var nextId = 1;
  let titles = Map.empty<Nat, Title>();
  let ratings = Map.empty<Nat, List.List<Rating>>();

  public query ({ caller }) func searchTitles(search : Text) : async [Title] {
    if (search.isEmpty()) {
      return titles.values().toArray().sort();
    };

    let filteredIter = titles.values().filter(
      func(title) {
        title.title.toLower().contains(#text(search.toLower()));
      }
    );
    filteredIter.toArray().sort();
  };

  public query ({ caller }) func getAllTitles() : async [Title] {
    titles.values().toArray().sort();
  };

  public query ({ caller }) func getTitleById(id : Nat) : async Title {
    switch (titles.get(id)) {
      case (null) { Runtime.trap("Title not found") };
      case (?title) { title };
    };
  };

  public query ({ caller }) func getTitlesByType(titleType : TitleType) : async [Title] {
    let filteredIter = titles.values().filter(
      func(title) { title.titleType == titleType }
    );
    filteredIter.toArray().sort();
  };

  public shared ({ caller }) func addTitle(input : TitleInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload titles");
    };

    let newTitle : Title = {
      id = nextId;
      title = input.title;
      description = input.description;
      video = input.video;
      coverImage = input.coverImage;
      titleType = input.titleType;
      averageRating = 0.0;
      ratingCount = 0;
    };

    titles.add(nextId, newTitle);
    nextId += 1;

    newTitle.id;
  };

  public shared ({ caller }) func rateTitle(titleId : Nat, userRating : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can rate titles");
    };

    let title = switch (titles.get(titleId)) {
      case (null) { Runtime.trap("Title not found") };
      case (?t) { t };
    };

    if (userRating < 1 or userRating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let newRating : Rating = {
      titleId;
      userRating;
    };

    let existingRatings = switch (ratings.get(titleId)) {
      case (null) { List.empty<Rating>() };
      case (?list) { list };
    };

    let updatedRatings = existingRatings;
    ratings.add(titleId, updatedRatings);

    let totalSum = updatedRatings.foldLeft(
      0,
      func(acc, rating) { acc + rating.userRating },
    );

    let totalCount = updatedRatings.size();

    let updatedTitle : Title = {
      title with
      averageRating = totalSum.toFloat() / totalCount.toFloat();
      ratingCount = totalCount;
    };

    titles.add(titleId, updatedTitle);
  };

  public query ({ caller }) func getTitleRatings(titleId : Nat) : async ?{
    averageRating : Float;
    ratingCount : Nat;
  } {
    switch (titles.get(titleId)) {
      case (null) { null };
      case (?title) {
        ?{
          averageRating = title.averageRating;
          ratingCount = title.ratingCount;
        };
      };
    };
  };

  public shared ({ caller }) func deleteTitle(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete titles");
    };

    switch (titles.get(id)) {
      case (null) { Runtime.trap("Title not found") };
      case (?_) {
        titles.remove(id);
        ratings.remove(id);
      };
    };
  };

  public shared ({ caller }) func updateTitle(id : Nat, updatedTitle : TitleInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update titles");
    };

    let existingTitle = switch (titles.get(id)) {
      case (null) { Runtime.trap("Title not found") };
      case (?title) { title };
    };

    let updatedTitleData : Title = {
      existingTitle with
      title = updatedTitle.title;
      description = updatedTitle.description;
      video = updatedTitle.video;
      coverImage = updatedTitle.coverImage;
      titleType = updatedTitle.titleType;
    };

    titles.add(id, updatedTitleData);
  };
};

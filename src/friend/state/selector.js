import { createSelector } from "reselect";

const getFriends = (state) => state.friend.friends;
export const getAgeLimit = (state, props) => props.ageLimit;
export const getShowLimit = (state) => state.friend.showLimit;

export const makeGetFriendsWithAgeLimit = () => {
  return createSelector([getFriends, getAgeLimit], (friends, ageLimit) => {
    console.log("called");
    return friends.filter((friend) => friend.age <= ageLimit);
  });
};

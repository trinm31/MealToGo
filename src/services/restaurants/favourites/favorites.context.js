import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FavouriteContext = createContext();

export const FavouriteContextProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  const add = (item) => {
    setFavourites([...favourites, item]);
  };

  const remove = (item) => {
    const newFavourites = favourites.filter((x) => x.placeId !== item.placeId);
    setFavourites(newFavourites);
  };

  const saveFavourites = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@favourites", jsonValue);
    } catch (e) {
      console.log("error storing", e);
    }
  };

  const loadFavourites = async () => {
    try {
      const value = await AsyncStorage.getItem("@favourites");
      if (value !== null) {
        setFavourites(JSON.parse(value));
      }
    } catch (e) {
      console.log("error loading", e);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  useEffect(() => {
    saveFavourites(favourites);
  }, [favourites]);

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        addToFavourites: (item) => add(item),
        removeFromFavourites: (item) => remove(item),
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

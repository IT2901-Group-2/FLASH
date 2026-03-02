"use client";
/**
 * Everything in this file is temporary until guest authentication is done.
 */

export const setNickname = (eventID: string, nickname: string): void => {
  const stored = localStorage.getItem("rememberedEvents");
  const rememberedEvents: Record<string, string> = stored ? JSON.parse(stored) : {};

  if (Object.keys(rememberedEvents).length === 0)
    localStorage.setItem("rememberedEvents", JSON.stringify({}));

  rememberedEvents[eventID] = nickname;

  localStorage.setItem("rememberedEvents", JSON.stringify(rememberedEvents));
};

export const hasNicknameForEvent = (eventID: string): boolean => {
  return eventID in JSON.parse(localStorage.getItem("rememberedEvents") ?? "{}");
};

export const getNickname = (eventID: string) => {
  return JSON.parse(localStorage.getItem("rememberedEvents") ?? "{}")[eventID];
};

export const getAllJoinedEvents = (): string[] => {
  const stored = localStorage.getItem("rememberedEvents");
  return Object.keys(stored ? JSON.parse(stored) : {});
};

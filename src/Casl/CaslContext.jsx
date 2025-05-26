"use client";
import { createContextualCan } from "@casl/react";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";
import { defineAbilityFor } from "./caslAbility.js";

export const AbilityContext = createContext(null);
export const Can = createContextualCan(AbilityContext.Consumer);

// Optional helper
export const useAbility = () => {
  const ability = useContext(AbilityContext);
  if (!ability) throw new Error("Ability not found");
  return ability;
};

export const CaslProvider = ({ children, initialAbility = null }) => {
  const { data: session } = useSession();

  const ability = useMemo(() => {
    if (initialAbility) return initialAbility;
    return defineAbilityFor(session?.user || null);
  }, [session?.user?.role, session?.user?.id]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext(null);

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }) => {
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
};

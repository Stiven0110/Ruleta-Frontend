import React from 'react';

export const AuthContext = React.createContext<AuthContextType>(null!);

interface AuthContextType {
    user: any;
    signin: () => void;
    signout: () => void;
}

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    let [user, setUser] = React.useState<any>('no-auth');
    let signin = () => {
        setUser('authenticated')
    };
    let signout = () => {
        setUser('no-auth')
    }
    let value = { user, signin, signout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
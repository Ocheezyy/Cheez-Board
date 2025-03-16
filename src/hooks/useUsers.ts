import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import {useEffect} from "react";

export function useUsers() {
    const { data, isLoading, error, isSuccess } =  useQuery({
        queryKey: [ "users" ],
        queryFn: async () => {
            const response = await fetch("/api/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        }
    });

    const setUsers = useUserStore((state) => state.setUsers);

    useEffect(() => {
        if (data) {
            console.log("users", data);
            setUsers(data);
        }
    }, [ data, setUsers ]);

    return { data, isLoading, error, isSuccess };
}
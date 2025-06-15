import { Temple } from "@/app/types/temple";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useMutateTemple = ( { onSuccess }: { onSuccess: () => void } ) =>
{
    return useMutation( {
        mutationFn: async ( temple: Omit<Temple, "id"> ) =>
        {
            const { data } = await axios.post( 'http://localhost:8080/api/temple', temple );//axiosにホスト情報（localhost8080を設定する)
            return data;
        },
        onSuccess,
    } );
};

const fetchTemples = () =>
{
    return axios
        .get<Temple[]>( `http://localhost:8080/api/temples` )
        .then( ( res ) => res.data );
};

export const useTemples = () =>
{
    return useQuery( {
        queryKey: [ "Temples" ],
        queryFn: fetchTemples,
    } );
};
import { Area } from "@/app/types/area";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AreaForm } from "../AreaInfoForm";


export const useMutateAreas = ( { onSuccess }: { onSuccess: () => void } ) =>
{
    return useMutation( {
        mutationFn: async ( area: AreaForm ) =>
        {
            const { data } = await axios.post( 'http://localhost:8080/api/areas', area );//axiosにホスト情報（localhost8080を設定する)
            return data;
        },
        onSuccess,
    } );
};

const fetchAreas = () =>
{
    return axios
        .get<Area[]>( `http://localhost:8080/api/areas` )
        .then( ( res ) => res.data );
};

export const useAreas = () =>
{
    return useQuery( {
        queryKey: [ "Areas" ],
        queryFn: fetchAreas,
    } );
};
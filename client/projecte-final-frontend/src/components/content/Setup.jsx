import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Setup() {

    const {id} = useParams();
    const [setup, setSetup] = useState({});
    const API_URL = "http://localhost/api";

    useEffect(() => {

        async function getSetup() {
            const response = await fetch(`${API_URL}/getSetup/${id}`);
            const data = await response.json();

            console.log(data);
            setSetup(data);
        }

        getSetup();
    }, []);

    return (
        <>
            <h1>Setup: {setup.setup_name}</h1>
        </>
    );

}

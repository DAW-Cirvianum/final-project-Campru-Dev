import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormatLapTime from "./FormatLapTime";

export default function AdditionalData( {id} ) {

    const [maxSpeed, setMaxSpeed] = useState();
    const [avgSpeed, setAvgSpeed] = useState();
    const [maxRPM, setMaxRPM] = useState();
    const [numDrivers, setNumDrivers] = useState();
    const [fastLap, setFastLap] = useState();
    const [uploadedby, setUploadedby] = useState();
    const [type , setType] = useState();
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const API_URL = "http://localhost/api";

    useEffect(() => {

        async function getData() {
            try {
                const response = await fetch(`${API_URL}/getData/${id}`);
                const data = await response.json();

                setMaxSpeed(data['max_speed']);
                setAvgSpeed(data['avg_speed']);
                setMaxRPM(data['max_rpm']);
                setNumDrivers(data['numberOfDrivers']);
                setFastLap(data['fast_lap']);
                setUploadedby(data['uploaded_by']);
                setType(data['type']);
                setDate(data['date']);
                setTime(data['time']);

            } catch (error) {
                alert(error);
            }
        }

        getData();

    }, [id]);

    return (
        <div className="d-flex justify-content-around">
            <div>
                <p>Max Speed: {maxSpeed}</p>
                <p>Avg Speed: {avgSpeed}</p>
                <p>Max RPM: {maxRPM}</p>
            </div>
            <div>
                <p>Number of Drivers: {numDrivers}</p>
                <p>Fast Lap: {<FormatLapTime ms={fastLap}/>}</p>
            </div>
            <div>
                <p>Uploaded by: {uploadedby}</p>
                <p>Type: {type}</p>
                <p>Date: {date}</p>
                <p>Time: {time}</p>
            </div>
        </div>
    );

}


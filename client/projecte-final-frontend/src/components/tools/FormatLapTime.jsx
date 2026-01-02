
export default function FormatLapTime( {ms} ) {

    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    const paddedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${paddedSeconds}`;

}

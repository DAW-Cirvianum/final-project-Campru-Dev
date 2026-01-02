import math
import sys
import json
import statistics 
from pathlib import Path
import requests

if len(sys.argv) < 4:
    print("No se pasó el archivo JSON")
    sys.exit(1)

json_file = sys.argv[1]

path = Path(json_file)

if not path.exists():
    print(f"No existe el archivo: {path.resolve()}")
    sys.exit(1)

with path.open("r", encoding="utf-8") as f:
    data = json.load(f)

print("JSON carregat correctament")

# Agafem el camp numFrames per saber quants frames hi ha
num_frames = data["numFrames"]
track = data["trackName"]
pilot = data["driverName"]
car = data["carName"]

# Definim una funcio per calcular la velocitat en km/h a partir de les components de la velocitat
def speed_kmh(i):
    vx = data["velocityX"][i]
    vy = data["velocityY"][i]
    vz = data["velocityZ"][i]
    # La velocitat en km/h es calcula com la magnitud del vector velocitat multiplicada per 3.6
    return math.sqrt(vx*vx + vy*vy + vz*vz) * 3.6

frames = []

for i in range(num_frames):
    frames.append({
        "i": i,

        # Posición
        "x": data["x"][i],
        "y": data["y"][i],
        "z": data["z"][i],

        # Dinámica
        "speed": speed_kmh(i),
        "rpm": data["rpm"][i],
        "gear": data["gear"][i],
        "steer": data["steerAngle"][i],

        # Pedales
        "throttle": data["gas"][i] * 100,   # 0–100 %
        "brake": data["brake"][i] * 100,

        # Tiempos
        "currentLap": data["currentLap"][i],
        "currentLapTime": data["currentLapTime"][i],
        "lastLapTime": data["lastLapTime"][i],

    })

laps = {}

for f in frames:
    lap = f["currentLap"]
    if lap not in laps:
        laps[lap] = []
    laps[lap].append(f)

# Mostrar información de cada vuelta
# for lap, frames_in_lap in laps.items():
#     max_speed = max(f["speed"] for f in frames_in_lap)
#     max_rpm = max(f["rpm"] for f in frames_in_lap)
#     avg_speed = statistics.mean(f["speed"] for f in frames_in_lap)
#     print(f"Vuelta {lap}: Velocidad máxima = {max_speed:.2f} km/h, RPM máxima = {max_rpm}, AVG Speed = {avg_speed}")

lap_number = 0
lap = laps[lap_number]


def dist(a, b):
    return math.sqrt(
        (a["x"] - b["x"])**2 +
        (a["y"] - b["y"])**2 +
        (a["z"] - b["z"])**2
    )

for lap_number, lap_data in laps.items():
    if len(lap_data) == 0:
        continue

    lap_data[0]["lapDistance"] = 0.0

    for i in range(1, len(lap_data)):
        lap_data[i]["lapDistance"] = (
            lap_data[i - 1]["lapDistance"] +
            dist(lap_data[i], lap_data[i - 1])
        )


distance = [p["lapDistance"] for p in lap]
speed = [p["speed"] for p in lap]
throttle = [p["throttle"] for p in lap]
brake = [p["brake"] for p in lap]


web_data = {"laps": {}}

for lap_num, lap_data in laps.items():
    web_data["laps"][lap_num] = [
        {
            "d": p["lapDistance"],
            "speed": p["speed"],
            "throttle": p["throttle"],
            "brake": p["brake"],
            "gear": p["gear"],
            "x": p["x"],
            "y": p["y"],
            "z": p["z"]
        }
        for p in lap_data
    ]

payload = {
    "race_session_id": sys.argv[3],
    "pilot": pilot,
    "car": car,
    "laps": []
}

lap_nums = sorted(laps.keys(), key=int)

for i in range(len(lap_nums) - 1):
    lap_num = lap_nums[i]
    next_lap_num = lap_nums[i + 1]

    if int(lap_num) == 0:
        continue


    lap_data = laps[lap_num]
    next_lap_data = laps[next_lap_num]

    last_time = lap_data[-1]["currentLapTime"]
    next_time = next_lap_data[0]["currentLapTime"]

    if next_time < last_time:
        max_speed = int(max(p["speed"] for p in lap_data))
        max_rpm = max(p["rpm"] for p in lap_data)
        avg_speed = int(statistics.mean(p["speed"] for p in lap_data))
        
        payload["laps"].append({
            "lap_number": lap_num,
            "lap_time": last_time,
            "max_speed": max_speed,
            "avg_speed": avg_speed,
            "max_rpm": max_rpm,
            "points": [
                {
                    "d": p["lapDistance"],
                    "speed": p["speed"],
                    "throttle": p["throttle"],
                    "brake": p["brake"],
                    "gear": p["gear"],
                    "x": p["x"],
                    "y": p["y"],
                    "z": p["z"]
                }
                for p in lap_data
            ]
        })


token = sys.argv[2]

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

response = requests.post('http://localhost/api/store', json=payload, headers=headers )

#with open("telemetry_web.json", "w") as f:
#      json.dump(payload, f, indent=2)

print (response.text)

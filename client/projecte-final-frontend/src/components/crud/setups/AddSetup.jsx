import { useState } from "react";

export default function AddSetup() {
  // token and API_URL
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost/api";

  // Setup Information
  const [carName, setCarName] = useState("");
  const [trackName, setTrackName] = useState("");
  const [setupName, setSetupName] = useState("");

  // Tyres
  const [type_compound, setTypeCompound] = useState("");
  const [tyre_pressure_front, setFrontPresure] = useState();
  const [tyre_pressure_rear, setRearPresure] = useState();

  // Aerodinamic
  const [front_wing, setFrontWing] = useState();
  const [rear_wing, setRearWing] = useState();

  // Suspension
  const [front_arb, setFrontArb] = useState();
  const [rear_arb, setRearArb] = useState();
  const [rideHeightFront, setFrontHeight] = useState();
  const [rideHeightRear, setRearHeight] = useState();

  // Alineation
  const [camber_front, setCamberFront] = useState();
  const [camber_rear, setCamberRear] = useState();
  const [toeFront, setToeFront] = useState();
  const [toeRear, settoeRear] = useState();

  // Differential
  const [diff_power, setDiffPower] = useState();
  const [diff_coast, setDiffCoast] = useState();
  //   const [diff_preload, setDiffPreload] = useState();

  // Brake
  const [brake_bias, setBrakeBias] = useState();
  const [brake_power, setBrakePower] = useState();

  // Notes
  const [notes, addNotes] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("carName", carName);
    formData.append("trackName", trackName);
    formData.append("setupName", setupName);
    formData.append("type_compound", type_compound);

    formData.append("front_pressure", tyre_pressure_front);
    formData.append("rear_pressure", tyre_pressure_rear);

    formData.append("front_wing", front_wing);
    formData.append("rear_wing", rear_wing);

    formData.append("front_ARB", front_arb);
    formData.append("rear_ARB", rear_arb);
    formData.append("ride_height_front", rideHeightFront);
    formData.append("ride_height_rear", rideHeightRear);

    formData.append("front_camber", camber_front);
    formData.append("rear_camber", camber_rear);
    formData.append("front_toe", toeFront);
    formData.append("rear_toe", toeRear);

    formData.append("differential_power", diff_power);
    formData.append("differential_coast", diff_coast);

    formData.append("brake_bias", brake_bias);
    formData.append("brake_power", brake_power);

    const response = await fetch(`${API_URL}/addSetup`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log(data);

  };

  return (
    <div className="container mt-4">
      <h2>Create Setup</h2>

      {/* <!-- GENERAL --> */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">General</h5>

          <div className="mb-3">
            <label className="form-label">Setup name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setSetupName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Car</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setCarName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Circuit</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setTrackName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tyre compound</label>
            <select
              className="form-select"
              onChange={(e) => setTypeCompound(e.target.value)}
            >
              <option>Soft</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* <!-- ACCORDION --> */}
      <div className="accordion" id="setupAccordion">
        {/* <!-- TYRES --> */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              data-bs-toggle="collapse"
              data-bs-target="#tyres"
            >
              Tyres
            </button>
          </h2>
          <div id="tyres" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Front pressure (PSI)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    onChange={(e) => setFrontPresure(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rear pressure (PSI)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    onChange={(e) => setRearPresure(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- AERODYNAMICS --> */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#aero"
            >
              Aerodynamics
            </button>
          </h2>
          <div id="aero" className="accordion-collapse collapse">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Front wing</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setFrontWing(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rear wing</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setRearWing(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- SUSPENSION --> */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#suspension"
            >
              Suspension
            </button>
          </h2>
          <div id="suspension" className="accordion-collapse collapse">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Front ARB</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setFrontArb(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rear ARB</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setRearArb(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ride Height Front</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setFrontHeight(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ride Height Rear</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setRearHeight(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ALIGNMENT */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#alignment"
            >
              Alignment
            </button>
          </h2>

          <div id="alignment" className="accordion-collapse collapse">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Front camber (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    required
                    onChange={(e) => setCamberFront(e.target.value)}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Rear camber (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    required
                    onChange={(e) => setCamberRear(e.target.value)}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Front toe (°)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    onChange={(e) => setToeFront(e.target.value)}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Rear toe (°)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    onChange={(e) => settoeRear(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- DIFFERENTIAL --> */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#diff"
            >
              Differential
            </button>
          </h2>
          <div id="diff" className="accordion-collapse collapse">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Power</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setDiffPower(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Coast</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setDiffCoast(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- BRAKES --> */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#brakes"
            >
              Brakes
            </button>
          </h2>
          <div id="brakes" className="accordion-collapse collapse">
            <div className="accordion-body">
              <div className="mb-3">
                <label className="form-label">Brake bias (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  required
                  onChange={(e) => setBrakeBias(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Brake Power (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  required
                  onChange={(e) => setBrakePower(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Save Setup
      </button>
    </div>
  );
}

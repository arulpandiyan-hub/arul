{/* -----------------------------------------
    QUICK ACTIONS
----------------------------------------- */}

<section className="quick-actions-section">

  <div className="quick-actions-header">

    <div className="quick-actions-title">

      <div className="quick-actions-title-icon">
        <Zap size={18} />
      </div>

      <div>
        <h2>Quick Actions</h2>
        <p>Control your home instantly</p>
      </div>

    </div>

    <div className="quick-actions-status">
      <span className="quick-status-dot"></span>
      Ready
    </div>

  </div>


  <div className="quick-actions-grid">

    {/* LIGHT ON */}

    <button
      className="quick-action-card light-action"
      onClick={allLightsOn}
      disabled={loading || lightOn}
    >

      <div className="quick-action-left">

        <div className="quick-action-icon">
          <Lightbulb size={21} />
        </div>

        <div className="quick-action-info">
          <strong>Light ON</strong>

          <span>
            {lightOn
              ? "Already running"
              : "Turn on the light"}
          </span>
        </div>

      </div>

      <div className="quick-action-arrow">
        <ArrowRight size={17} />
      </div>

    </button>


    {/* LIGHT OFF */}

    <button
      className="quick-action-card light-off-action"
      onClick={allLightsOff}
      disabled={loading || !lightOn}
    >

      <div className="quick-action-left">

        <div className="quick-action-icon">
          <Lightbulb size={21} />
        </div>

        <div className="quick-action-info">
          <strong>Light OFF</strong>

          <span>
            {!lightOn
              ? "Already off"
              : "Turn off the light"}
          </span>
        </div>

      </div>

      <div className="quick-action-arrow">
        <ArrowRight size={17} />
      </div>

    </button>


    {/* FAN ON */}

    <button
      className="quick-action-card fan-action"
      onClick={() => controlDevice("fan", true)}
      disabled={loading || fanOn}
    >

      <div className="quick-action-left">

        <div className="quick-action-icon">
          <Fan size={21} />
        </div>

        <div className="quick-action-info">
          <strong>Fan ON</strong>

          <span>
            {fanOn
              ? "Already running"
              : "Turn on the fan"}
          </span>
        </div>

      </div>

      <div className="quick-action-arrow">
        <ArrowRight size={17} />
      </div>

    </button>


    {/* FAN OFF */}

    <button
      className="quick-action-card fan-off-action"
      onClick={() => controlDevice("fan", false)}
      disabled={loading || !fanOn}
    >

      <div className="quick-action-left">

        <div className="quick-action-icon">
          <Fan size={21} />
        </div>

        <div className="quick-action-info">
          <strong>Fan OFF</strong>

          <span>
            {!fanOn
              ? "Already off"
              : "Turn off the fan"}
          </span>
        </div>

      </div>

      <div className="quick-action-arrow">
        <ArrowRight size={17} />
      </div>

    </button>


    {/* EVERYTHING OFF */}

    <button
      className="quick-action-card everything-off-action"
      onClick={everythingOff}
      disabled={
        loading ||
        (!lightOn && !fanOn)
      }
    >

      <div className="quick-action-left">

        <div className="quick-action-icon">
          <Power size={21} />
        </div>

        <div className="quick-action-info">
          <strong>Everything OFF</strong>

          <span>
            {!lightOn && !fanOn
              ? "Everything is already off"
              : "Turn off all devices"}
          </span>
        </div>

      </div>

      <div className="quick-action-arrow">
        <ArrowRight size={17} />
      </div>

    </button>

  </div>

</section>
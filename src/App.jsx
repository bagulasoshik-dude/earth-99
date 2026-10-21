import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import './App.css'
import geoJsonData from './datasets/ne_110m_admin_0_countries.geojson?url'

function App() {
  const [countries, setCountries] = useState({ features: [] })
  const [hoverD, setHoverD] = useState()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const globeEl = useRef()

  useEffect(() => {
    fetch(geoJsonData)
      .then(res => res.json())
      .then(data => setCountries(data))
  }, [])

  const handlePolygonClick = (polygon) => {
    setSelectedCountry({
      name: polygon.properties.ADMIN,
      isoA2: polygon.properties.ISO_A2,
    })

    if (globeEl.current) {
        // Optional: you can animate the camera to the clicked country here.
    }
  }

  const closePanel = () => setSelectedCountry(null);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}>

      {/* Globe Component */}
      <Globe
        ref={globeEl}
        showAtmosphere={false}
        polygonsData={countries.features}
        polygonAltitude={0.005}
        polygonCapColor={d => d === hoverD ? 'rgba(255, 255, 255, 0.8)' : 'rgba(200, 0, 0, 0.6)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }) => `
          <div style="background: rgba(0,0,0,0.7); padding: 5px; border-radius: 4px; color: white;">
            <b>${d.ADMIN}</b>
          </div>
        `}
        onPolygonHover={setHoverD}
        onPolygonClick={handlePolygonClick}
      />

      {/* Selected Country Overlay Panel */}
      {selectedCountry && (
        <div
          id="country-panel"
          style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '10px',
          border: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          zIndex: 10,
          minWidth: '250px'
        }}>
          <button
            onClick={closePanel}
            style={{
              position: 'absolute',
              top: '5px',
              right: '10px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {selectedCountry.isoA2 && selectedCountry.isoA2 !== '-99' ? (
                <img
                src={`https://flagcdn.com/64x48/${selectedCountry.isoA2.toLowerCase()}.png`}
                alt={`${selectedCountry.name} flag`}
                style={{ borderRadius: '4px', border: '1px solid #555' }}
                />
            ) : (
                <div style={{ width: '64px', height: '48px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   N/A
                </div>
            )}
            <h2 id="country-name" style={{ margin: 0, fontFamily: 'sans-serif' }}>{selectedCountry.name}</h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

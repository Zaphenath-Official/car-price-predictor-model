import { useState } from 'react'
import './App.css'

const initialFormData = {
  year: '',
  manufacturer: '',
  model: '',
  condition: '',
  cylinders: '',
  fuel: '',
  odometer: '',
  state: '',
  title_status: 'clean',
  transmission: 'automatic',
  drive: 'fwd',
  size: 'mid-size',
  type: 'sedan',
  paint_color: 'silver',
  lat: 0,
}

const yearOptions = Array.from({ length: 2022 - 1900 + 1 }, (_, index) => String(1900 + index))
const manufacturerOptions = [
  'gmc', 'chevrolet', 'toyota', 'ford', 'jeep', 'nissan', 'ram', 'mazda',
  'cadillac', 'honda', 'dodge', 'lexus', 'jaguar', 'buick', 'chrysler', 'volvo',
  'audi', 'infiniti', 'lincoln', 'alfa-romeo', 'subaru', 'acura', 'hyundai',
  'mercedes-benz', 'bmw', 'mitsubishi', 'volkswagen', 'porsche', 'kia', 'rover',
  'ferrari', 'mini', 'pontiac', 'fiat', 'tesla', 'saturn', 'mercury',
  'harley-davidson', 'datsun', 'aston-martin', 'land rover', 'morgan',
]

const validVehicleCombinations = {
  gmc: ['sierra 1500', 'terrain', 'yukon', 'acadia', 'canyon'],
  chevrolet: ['silverado 1500', 'camaro', 'malibu', 'equinox', 'impala', 'corvette', 'traverse', 'cruze'],
  toyota: ['camry', 'corolla', 'rav4', 'highlander', 'prius', 'tacoma', '4runner', 'sienna', 'avalon'],
  ford: ['f-150', 'mustang', 'escape', 'focus', 'explorer', 'bronco', 'fusion', 'edge', 'expedition'],
  jeep: ['wrangler', 'grand cherokee', 'cherokee', 'compass', 'renegade', 'gladiator'],
  nissan: ['altima', 'sentra', 'rogue', 'pathfinder', 'maxima', 'frontier', 'murano', 'versa'],
  ram: ['1500', '2500', '3500', 'promaster'],
  mazda: ['mazda3', 'mazda6', 'cx-5', 'cx-9', 'miata'],
  cadillac: ['cts', 'escalade', 'xt5', 'xt4', 'ct5'],
  honda: ['civic', 'accord', 'cr-v', 'pilot', 'odyssey', 'fit', 'hr-v'],
  dodge: ['charger', 'challenger', 'durango', 'journey', 'grand caravan'],
  lexus: ['es', 'is', 'rx', 'gx', 'nx', 'ls'],
  jaguar: ['xe', 'xf', 'f-pace', 'e-pace', 'f-type'],
  buick: ['encore', 'enclave', 'regal', 'cascade', 'verano'],
  chrysler: ['300', 'pacifica', 'voyager', 'pt cruiser'],
  volvo: ['s60', 'v60', 'xc40', 'xc60', 'xc90'],
  audi: ['a3', 'a4', 'a6', 'q3', 'q5', 'q7'],
  infiniti: ['q50', 'q60', 'qx50', 'qx60', 'qx80'],
  lincoln: ['mkz', 'corsair', 'navigator', 'nautilus', 'mkc'],
  'alfa-romeo': ['giulia', 'stelvio', '4c'],
  subaru: ['impreza', 'outback', 'forester', 'legacy', 'crosstrek'],
  acura: ['integra', 'tlx', 'mdx', 'rdx', 'ilx'],
  hyundai: ['elantra', 'sonata', 'tucson', 'santa fe', 'kona'],
  'mercedes-benz': ['c-class', 'e-class', 's-class', 'gle', 'glc', 'cla'],
  bmw: ['3 series', '5 series', 'x3', 'x5', 'm4'],
  mitsubishi: ['lancer', 'outlander', 'mirage', 'eclipse cross'],
  volkswagen: ['golf', 'jetta', 'tiguan', 'atlas', 'passat'],
  porsche: ['911', 'cayenne', 'panthera', 'boxster', 'macan'],
  kia: ['soul', 'sportage', 'sorento', 'forte', 'telluride'],
  rover: ['75', '200', '400'],
  ferrari: ['488', 'f8', 'roma', 'sf90'],
  mini: ['cooper', 'countryman', 'clubman'],
  pontiac: ['gto', 'grand prix', 'bonneville'],
  fiat: ['500', '500x', 'panda'],
  tesla: ['model 3', 'model s', 'model x', 'model y'],
  saturn: ['ion', 'vue', 'astra'],
  mercury: ['grand marquis', 'mountaineer', 'milan'],
  'harley-davidson': ['sportster', 'street glide', 'road king'],
  datsun: ['240z', '280z', 'sentra'],
  'aston-martin': ['db11', 'vantage', 'dbx'],
  'land rover': ['range rover', 'discovery', 'defender', 'evoque'],
  morgan: ['4/4', 'plus 4', 'plus 8'],
}

const validTypeSizeCombinations = {
  sedan: ['compact', 'mid-size', 'full-size'],
  suv: ['compact', 'mid-size', 'full-size'],
  truck: ['mid-size', 'full-size'],
  coupe: ['compact', 'mid-size'],
  hatchback: ['compact', 'mid-size'],
  wagon: ['mid-size', 'full-size'],
  van: ['full-size'],
}

const getCombinationError = (manufacturer, model, size, type) => {
  const normalizedManufacturer = String(manufacturer || '').trim().toLowerCase()
  const normalizedModel = String(model || '').trim().toLowerCase()
  const normalizedSize = String(size || '').trim().toLowerCase()
  const normalizedType = String(type || '').trim().toLowerCase()

  if (!normalizedManufacturer) return 'Please select a manufacturer.'
  if (!normalizedModel) return 'Please enter a model.'

  const supportedModels = validVehicleCombinations[normalizedManufacturer]
  if (!supportedModels) {
    return 'That manufacturer is not supported for safe predictions.'
  }

  if (!supportedModels.some((supportedModel) => supportedModel.toLowerCase() === normalizedModel)) {
    return `There is no such car combination for ${manufacturer} ${model}.`
  }

  if (!validTypeSizeCombinations[normalizedType]) {
    return 'That vehicle type is not supported for safe predictions.'
  }

  if (!validTypeSizeCombinations[normalizedType].includes(normalizedSize)) {
    return `There is no such car combination for ${normalizedType} in ${normalizedSize} size.`
  }

  return ''
}
const conditionOptions = ['excellent', 'good', 'fair', 'like new', 'new', 'salvage']
const cylinderOptions = ['4 cylinders', '6 cylinders', '8 cylinders', '5 cylinders', 'other', '3 cylinders', '10 cylinders', '12 cylinders']
const fuelOptions = ['petrol', 'diesel', 'cng', 'hybrid', 'electric']
const stateOptions = [
  'az', 'ar', 'fl', 'ma', 'nc', 'ny', 'or', 'pa', 'tx', 'wa', 'wi', 'al', 'ak', 'ca',
  'co', 'ct', 'dc', 'de', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me',
  'md', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nj', 'nm', 'nh', 'nd', 'oh', 'ok',
  'ri', 'sc', 'sd', 'tn', 'ut', 'vt', 'va', 'wv', 'wy',
]

function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (event) => {
    event.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult('')

    try {
      const manufacturer = String(formData.manufacturer || '').trim().toLowerCase()
      const model = String(formData.model || '').trim().toLowerCase()
      const combinationError = getCombinationError(manufacturer, model, 'mid-size', 'sedan')

      if (combinationError) {
        setError(combinationError)
        setLoading(false)
        return
      }

      const payload = {
        year: Number(formData.year),
        odometer: Number(formData.odometer),
        lat: Number(formData.lat || 37.7),
        model,
        size: 'mid-size',
        type: 'sedan',
        manufacturer,
        cylinders: String(formData.cylinders || '').toLowerCase(),
        state: String(formData.state || '').toLowerCase(),
        condition: String(formData.condition || '').toLowerCase(),
      }

      const response = await fetch('/api/predict_price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed')
      }

      setResult(`Estimated Price: $${Number(data.estimated_price).toLocaleString()}`)
    } catch (err) {
      setError(err.message || 'Unable to estimate price right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="bg-card">
      <div className="overlay">
        <nav className="navbar">
          <div className="logo">
            <video className="logo-video" src="/public/animated_logo.mp4" autoPlay={false} muted playsInline loop={false} />
            <span className="brand-name">CarPort</span>
          </div>

          <div className="nav-actions">
            <ul className="nav-links desktop-nav">
              <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
              <li><a href="#help" onClick={() => setMenuOpen(false)}>Help</a></li>
              <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            </ul>

            <a href="#contact" className="contact-link desktop-link" onClick={() => setMenuOpen(false)}>Contact</a>

            <button type="button" className="menu-toggle" onClick={toggleMenu} aria-expanded={menuOpen} aria-label="Toggle navigation">
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#help" onClick={() => setMenuOpen(false)}>Help</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        )}

        <div className="row">
          <div className="card info-card">
            <p className="lead-text">
              Start Your Journey With <span id="company_name">CarPort</span> Today!
            </p>
            <p>
              Find the best deals on cars that match your needs. Estimate the price of the car you desire with CarPort's price estimator.
            </p>
          </div>

          <div className="card form-card">
            <div className="form-header">
              <video className="form-logo-video" src="/src/assets/animated_logo.mp4" autoPlay muted playsInline loop />
              <p className="form-intro">Tell us about your vehicle</p>
              <div className="divider" />
            </div>

            <form onSubmit={handleSubmit} className="step-form">
              <div className="form-grid">
                {step === 1 ? (
                  <>
                    <div className="form-group accent-group">
                      <label htmlFor="year">Year</label>
                      <select name="year" id="year" value={formData.year} onChange={handleChange}>
                        <option value="">Select year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group select-group">
                      <label htmlFor="manufacturer">Manufacturer</label>
                      <select name="manufacturer" id="manufacturer" value={formData.manufacturer} onChange={handleChange}>
                        <option value="">Select brand</option>
                        {manufacturerOptions.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group pill-group">
                      <label htmlFor="model">Model</label>
                      <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} placeholder="Camry" list="model-options" />
                      <datalist id="model-options">
                        {(formData.manufacturer ? validVehicleCombinations[formData.manufacturer.toLowerCase()] || [] : [])
                          .map((modelName) => (
                            <option key={modelName} value={modelName} />
                          ))}
                      </datalist>
                    </div>

                    <div className="form-group">
                      <label htmlFor="condition">Condition</label>
                      <select name="condition" id="condition" value={formData.condition} onChange={handleChange}>
                        <option value="">Select condition</option>
                        {conditionOptions.map((condition) => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group accent-group">
                      <label htmlFor="cylinders">Cylinders</label>
                      <select name="cylinders" id="cylinders" value={formData.cylinders} onChange={handleChange}>
                        <option value="">Select cylinders</option>
                        {cylinderOptions.map((cylinder) => (
                          <option key={cylinder} value={cylinder}>{cylinder}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group select-group">
                      <label htmlFor="fuel">Fuel</label>
                      <select name="fuel" id="fuel" value={formData.fuel} onChange={handleChange}>
                        <option value="">Select fuel</option>
                        {fuelOptions.map((fuel) => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group pill-group">
                      <label htmlFor="odometer">Odometer</label>
                      <input type="number" name="odometer" id="odometer" value={formData.odometer} onChange={handleChange} placeholder="75000" />
                    </div>

                    <div className="form-group pill-group">
                      <label htmlFor="lat">Latitude</label>
                      <input type="number" name="lat" id="lat" value={formData.lat} onChange={handleChange} placeholder="34" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <select name="state" id="state" value={formData.state} onChange={handleChange}>
                        <option value="">Select state</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>{state.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="step-nav">
                {step === 2 ? (
                  <button type="button" className="nav-btn back-btn" onClick={handleBack}>
                    <span className="arrow">←</span> Back
                  </button>
                ) : (
                  <span className="nav-spacer" />
                )}

                {step === 1 ? (
                  <button type="button" className="nav-btn next-btn" onClick={handleNext}>
                    Next <span className="arrow">→</span>
                  </button>
                ) : (
                  <button type="submit" className="nav-btn next-btn" disabled={loading}>
                    {loading ? 'Estimating…' : 'Estimate Price'} <span className="arrow">→</span>
                  </button>
                )}
              </div>

              {result && <div className="result-card">{result}</div>}
              {error && <div className="error-card">{error}</div>}

              <div className="step-dots" aria-label="Form progress">
                <span className={`dot ${step === 1 ? 'active' : ''}`} />
                <span className={`dot ${step === 2 ? 'active' : ''}`} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

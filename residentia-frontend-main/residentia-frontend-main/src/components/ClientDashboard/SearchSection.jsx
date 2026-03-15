import styles from "./ClientDashboard.module.css";

const SearchSection = ({
  selectedCity,
  setSelectedCity,
  selectedBudget,
  setSelectedBudget,
  selectedType,
  setSelectedType,
  foodIncluded,
  setFoodIncluded
}) => (
  <div className={styles.searchCard}>
    <h2 className={styles.searchTitle}>Find your perfect stay</h2>

    <div className="row g-3">
      <div className="col-md-3">
        <select className="form-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
          <option value="">City</option>
          <option>Noida</option>
          <option>Bangalore</option>
          <option>Pune</option>
          <option>Mumbai</option>
        </select>
      </div>

      <div className="col-md-3">
        <select className="form-select" value={selectedBudget} onChange={e => setSelectedBudget(e.target.value)}>
          <option value="">Budget</option>
          <option value="5000-10000">₹5k - ₹10k</option>
          <option value="10000-15000">₹10k - ₹15k</option>
          <option value="15000-20000">₹15k - ₹20k</option>
          <option value="20000+">₹20k+</option>
        </select>
      </div>

      <div className="col-md-3">
        <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          <option value="">Sharing</option>
          <option value="1">1 Sharing</option>
          <option value="2">2 Sharing</option>
          <option value="3">3 Sharing</option>
          <option value="4+">4+ Sharing</option>
        </select>
      </div>

      <div className="col-md-3 d-flex align-items-center">
        <input type="checkbox" checked={foodIncluded} onChange={e => setFoodIncluded(e.target.checked)} />
        <span className="ms-2">Food Included</span>
      </div>
    </div>
  </div>
);

export default SearchSection;

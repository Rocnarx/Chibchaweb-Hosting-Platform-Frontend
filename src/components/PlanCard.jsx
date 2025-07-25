import './PlanCard.css';

function PlanCard({ title, description, icon }) {
  return (
    <div className="plan-card">
      <div className="plan-icon">
        <img src={icon} alt="icono servidor" />
      </div>
      <h2 className="plan-title">{title}</h2>
      <p className="plan-description">{description}</p>
    </div>
  );
}

export default PlanCard;

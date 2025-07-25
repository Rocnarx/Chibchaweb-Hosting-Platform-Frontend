import './Plans.css';
import PlanCard from './PlanCard';
import iconoPrimero from './resources/primero.png';
import iconoSegundo from './resources/segundo.png';
import iconoTercero from './resources/tercero.png';

function Plans() {
  const plans = [
    {
      title: 'Todo lo que necesitas en un solo lugar',
      description: 'Registra tu dominio y activa tu hosting sin complicaciones. No necesitas ir a ningún otro sitio web.',
      icon: iconoPrimero,
    },
    {
      title: 'Te ayudamos cuando lo necesitas',
      description: '¿Tienes dudas? Estamos para ayudarte. Nuestro equipo de soporte está disponible para ti.',
      icon: iconoSegundo,
    },
    {
      title: 'Tu sitio siempre disponible',
      description: 'Nos encargamos de que tu página funcione sin interrupciones y esté accesible las 24 horas del día, los 7 días de la semana.',
      icon: iconoTercero,
    },
  ];

  return (
    <section className="plans-section">
      <div className="plans-grid">
        {plans.map((plan, i) => (
          <PlanCard
            key={i}
            title={plan.title}
            description={plan.description}
            icon={plan.icon}
          />
        ))}
      </div>
    </section>
  );
}

export default Plans;

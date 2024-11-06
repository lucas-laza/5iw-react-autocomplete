import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

export default function ProductTemplate({ element }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <FontAwesomeIcon icon={faStore} />
      <span>{element.name}</span>
      <span style={{ marginLeft: 'auto' }}>{element.price} $</span>
    </div>
  );
}

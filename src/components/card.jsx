import { Link } from 'react-router-dom';

function Card({data}) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={`https://pets.сделай.site${data.photos}`} className="card-img-top" alt={data.description} style={{ width: '100%', height: '300px', objectFit: 'cover' }}/>
        <div className="card-body">
          <h5 className="card-title">{data.kind} ({data.mark})</h5>
          <p className="card-text">{data.description}</p>
          <p className="card-text">
            <small className="text-muted">Дата: {new Date(data.date).toLocaleDateString()}</small>
          </p>
          <p className="card-text">
            <small className="text-muted">Район: {data.district}</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;
